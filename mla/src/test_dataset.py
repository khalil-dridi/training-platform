"""
Exploratory analysis of the Training Platform ML dataset.

For recommendations and evaluation, use:
    python test_recommender.py
"""

import pandas as pd

# =========================
# 1. Charger le dataset
# =========================

df = pd.read_excel("../dataset/training_platform_ml_dataset.xlsx")

print("========== APERÇU DU DATASET ==========")
print(df.head())

print("\nDimensions :", df.shape)

print("\nColonnes :")
print(df.columns.tolist())


# =========================
# 2. Valeurs manquantes
# =========================

print("\n========== VALEURS MANQUANTES ==========")
print(df.isnull().sum())


# =========================
# 3. Doublons
# =========================

print("\n========== DOUBLONS ==========")
print("Nombre de doublons :", df.duplicated().sum())


# =========================
# 4. Nombre de learners
# =========================

print("\n========== LEARNERS ==========")
print("Nombre de learners :", df["learner_id"].nunique())


# =========================
# 5. Nombre de cours
# =========================

print("\n========== COURS ==========")
print("Nombre de cours :", df["course_id"].nunique())


# =========================
# 6. Inscriptions par cours
# =========================

print("\n========== INSCRIPTIONS PAR COURS ==========")
print(df["course_id"].value_counts().sort_index())


# =========================
# 7. Cours par learner
# =========================

print("\n========== COURS PAR LEARNER ==========")
print(df["learner_id"].value_counts().describe())


# =========================
# 8. Distribution des catégories
# =========================

print("\n========== CATÉGORIES ==========")
print(df["category"].value_counts())


# =========================
# 9. Distribution des niveaux
# =========================

print("\n========== NIVEAUX ==========")
print(df["level"].value_counts())


# =========================
# 10. Distribution des languages
# =========================

print("\n========== LANGUAGES ==========")
print(df["language"].value_counts())


# =========================
# 11. Distribution des prix
# =========================

print("\n========== PRIX ==========")
print(df["price_usd"].describe())


# =========================
# 12. Vérification enrolled
# =========================

print("\n========== ENROLLED ==========")
print(df["enrolled"].value_counts())


# =========================
# 13. Statistiques générales
# =========================

print("\n========== STATISTIQUES GÉNÉRALES ==========")
print(df.describe(include="all"))
