# สำหรับรับค่า Request และส่ง Response (UserCreate, UserRead) เพื่อความปลอดภัย ไม่ให้ส่ง Password Hash ออกไปหา Client

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