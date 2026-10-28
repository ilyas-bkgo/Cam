import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base, SessionLocal
from . import models
from .routers import quotes, interventions, cameras, testimonials, tracking, auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vigicam_api")

def seed_demo_data():
    """Initialise les tables et injecte des données de départ si la base est neuve"""
    db = SessionLocal()
    try:
        # Check if cameras exist
        if db.query(models.Camera).count() == 0:
            demo_cameras = [
                models.Camera(
                    name="Dôme VigiPro 4K AcuSense IK10",
                    category="dome",
                    resolution="4K Ultra HD (8 MP)",
                    night_vision="Infrarouge EXIR 40m + Filtre ICR",
                    price=349.0,
                    installation_included=True,
                    features="Anti-vandale IK10, IP67, Détection IA Humains/Véhicules",
                    in_stock=True,
                    badge="Populaire",
                    image_url="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80"
                ),
                models.Camera(
                    name="Bullet ColorVu Nuit Couleur 24/7",
                    category="bullet",
                    resolution="4K Ultra HD (8 MP)",
                    night_vision="Couleur intégrale 24h/24 LED douce 40m",
                    price=389.0,
                    installation_included=True,
                    features="Ouverture F1.0 ultra-lumineuse, WDR 130dB",
                    in_stock=True,
                    badge="Nuit Couleur",
                    image_url="https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80"
                ),
                models.Camera(
                    name="PTZ Speed Dome 360° Zoom 25x",
                    category="ptz",
                    resolution="4MP QHD Haute Vitesse",
                    night_vision="Laser IR longue portée 150m",
                    price=790.0,
                    installation_included=True,
                    features="Auto-tracking IA cible en mouvement, Rotation 360°",
                    in_stock=True,
                    badge="Longue Portée",
                    image_url="https://images.unsplash.com/photo-1517430816045-df4b7de81a17?auto=format&fit=crop&w=600&q=80"
                )
            ]
            db.add_all(demo_cameras)
            db.commit()

        # Check if sample quotes exist
        if db.query(models.Quote).count() == 0:
            demo_quotes = [
                models.Quote(
                    tracking_code="DEV-2026-9812",
                    client_name="Cabinet Médical Santé Plus",
                    email="contact@santeplus-cabinet.fr",
                    phone="01 42 68 90 12",
                    address="24 Avenue Montaigne, 75008 Paris",
                    property_type="commerce",
                    camera_count=6,
                    resolution="4K",
                    storage_preference="hybride",
                    estimated_price=2450.0,
                    status="en_etude",
                    admin_notes="Visite technique préalable validée."
                ),
                models.Quote(
                    tracking_code="DEV-2026-4431",
                    client_name="Alexandre Fontaine",
                    email="a.fontaine78@gmail.com",
                    phone="06 33 21 98 45",
                    address="14 Allée des Chênes, 78100 Saint-Germain",
                    property_type="maison",
                    camera_count=4,
                    resolution="4K",
                    storage_preference="nvr_local",
                    estimated_price=1680.0,
                    status="devis_transmis",
                    admin_notes="Devis officiel transmis par email."
                )
            ]
            db.add_all(demo_quotes)
            db.commit()

        # Check if sample interventions exist
        if db.query(models.Intervention).count() == 0:
            demo_inter = [
                models.Intervention(
                    tracking_code="DEP-2026-1049",
                    client_name="Entrepôt LogiTrans 93",
                    email="maintenance@logitrans93.com",
                    phone="01 48 30 11 22",
                    address="Zone Industrielle Nord, 93290 Tremblay",
                    issue_type="camera_offline",
                    priority="urgente",
                    description="Deux caméras PTZ extérieures ne répondent plus suite à l'orage.",
                    status="en_route",
                    technician="Julien R. - Astreinte Express",
                    admin_notes="Technicien en route avec pièces de rechange."
                )
            ]
            db.add_all(demo_inter)
            db.commit()

    except Exception as e:
        logger.warning(f"Note initial seed: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist
    try:
        Base.metadata.create_all(bind=engine)
        seed_demo_data()
        logger.info("Base de données PostgreSQL VigiCam synchronisée avec succès.")
    except Exception as e:
        logger.warning(f"Connexion DB reportée au runtime: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API REST FastAPI pour la plateforme VigiCam Sécurité (Installation, Maintenance et Dépannage)",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(quotes.router, prefix=settings.API_V1_STR)
app.include_router(interventions.router, prefix=settings.API_V1_STR)
app.include_router(cameras.router, prefix=settings.API_V1_STR)
app.include_router(testimonials.router, prefix=settings.API_V1_STR)
app.include_router(tracking.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": "VigiCam Sécurité API",
        "status": "healthy",
        "docs": "/docs",
        "version": settings.VERSION
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "database": "postgresql", "orm": "sqlalchemy"}
