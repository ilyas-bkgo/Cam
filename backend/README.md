# Backend VigiCam Sécurité (FastAPI + PostgreSQL + SQLAlchemy + Alembic)

Ce dossier contient l'ensemble du backend d'entreprise pour la plateforme de vidéosurveillance **VigiCam**, développé avec la pile moderne Python :

- **FastAPI** : Framework haute performance avec documentation OpenAPI automatique (`/docs` et `/redoc`)
- **SQLAlchemy 2.0** : ORM pour la modélisation relationnelle des devis, interventions, équipements et avis
- **Alembic** : Gestion des migrations de base de données
- **PostgreSQL 16** : Base de données relationnelle robuste
- **Pydantic v2** : Validation stricte des données d'entrée et sérialisation

---

## 📁 Architecture du Dossier Backend

```
backend/
├── app/
│   ├── config.py           # Configuration de l'environnement (Pydantic Settings)
│   ├── database.py         # Moteur SQLAlchemy, SessionLocal & dépendance get_db
│   ├── models.py           # Modèles de tables SQLAlchemy (Quotes, Interventions, Cameras, etc.)
│   ├── schemas.py          # Schémas de validation Pydantic v2
│   ├── crud.py             # Logique métier et requêtes SQL
│   ├── routers/
│   │   ├── quotes.py       # API Devis (/api/quotes)
│   │   ├── interventions.py# API Interventions & Pannes (/api/interventions)
│   │   ├── cameras.py      # API Matériel & Caméras (/api/cameras)
│   │   ├── testimonials.py # API Avis clients (/api/testimonials)
│   │   ├── tracking.py     # API Suivi en direct (/api/tracking/{code})
│   │   └── auth.py         # API Authentification console (/api/auth)
│   └── main.py             # Point d'entrée FastAPI avec CORS et injection des données démo
├── alembic/
│   ├── env.py              # Configuration de migration SQLAlchemy
│   ├── versions/           # Scripts de migrations horodatés
│   └── script.py.mako
├── alembic.ini             # Configuration Alembic
├── docker-compose.yml      # Lancement combiné PostgreSQL + FastAPI en 1 commande
├── Dockerfile              # Image Docker du service FastAPI
├── requirements.txt        # Dépendances Python
└── .env.example            # Variables d'environnement type
```

---

## 🚀 Démarrage Rapide

### Option A : Avec Docker Compose (Recommandé)

Lance simultanément le conteneur PostgreSQL 16 et l'API FastAPI :

```bash
cd backend
docker-compose up --build
```

- API disponible sur : **http://localhost:8000**
- Documentation interactive Swagger : **http://localhost:8000/docs**
- Documentation ReDoc : **http://localhost:8000/redoc**
- PostgreSQL actif sur : `localhost:5432`

---

### Option B : Installation Locale (Python 3.10+)

1. **Créer un environnement virtuel et installer les dépendances** :
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Créer la base de données PostgreSQL** :
```sql
CREATE DATABASE vigicam_db;
CREATE USER vigicam_user WITH PASSWORD 'vigicam_secret_2026';
GRANT ALL PRIVILEGES ON DATABASE vigicam_db TO vigicam_user;
```

3. **Exécuter les migrations Alembic** :
```bash
alembic upgrade head
```

4. **Lancer le serveur Uvicorn avec rechargement automatique** :
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📡 Points de Terminaison API (Endpoints)

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Vérification de l'état du backend |
| `GET` | `/api/quotes` | Lister les devis (Admin) |
| `POST` | `/api/quotes` | Créer un devis (Génère code `DEV-2026-XXXX`) |
| `PATCH` | `/api/quotes/{id}` | Modifier statut / notes admin |
| `GET` | `/api/interventions` | Lister les tickets de dépannage (Admin) |
| `POST` | `/api/interventions` | Déclarer une panne (Génère code `DEP-2026-XXXX`) |
| `PATCH` | `/api/interventions/{id}` | Changer technicien / statut |
| `GET` | `/api/tracking/{code}` | Suivi en direct par code de dossier |
| `GET` | `/api/cameras` | Catalogue de caméras certifiées |
| `POST` | `/api/cameras` | Ajouter un produit au catalogue |
| `POST` | `/api/auth/login` | Vérification du code PIN administrateur |
