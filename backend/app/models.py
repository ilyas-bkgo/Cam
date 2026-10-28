from datetime import datetime
from sqlalchemy import (
    Column, 
    Integer, 
    String, 
    Boolean, 
    Float, 
    Text, 
    DateTime, 
    Enum
)
import enum
from .database import Base

class PropertyType(str, enum.Enum):
    maison = "maison"
    appartement = "appartement"
    commerce = "commerce"
    entrepot = "entrepot"
    immeuble = "immeuble"
    chantier = "chantier"

class ResolutionType(str, enum.Enum):
    res_2k = "2K"
    res_4k = "4K"
    res_8k = "8K_Ultra"
    thermique = "Thermique"

class StorageType(str, enum.Enum):
    nvr_local = "nvr_local"
    cloud_securise = "cloud_securise"
    hybride = "hybride"

class QuoteStatus(str, enum.Enum):
    nouveau = "nouveau"
    en_etude = "en_etude"
    devis_transmis = "devis_transmis"
    accepte = "accepte"
    refuse = "refuse"

class IssueType(str, enum.Enum):
    camera_offline = "camera_offline"
    black_screen = "black_screen"
    recording_failure = "recording_failure"
    network_issue = "network_issue"
    vandalism = "vandalism"
    maintenance_preventive = "maintenance_preventive"
    autre = "autre"

class PriorityLevel(str, enum.Enum):
    urgente = "urgente"
    haute = "haute"
    normale = "normale"
    basse = "basse"

class InterventionStatus(str, enum.Enum):
    en_attente = "en_attente"
    planifie = "planifie"
    en_route = "en_route"
    en_cours = "en_cours"
    resolu = "resolu"
    annule = "annule"

class CameraCategory(str, enum.Enum):
    dome = "dome"
    bullet = "bullet"
    ptz = "ptz"
    nvr = "nvr"
    solar_4g = "solar_4g"
    thermal = "thermal"

class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String(50), unique=True, index=True, nullable=False)
    client_name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    address = Column(String(200), nullable=True)
    property_type = Column(String(50), default="maison")
    camera_count = Column(Integer, default=4)
    resolution = Column(String(50), default="4K")
    storage_preference = Column(String(50), default="nvr_local")
    needs_ai_detection = Column(Boolean, default=True)
    needs_night_color = Column(Boolean, default=True)
    needs_remote_app = Column(Boolean, default=True)
    estimated_price = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="nouveau", index=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String(50), unique=True, index=True, nullable=False)
    client_name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    address = Column(String(200), nullable=True)
    issue_type = Column(String(50), default="camera_offline")
    priority = Column(String(50), default="urgente", index=True)
    description = Column(Text, nullable=False)
    preferred_date = Column(String(50), default="Immédiat (< 2h)")
    time_slot = Column(String(50), default="express_2h")
    status = Column(String(50), default="en_attente", index=True)
    technician = Column(String(100), nullable=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    category = Column(String(50), default="dome", index=True)
    resolution = Column(String(50), default="4K")
    night_vision = Column(String(100), nullable=True)
    price = Column(Float, nullable=False)
    installation_included = Column(Boolean, default=True)
    features = Column(Text, nullable=True)
    in_stock = Column(Boolean, default=True)
    badge = Column(String(50), nullable=True)
    image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String(100), nullable=False)
    company_or_role = Column(String(100), nullable=True)
    location = Column(String(100), nullable=True)
    rating = Column(Integer, default=5)
    content = Column(Text, nullable=False)
    date = Column(String(50), nullable=True)
    service_type = Column(String(100), default="Installation")
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
