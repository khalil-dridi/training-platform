"""
MySQL access for the MLA recommendation service.

The ML model still uses the Excel dataset.
MySQL is used only for:
- verifying that a learner exists
- reading real enrollment history
- reading current course metadata

Configuration comes from environment variables (see .env.example).
"""

import os
from contextlib import contextmanager
from pathlib import Path

import pymysql
from dotenv import load_dotenv

# Load mla/.env if present (does not override already-set env vars)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")


def _db_config():
    """Read DB settings from environment. Credentials are never hardcoded."""
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    name = os.getenv("DB_NAME")
    user = os.getenv("DB_USER")
    # Empty password is allowed for local MySQL, but the variable must be set
    password_set = "DB_PASSWORD" in os.environ
    password = os.getenv("DB_PASSWORD", "")

    missing = [
        key
        for key, value in [
            ("DB_HOST", host),
            ("DB_PORT", port),
            ("DB_NAME", name),
            ("DB_USER", user),
        ]
        if not value
    ]
    if not password_set:
        missing.append("DB_PASSWORD")

    if missing:
        raise RuntimeError(
            "Missing database environment variables: " + ", ".join(missing)
        )

    return {
        "host": host,
        "port": int(port),
        "database": name,
        "user": user,
        "password": password,
        "charset": "utf8mb4",
        "cursorclass": pymysql.cursors.DictCursor,
    }


@contextmanager
def get_connection():
    """Open a short-lived MySQL connection."""
    connection = pymysql.connect(**_db_config())
    try:
        yield connection
    finally:
        connection.close()


def learner_exists(learner_id: int) -> bool:
    """
    Return True if the learner exists in the real users table.

    Learners are rows in `users` (no separate learners table).
    """
    sql = "SELECT 1 AS ok FROM users WHERE id = %s LIMIT 1"
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, (learner_id,))
            return cursor.fetchone() is not None


def get_enrolled_course_ids(learner_id: int) -> set[int]:
    """
    Return the set of course IDs already enrolled by the learner
    from the real `enrollments` table.
    """
    sql = """
        SELECT course_id
        FROM enrollments
        WHERE learner_id = %s
    """
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, (learner_id,))
            rows = cursor.fetchall()
    return {int(row["course_id"]) for row in rows}


def _row_to_course(row: dict) -> dict:
    """Map a SQL row to the course payload used by the API."""
    price = row["price"]
    return {
        "id": int(row["id"]),
        "title": row["title"],
        "language": row["language"],
        "level": row["level"],
        "price": float(price) if price is not None else None,
        "category": row["category"],
    }


def get_courses_by_ids(course_ids: list[int]) -> dict[int, dict]:
    """
    Retrieve course information from the real `courses` table.

    Returns a dict keyed by course id with:
    id, title, language, level, price, category
    """
    if not course_ids:
        return {}

    placeholders = ", ".join(["%s"] * len(course_ids))
    sql = f"""
        SELECT
            c.id,
            c.title,
            c.language,
            c.level,
            c.price,
            cat.name AS category
        FROM courses c
        INNER JOIN categories cat ON cat.id = c.category_id
        WHERE c.id IN ({placeholders})
    """
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, tuple(course_ids))
            rows = cursor.fetchall()

    courses = {}
    for row in rows:
        course = _row_to_course(row)
        courses[course["id"]] = course
    return courses


def get_all_courses() -> dict[int, dict]:
    """
    Retrieve all courses from the real catalog.

    Useful when the synthetic ML course IDs do not overlap much
    with the current MySQL catalog (small real dataset).
    """
    sql = """
        SELECT
            c.id,
            c.title,
            c.language,
            c.level,
            c.price,
            cat.name AS category
        FROM courses c
        INNER JOIN categories cat ON cat.id = c.category_id
        ORDER BY c.id
    """
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql)
            rows = cursor.fetchall()

    courses = {}
    for row in rows:
        course = _row_to_course(row)
        courses[course["id"]] = course
    return courses
