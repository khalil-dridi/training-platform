"""
FastAPI service for course recommendations.

ML model: fitted once from the Excel dataset (not from MySQL).
MySQL: learner existence, real enrollments, live course metadata.

Run from the mla/ folder:
    uvicorn src.api:app --reload --port 8000

If uvicorn is not on PATH (Windows), use:
    python -m uvicorn src.api:app --reload --port 8000

Example:
    GET http://localhost:8000/api/recommendations/1?top_n=5
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query

from src.database import (
    get_all_courses,
    get_enrolled_course_ids,
    learner_exists as learner_exists_in_db,
)
from src.recommender import (
    fit,
    learner_exists as learner_exists_in_model,
    recommend_courses,
    recommend_popular_courses,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the Excel dataset and fit the recommender once at startup."""
    print("Fitting recommender model from Excel dataset...")
    fit()
    print("Recommender ready.")
    yield


app = FastAPI(
    title="Training Platform Recommendations",
    description="User-based collaborative filtering API",
    lifespan=lifespan,
)


def _to_api_item(info: dict, score: int) -> dict:
    """Build the camelCase recommendation object for Spring Boot."""
    return {
        "courseId": info["id"],
        "title": info["title"],
        "language": info["language"],
        "level": info["level"],
        "price": info["price"],
        "category": info["category"],
        "score": score,
    }


@app.get("/api/recommendations/{learner_id}")
def get_recommendations(
    learner_id: int,
    top_n: int = Query(default=5, ge=1, le=20),
):
    """
    Return top-N course recommendations for a learner.

    - ML scores come from the Excel-trained collaborative filter
    - Learner existence / enrollments / course details come from MySQL
    - Already enrolled courses are never recommended
    """
    # 1) Verify the learner exists in the real database
    try:
        exists = learner_exists_in_db(learner_id)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Database unavailable: {exc}",
        ) from exc

    if not exists:
        raise HTTPException(
            status_code=404,
            detail=f"Learner {learner_id} not found",
        )

    # 2) Real enrollments to exclude from recommendations
    try:
        enrolled_ids = get_enrolled_course_ids(learner_id)
        catalog = get_all_courses()
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Database unavailable: {exc}",
        ) from exc

    # 3) Ask the ML model for candidates (Excel-trained, not MySQL-trained)
    candidate_n = max(top_n * 5, top_n + 20)
    if learner_exists_in_model(learner_id):
        candidates = recommend_courses(
            learner_id=learner_id,
            top_n=candidate_n,
            exclude_course_ids=enrolled_ids,
        )
    else:
        # Cold start: learner is in MySQL but not in the synthetic ML matrix
        candidates = recommend_popular_courses(
            top_n=candidate_n,
            exclude_course_ids=enrolled_ids,
        )

    # Candidate scores by course id (from ML)
    ml_scores = {item["course_id"]: item["score"] for item in candidates}

    # 4) Prefer ML candidates that also exist in the real catalog
    recommendations = []
    used_ids = set()
    for item in candidates:
        course_id = item["course_id"]
        if course_id in enrolled_ids or course_id in used_ids:
            continue
        info = catalog.get(course_id)
        if info is None:
            continue
        recommendations.append(_to_api_item(info, item["score"]))
        used_ids.add(course_id)
        if len(recommendations) >= top_n:
            break

    # 5) If the real catalog is still small / IDs barely overlap with the
    #    synthetic dataset, fill remaining slots with other MySQL courses
    #    (never enrolled), ranked by ML popularity when available.
    if len(recommendations) < top_n:
        # Score all synthetic courses, then keep only those present in MySQL
        popular = recommend_popular_courses(
            top_n=50,
            exclude_course_ids=enrolled_ids | used_ids,
        )
        popular_scores = {item["course_id"]: item["score"] for item in popular}

        # Rank real catalog courses: ML score first, then course id
        remaining = [
            info
            for course_id, info in catalog.items()
            if course_id not in enrolled_ids and course_id not in used_ids
        ]
        remaining.sort(
            key=lambda info: (
                -popular_scores.get(info["id"], ml_scores.get(info["id"], 0)),
                info["id"],
            )
        )
        for info in remaining:
            score = popular_scores.get(info["id"], ml_scores.get(info["id"], 0))
            recommendations.append(_to_api_item(info, int(score)))
            if len(recommendations) >= top_n:
                break

    return {
        "learnerId": learner_id,
        "recommendations": recommendations,
    }


@app.get("/health")
def health():
    """Simple health check for local testing."""
    return {"status": "ok"}
