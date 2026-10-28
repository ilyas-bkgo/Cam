from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/quotes", tags=["Quotes"])

@router.get("", response_model=List[schemas.QuoteOut])
def list_quotes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lister toutes les demandes de devis (Vue admin)"""
    return crud.get_quotes(db, skip=skip, limit=limit)

@router.post("", response_model=schemas.QuoteOut, status_code=status.HTTP_201_CREATED)
def submit_quote(quote_in: schemas.QuoteCreate, db: Session = Depends(get_db)):
    """Soumettre une nouvelle demande de devis en ligne"""
    return crud.create_quote(db, quote_in)

@router.get("/{quote_id}", response_model=schemas.QuoteOut)
def get_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = crud.get_quote_by_id(db, quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Devis non trouvé")
    return quote

@router.patch("/{quote_id}", response_model=schemas.QuoteOut)
def update_quote_status(quote_id: int, updates: schemas.QuoteUpdate, db: Session = Depends(get_db)):
    quote = crud.update_quote(db, quote_id, updates)
    if not quote:
        raise HTTPException(status_code=404, detail="Devis non trouvé")
    return quote

@router.delete("/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote(quote_id: int, db: Session = Depends(get_db)):
    success = crud.delete_quote(db, quote_id)
    if not success:
        raise HTTPException(status_code=404, detail="Devis non trouvé")
    return None
