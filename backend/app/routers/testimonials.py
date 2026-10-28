from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])

@router.get("", response_model=List[schemas.TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    """Avis clients vérifiés"""
    return crud.get_testimonials(db)

@router.post("", response_model=schemas.TestimonialOut, status_code=status.HTTP_201_CREATED)
def submit_testimonial(t_in: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    """Déposer un avis client"""
    return crud.create_testimonial(db, t_in)
