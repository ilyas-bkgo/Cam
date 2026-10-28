from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, EmailStr

# ================= QUOTES SCHEMAS =================
class QuoteBase(BaseModel):
    client_name: str = Field(..., max_length=100)
    email: str = Field(..., max_length=120)
    phone: str = Field(..., max_length=30)
    address: Optional[str] = Field(None, max_length=200)
    property_type: str = "maison"
    camera_count: int = Field(default=4, ge=1, le=64)
    resolution: str = "4K"
    storage_preference: str = "nvr_local"
    needs_ai_detection: bool = True
    needs_night_color: bool = True
    needs_remote_app: bool = True
    estimated_price: float = 0.0
    notes: Optional[str] = None

class QuoteCreate(QuoteBase):
    pass

class QuoteUpdate(BaseModel):
    status: Optional[str] = None
    estimated_price: Optional[float] = None
    admin_notes: Optional[str] = None

class QuoteOut(QuoteBase):
    id: int
    tracking_code: str
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ================= INTERVENTIONS SCHEMAS =================
class InterventionBase(BaseModel):
    client_name: str = Field(..., max_length=100)
    email: str = Field(..., max_length=120)
    phone: str = Field(..., max_length=30)
    address: Optional[str] = Field(None, max_length=200)
    issue_type: str = "camera_offline"
    priority: str = "urgente"
    description: str = Field(..., min_length=5)
    preferred_date: Optional[str] = "Immédiat (< 2h)"
    time_slot: Optional[str] = "express_2h"

class InterventionCreate(InterventionBase):
    pass

class InterventionUpdate(BaseModel):
    status: Optional[str] = None
    technician: Optional[str] = None
    priority: Optional[str] = None
    admin_notes: Optional[str] = None

class InterventionOut(InterventionBase):
    id: int
    tracking_code: str
    status: str
    technician: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ================= CAMERAS SCHEMAS =================
class CameraBase(BaseModel):
    name: str = Field(..., max_length=120)
    category: str = "dome"
    resolution: str = "4K"
    night_vision: Optional[str] = None
    price: float
    installation_included: bool = True
    features: Optional[str] = None
    in_stock: bool = True
    badge: Optional[str] = None
    image_url: Optional[str] = None

class CameraCreate(CameraBase):
    pass

class CameraUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    in_stock: Optional[bool] = None
    features: Optional[str] = None

class CameraOut(CameraBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ================= TESTIMONIALS SCHEMAS =================
class TestimonialBase(BaseModel):
    author: str = Field(..., max_length=100)
    company_or_role: Optional[str] = None
    location: Optional[str] = None
    rating: int = Field(default=5, ge=1, le=5)
    content: str
    date: Optional[str] = None
    service_type: Optional[str] = "Installation"
    verified: bool = True

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialOut(TestimonialBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ================= TRACKING / AUTH =================
class TrackingResponse(BaseModel):
    type: Literal["quote", "intervention"]
    data: dict

class AdminLoginRequest(BaseModel):
    pin: str
