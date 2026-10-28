from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud

router = APIRouter(prefix="/tracking", tags=["Tracking"])

@router.get("/{code}")
def track_dossier(code: str, db: Session = Depends(get_db)):
    """Rechercher un devis ou une intervention par son code unique de suivi"""
    clean_code = code.strip().upper()
    
    quote = crud.get_quote_by_tracking(db, clean_code)
    if quote:
        return {
            "type": "quote",
            "data": {
                "id": quote.id,
                "trackingCode": quote.tracking_code,
                "clientName": quote.client_name,
                "phone": quote.phone,
                "email": quote.email,
                "address": quote.address,
                "propertyType": quote.property_type,
                "cameraCount": quote.camera_count,
                "resolution": quote.resolution,
                "storagePreference": quote.storage_preference,
                "estimatedPrice": quote.estimated_price,
                "status": quote.status,
                "adminNotes": quote.admin_notes,
                "createdAt": quote.created_at.isoformat() if quote.created_at else None
            }
        }

    inter = crud.get_intervention_by_tracking(db, clean_code)
    if inter:
        return {
            "type": "intervention",
            "data": {
                "id": inter.id,
                "trackingCode": inter.tracking_code,
                "clientName": inter.client_name,
                "phone": inter.phone,
                "email": inter.email,
                "address": inter.address,
                "issueType": inter.issue_type,
                "priority": inter.priority,
                "description": inter.description,
                "status": inter.status,
                "technician": inter.technician,
                "adminNotes": inter.admin_notes,
                "createdAt": inter.created_at.isoformat() if inter.created_at else None
            }
        }

    raise HTTPException(status_code=404, detail="Aucun dossier trouvé pour ce code")
