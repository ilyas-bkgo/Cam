from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/interventions", tags=["Interventions"])

@router.get("", response_model=List[schemas.InterventionOut])
def list_interventions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lister tous les tickets de maintenance et dépannage (Vue admin)"""
    return crud.get_interventions(db, skip=skip, limit=limit)

@router.post("", response_model=schemas.InterventionOut, status_code=status.HTTP_201_CREATED)
def report_breakdown(inter_in: schemas.InterventionCreate, db: Session = Depends(get_db)):
    """Déclarer une panne ou demander une intervention d'urgence"""
    return crud.create_intervention(db, inter_in)

@router.get("/{intervention_id}", response_model=schemas.InterventionOut)
def get_intervention(intervention_id: int, db: Session = Depends(get_db)):
    inter = crud.get_intervention_by_id(db, intervention_id)
    if not inter:
        raise HTTPException(status_code=404, detail="Ticket d'intervention non trouvé")
    return inter

@router.patch("/{intervention_id}", response_model=schemas.InterventionOut)
def update_intervention_status(intervention_id: int, updates: schemas.InterventionUpdate, db: Session = Depends(get_db)):
    inter = crud.update_intervention(db, intervention_id, updates)
    if not inter:
        raise HTTPException(status_code=404, detail="Ticket d'intervention non trouvé")
    return inter

@router.delete("/{intervention_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_intervention(intervention_id: int, db: Session = Depends(get_db)):
    success = crud.delete_intervention(db, intervention_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ticket non trouvé")
    return None
