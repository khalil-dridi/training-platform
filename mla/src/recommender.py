"""
User-based collaborative filtering for the Training Platform.

Approach:
1. Build a learner x course enrollment matrix (1 = enrolled, 0 otherwise)
2. Compute cosine similarity between learners
3. Recommend courses liked by similar learners, excluding already enrolled ones
"""

from pathlib import Path

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# Default path to the Excel dataset (do not modify the file)
DEFAULT_DATASET = (
    Path(__file__).resolve().parent.parent
    / "dataset"
    / "training_platform_ml_dataset.xlsx"
)

# Module state filled by fit() so recommend_courses(learner_id) stays simple
_matrix = None
_similarity_df = None
_course_titles = None


def load_dataset(path=None):
    """Load the enrollment dataset from Excel (read-only)."""
    dataset_path = Path(path) if path else DEFAULT_DATASET
    return pd.read_excel(dataset_path)


def build_interaction_matrix(df):
    """
    Build the learner-course interaction matrix.

    rows = learner_id, columns = course_id, values = 1 if enrolled else 0
    """
    return pd.crosstab(df["learner_id"], df["course_id"])


def build_similarity_matrix(matrix):
    """Compute cosine similarity between all learners."""
    scores = cosine_similarity(matrix)
    return pd.DataFrame(scores, index=matrix.index, columns=matrix.index)


def get_course_titles(df):
    """Map course_id -> title from the dataset."""
    return (
        df[["course_id", "title"]]
        .drop_duplicates()
        .set_index("course_id")["title"]
    )


def fit(df=None, path=None):
    """
    Prepare the full model (matrix + similarity + titles).

    Call this once before recommend_courses(), or it will be called automatically.
    """
    global _matrix, _similarity_df, _course_titles

    if df is None:
        df = load_dataset(path)

    _matrix = build_interaction_matrix(df)
    _similarity_df = build_similarity_matrix(_matrix)
    _course_titles = get_course_titles(df)
    return _matrix, _similarity_df


def learner_exists(learner_id):
    """Return True if the learner is present in the fitted matrix."""
    if _matrix is None:
        fit()
    return learner_id in _matrix.index


def _enrolled_courses(matrix, learner_id):
    """Return the set of course_ids already enrolled by a learner."""
    return set(matrix.columns[matrix.loc[learner_id] == 1].tolist())


def recommend_courses(learner_id, top_n=5, n_neighbors=5, matrix=None,
                      similarity_df=None, course_titles=None,
                      exclude_course_ids=None):
    """
    Recommend courses for one learner (user-based collaborative filtering).

    Steps:
    1. Find the most similar learners (cosine similarity)
    2. Collect courses they enrolled in
    3. Remove courses already enrolled by the target learner
       (matrix enrollments + optional exclude_course_ids from MySQL)
    4. Rank remaining courses by how many neighbors enrolled in them
    5. Return top_n recommendations with course_id, title and score

    Parameters
    ----------
    learner_id : int
        Target learner.
    top_n : int
        Number of courses to return.
    n_neighbors : int
        Number of similar learners used to generate recommendations.
    matrix, similarity_df, course_titles :
        Optional overrides (useful for train/test evaluation).
        If omitted, the module state from fit() is used.
    exclude_course_ids : iterable of int, optional
        Extra course IDs to exclude (e.g. real MySQL enrollments).

    Returns
    -------
    list of dict
        Each dict has: course_id, title, score
        score = number of similar learners who enrolled in that course
    """
    # Use provided objects, otherwise the fitted module state
    if matrix is None or similarity_df is None or course_titles is None:
        if _matrix is None:
            fit()
        matrix = matrix if matrix is not None else _matrix
        similarity_df = (
            similarity_df if similarity_df is not None else _similarity_df
        )
        course_titles = (
            course_titles if course_titles is not None else _course_titles
        )

    if learner_id not in matrix.index:
        return []

    # 1) Most similar learners (exclude the learner itself)
    similar = (
        similarity_df.loc[learner_id]
        .drop(labels=learner_id, errors="ignore")
        .sort_values(ascending=False)
        .head(n_neighbors)
    )

    # 2) Courses already known by the target learner (+ optional MySQL excludes)
    known_courses = _enrolled_courses(matrix, learner_id)
    if exclude_course_ids:
        known_courses = known_courses | {int(c) for c in exclude_course_ids}

    # 3) Count how many neighbors enrolled in each unknown course
    course_counts = {}
    for neighbor_id in similar.index:
        neighbor_courses = _enrolled_courses(matrix, neighbor_id)
        for course_id in neighbor_courses:
            if course_id in known_courses:
                continue
            course_counts[course_id] = course_counts.get(course_id, 0) + 1

    # 4) Rank by neighbor count (score), then take top_n
    ranked = sorted(course_counts.items(), key=lambda item: item[1], reverse=True)

    recommendations = []
    for course_id, score in ranked[:top_n]:
        title = course_titles.loc[course_id] if course_id in course_titles.index else ""
        recommendations.append(
            {
                "course_id": int(course_id),
                "title": title,
                "score": int(score),
            }
        )
    return recommendations


def recommend_popular_courses(top_n=5, exclude_course_ids=None,
                              matrix=None, course_titles=None):
    """
    Cold-start fallback: recommend the most popular courses in the ML matrix.

    Used when the real MySQL learner is not present in the synthetic model.
    """
    if matrix is None or course_titles is None:
        if _matrix is None:
            fit()
        matrix = matrix if matrix is not None else _matrix
        course_titles = (
            course_titles if course_titles is not None else _course_titles
        )

    excluded = {int(c) for c in (exclude_course_ids or [])}
    popularity = matrix.sum(axis=0).sort_values(ascending=False)

    recommendations = []
    for course_id, count in popularity.items():
        course_id = int(course_id)
        if course_id in excluded:
            continue
        title = (
            course_titles.loc[course_id]
            if course_id in course_titles.index
            else ""
        )
        recommendations.append(
            {
                "course_id": course_id,
                "title": title,
                "score": int(count),
            }
        )
        if len(recommendations) >= top_n:
            break
    return recommendations


def leave_one_out_split(df, random_state=42):
    """
    For each learner, hide one enrolled course as a test item.

    Returns
    -------
    train_df : DataFrame
        All interactions except the hidden ones.
    test_pairs : list of (learner_id, course_id)
        One hidden course per learner.
    """
    # One random enrollment per learner (reproducible with random_state)
    test_rows = (
        df.groupby("learner_id", group_keys=False)
        .sample(n=1, random_state=random_state)
    )
    test_pairs = list(
        zip(test_rows["learner_id"].tolist(), test_rows["course_id"].tolist())
    )
    train_df = df.drop(index=test_rows.index)
    return train_df, test_pairs


def evaluate(df=None, path=None, top_n=5, n_neighbors=5, random_state=42):
    """
    Simple leave-one-out evaluation.

    For each learner:
    - hide 1 enrolled course
    - build the matrix on remaining interactions
    - generate top_n recommendations
    - check whether the hidden course appears in the list

    Metrics (averaged over learners):
    - Hit Rate@K  : 1 if hidden course is recommended, else 0
    - Precision@K : hits / K
    - Recall@K    : hits / 1  (only one relevant item is hidden)
    """
    if df is None:
        df = load_dataset(path)

    train_df, test_pairs = leave_one_out_split(df, random_state=random_state)

    # Fit only on training interactions
    matrix = build_interaction_matrix(train_df)
    similarity_df = build_similarity_matrix(matrix)
    course_titles = get_course_titles(df)

    hits = 0
    precision_sum = 0.0
    recall_sum = 0.0
    evaluated = 0

    for learner_id, hidden_course in test_pairs:
        # Skip if the learner disappeared from the train matrix
        if learner_id not in matrix.index:
            continue

        recommendations = recommend_courses(
            learner_id,
            top_n=top_n,
            n_neighbors=n_neighbors,
            matrix=matrix,
            similarity_df=similarity_df,
            course_titles=course_titles,
        )
        recommended_ids = {item["course_id"] for item in recommendations}

        hit = 1 if hidden_course in recommended_ids else 0
        hits += hit
        precision_sum += hit / top_n
        recall_sum += hit / 1.0  # one relevant item hidden
        evaluated += 1

    if evaluated == 0:
        return {"hit_rate@5": 0.0, "precision@5": 0.0, "recall@5": 0.0, "n": 0}

    return {
        "hit_rate@5": hits / evaluated,
        "precision@5": precision_sum / evaluated,
        "recall@5": recall_sum / evaluated,
        "n": evaluated,
    }
