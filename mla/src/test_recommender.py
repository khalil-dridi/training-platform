"""
Small test script for the course recommendation prototype.

Run from the src/ folder:
    python test_recommender.py
"""

from recommender import fit, recommend_courses, evaluate, load_dataset

print("========== LOAD & FIT ==========")
df = load_dataset()
print(f"Dataset shape: {df.shape}")
print(f"Learners: {df['learner_id'].nunique()} | Courses: {df['course_id'].nunique()}")

matrix, similarity_df = fit(df)
print(f"Interaction matrix: {matrix.shape}")
print(f"Similarity matrix:  {similarity_df.shape}")


# ---- Test recommendations for learner 1 ----
print("\n========== TOP 5 RECOMMENDATIONS FOR LEARNER 1 ==========")
recs = recommend_courses(learner_id=1, top_n=5)

for i, item in enumerate(recs, start=1):
    print(
        f"{i}. Course {item['course_id']}: {item['title']} "
        f"(score={item['score']})"
    )


# ---- Leave-one-out evaluation ----
print("\n========== EVALUATION (leave-one-out, top-5) ==========")
metrics = evaluate(df, top_n=5, n_neighbors=5, random_state=42)

print(f"Learners evaluated : {metrics['n']}")
print(f"Hit Rate@5         : {metrics['hit_rate@5']:.4f}")
print(f"Precision@5        : {metrics['precision@5']:.4f}")
print(f"Recall@5           : {metrics['recall@5']:.4f}")
