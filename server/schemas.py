# สำหรับรับค่า Request และส่ง Response (UserCreate, UserRead) เพื่อความปลอดภัย ไม่ให้ส่ง Password Hash ออกไปหา Client

from datetime import datetime

from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

# Schema สำหรับ Register (Frontend ส่งมา)
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    department: str

# Schema สำหรับ Login (Frontend ส่งมา)
class TokenRequest(BaseModel):
    email: str
    password: str

# Schema สำหรับส่งข้อมูล User กลับไป (ห้ามมี password_hash!)
class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    department: Optional[str]
    role: str
    is_locked: bool

# Schema สำหรับ Token Response
class Token(BaseModel):
    access_token: str
    token_type: str


# --- Schemas สำหรับ Room ---
# ข้อมูลที่ต้องส่งมาตอนสร้างห้องใหม่
class RoomCreate(BaseModel):
    name: str
    capacity: int
    building: str
    floor: str
    requires_approval: bool = False

# ข้อมูลสำหรับแก้ไขห้อง (ทุกช่องเป็น Optional ส่งมาเฉพาะฟิลด์ที่ต้องการแก้)
class RoomUpdate(BaseModel):
    name: Optional[str] = None
    capacity: Optional[int] = None
    building: Optional[str] = None
    floor: Optional[str] = None
    requires_approval: Optional[bool] = None
    is_active: Optional[bool] = None

# ข้อมูล Room ที่จะส่งกลับไปให้ Frontend
class RoomOut(RoomCreate):
    id: uuid.UUID
    is_active: bool
    created_at: datetime