import random
from typing import List, Optional
from sqlalchemy.orm import Session
from . import models, schemas

# Helper to generate tracking codes
def generate_tracking_code(prefix: str = "DEV") -> str:
    suffix = random.randint(1000, 9999)
    return f"{prefix}-2026-{suffix}"

# Quotes CRUD
def get_quotes(db: Session, skip: int = 0, limit: int = 100) -> List[models.Quote]:
    return db.query(models.Quote).order_by(models.Quote.created_at.desc()).offset(skip).limit(limit).all()

def get_quote_by_id(db: Session, quote_id: int) -> Optional[models.Quote]:
    return db.query(models.Quote).filter(models.Quote.id == quote_id).first()

def get_quote_by_tracking(db: Session, code: str) -> Optional[models.Quote]:
    return db.query(models.Quote).filter(models.Quote.tracking_code == code.upper()).first()

def create_quote(db: Session, quote_in: schemas.QuoteCreate) -> models.Quote:
    code = generate_tracking_code("DEV")
    # Ensure uniqueness
    while db.query(models.Quote).filter(models.Quote.tracking_code == code).first():
        code = generate_tracking_code("DEV")

    db_quote = models.Quote(
        tracking_code=code,
        **quote_in.model_dump()
    )
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

def update_quote(db: Session, quote_id: int, updates: schemas.QuoteUpdate) -> Optional[models.Quote]:
    db_quote = get_quote_by_id(db, quote_id)
    if not db_quote:
        return None
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(db_quote, field, value)
    db.commit()
    db.refresh(db_quote)
    return db_quote

def delete_quote(db: Session, quote_id: int) -> bool:
    db_quote = get_quote_by_id(db, quote_id)
    if not db_quote:
        return False
    db.delete(db_quote)
    db.commit()
    return True

# Interventions CRUD
def get_interventions(db: Session, skip: int = 0, limit: int = 100) -> List[models.Intervention]:
    return db.query(models.Intervention).order_by(models.Intervention.created_at.desc()).offset(skip).limit(limit).all()

def get_intervention_by_id(db: Session, intervention_id: int) -> Optional[models.Intervention]:
    return db.query(models.Intervention).filter(models.Intervention.id == intervention_id).first()

def get_intervention_by_tracking(db: Session, code: str) -> Optional[models.Intervention]:
    return db.query(models.Intervention).filter(models.Intervention.tracking_code == code.upper()).first()

def create_intervention(db: Session, inter_in: schemas.InterventionCreate) -> models.Intervention:
    code = generate_tracking_code("DEP")
    while db.query(models.Intervention).filter(models.Intervention.tracking_code == code).first():
        code = generate_tracking_code("DEP")

    db_inter = models.Intervention(
        tracking_code=code,
        status="en_attente",
        technician="Astreinte Express 24/7" if inter_in.priority == "urgente" else "À planifier",
        **inter_in.model_dump()
    )
    db.add(db_inter)
    db.commit()
    db.refresh(db_inter)
    return db_inter

def update_intervention(db: Session, intervention_id: int, updates: schemas.InterventionUpdate) -> Optional[models.Intervention]:
    db_inter = get_intervention_by_id(db, intervention_id)
    if not db_inter:
        return None
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(db_inter, field, value)
    db.commit()
    db.refresh(db_inter)
    return db_inter

def delete_intervention(db: Session, intervention_id: int) -> bool:
    db_inter = get_intervention_by_id(db, intervention_id)
    if not db_inter:
        return False
    db.delete(db_inter)
    db.commit()
    return True

# Cameras CRUD
def get_cameras(db: Session) -> List[models.Camera]:
    return db.query(models.Camera).all()

def create_camera(db: Session, cam_in: schemas.CameraCreate) -> models.Camera:
    db_cam = models.Camera(**cam_in.model_dump())
    db.add(db_cam)
    db.commit()
    db.refresh(db_cam)
    return db_cam

def delete_camera(db: Session, camera_id: int) -> bool:
    db_cam = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if not db_cam:
        return False
    db.delete(db_cam)
    db.commit()
    return True

# Testimonials CRUD
def get_testimonials(db: Session) -> List[models.Testimonial]:
    return db.query(models.Testimonial).order_by(models.Testimonial.created_at.desc()).all()

def create_testimonial(db: Session, test_in: schemas.TestimonialCreate) -> models.Testimonial:
    db_t = models.Testimonial(**test_in.model_dump())
    db.add(db_t)
    db.commit()
    db.refresh(db_t)
    return db_t
