# Schemas สำหรับรับและส่งข้อมูลระหว่าง Client และ Server (Pydantic Models)

from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, EmailStr
from models import UserRole

# --- Schemas สำหรับ Auth & User ---

# Schema สำหรับการลงทะเบียนผู้ใช้งานใหม่ (Register)
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    department: str

# Schema สำหรับการเข้าสู่ระบบ (Login)
class TokenRequest(BaseModel):
    email: str
    password: str

# Schema สำหรับส่งข้อมูล User กลับไปยัง Client (ไม่ส่ง password_hash)
class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    department: Optional[str] = None
    role: UserRole
    no_show_count: int = 0
    is_locked: bool = False
    created_at: Optional[datetime] = None

# Schema สำหรับการอัปเดตข้อมูลผู้ใช้งาน (Admin)
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    role: Optional[UserRole] = None
    is_locked: Optional[bool] = None
    no_show_count: Optional[int] = None

# Schema สำหรับส่งคืน Token JWT
class Token(BaseModel):
    access_token: str
    token_type: str


# --- Schemas สำหรับ Room ---

# Schema สำหรับการสร้างห้องประชุมใหม่
class RoomCreate(BaseModel):
    name: str
    capacity: int
    building: str
    floor: str
    requires_approval: bool = False

# Schema สำหรับการอัปเดตห้องประชุม (เลือกเฉพาะบางฟิลด์)
class RoomUpdate(BaseModel):
    name: Optional[str] = None
    capacity: Optional[int] = None
    building: Optional[str] = None
    floor: Optional[str] = None
    requires_approval: Optional[bool] = None
    is_active: Optional[bool] = None

# Schema สำหรับส่งข้อมูล Room กลับไปยัง Client
class RoomOut(RoomCreate):
    id: uuid.UUID
    is_active: bool
    image_url: Optional[str] = None
    created_at: datetime


# --- Schemas สำหรับ Booking ---

# Schema สำหรับขอกดจองห้องประชุม
class BookingCreate(BaseModel):
    room_id: uuid.UUID
    title: str
    start_time: datetime
    end_time: datetime

# Schema สำหรับส่งข้อมูลการจองกลับไปยัง Client
class BookingOut(BookingCreate):
    id: uuid.UUID
    user_id: uuid.UUID
    status: str
    check_in_pin: Optional[str] = None
    checked_in_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    cancellation_reason: Optional[str] = None
    created_at: datetime


class BookingAvailabilityOut(BaseModel):
    start_time: datetime
    end_time: datetime
    status: str

# Schema สำหรับ Admin ปฏิเสธการจอง
class BookingRejectRequest(BaseModel):
    reason: str

# Schema สำหรับยกเลิกการจอง
class BookingCancelRequest(BaseModel):
    reason: Optional[str] = None

# Schema สำหรับการ Check-in ด้วย PIN
class CheckInRequest(BaseModel):
    booking_id: uuid.UUID
    pin: str


class CheckInOut(BaseModel):
    id: uuid.UUID
    title: str
    status: str
    checked_in_at: Optional[datetime] = None


# --- Schemas สำหรับ Analytics ---

# Schema สำหรับสรุปผลการจองประจำเดือน
class AnalyticsSummaryOut(BaseModel):
    month: int
    year: int
    total_reservations: int
    completed_check_ins: int
    cancellations: int

# Schema สำหรับบันทึกการใช้งานห้องประชุมรายวัน
class DailyUtilizationRecord(BaseModel):
    date: str
    total_booked_hours: float
    utilization_percentage: float
    booking_count: int

# Schema สำหรับรายงานอัตราการใช้งานห้องประชุม
class RoomUtilizationOut(BaseModel):
    room_id: uuid.UUID
    month: int
    year: int
    daily_data: list[DailyUtilizationRecord]

# Schema สำหรับรายการผู้ใช้งานที่โดนล็อกหรือ No-show สูง
class UserLockoutItem(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    department: Optional[str] = None
    no_show_count: int
    is_locked: bool

# Schema สำหรับส่งข้อมูลผู้ใช้งานโดนล็อกกลับไปยัง Client
class UserLockoutOut(BaseModel):
    locked_users: list[UserLockoutItem]