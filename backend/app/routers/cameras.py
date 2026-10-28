from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.get("", response_model=List[schemas.CameraOut])
def list_cameras(db: Session = Depends(get_db)):
    """Catalogue public du matériel certifié"""
    return crud.get_cameras(db)

@router.post("", response_model=schemas.CameraOut, status_code=status.HTTP_201_CREATED)
def add_camera(cam_in: schemas.CameraCreate, db: Session = Depends(get_db)):
    """Ajouter une nouvelle caméra au catalogue (Admin)"""
    return crud.create_camera(db, cam_in)

@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_camera(camera_id: int, db: Session = Depends(get_db)):
    success = crud.delete_camera(db, camera_id)
    if not success:
        raise HTTPException(status_code=404, detail="Caméra non trouvée")
    return None
