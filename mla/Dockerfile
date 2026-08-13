# =========================
# Stage 1 : Runtime
# =========================
FROM python:3.11-slim

WORKDIR /app


# Installer les dépendances
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt


# Copier le projet
COPY . .


EXPOSE 8000


# Démarrer FastAPI
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]