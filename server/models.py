from enum import Enum
from typing import Optional
import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Room(SQLModel, table=True):
    __tablename__: str = "rooms"

    # ใช้ default_factory เพื่อให้ Python สร้าง UUID4 ทันทีเมื่อมีการสร้าง Instance
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, 
        primary_key=True
    )
    name: str
    capacity: int
    building: str
    floor: str
    requires_approval: bool = False
    is_active: bool = True
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

# สถานะของการจองห้องประชุม
class BookingStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
    CHECKED_IN = "CHECKED_IN"

class Booking(SQLModel, table=True):
    __tablename__: str = "bookings"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    room_id: uuid.UUID = Field(foreign_key="rooms.id", nullable=False)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    title: str
    start_time: datetime
    end_time: datetime
    status: BookingStatus = Field(default=BookingStatus.APPROVED)
    check_in_pin: Optional[str] = None
    checked_in_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    cancellation_reason: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"

class User(SQLModel, table=True):
    __tablename__: str = "users"

    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, 
        primary_key=True
    )
    email: str = Field(unique=True, index=True)
    password_hash: str
    full_name: str
    department: Optional[str] = None
    role: UserRole = Field(default=UserRole.MEMBER)
    no_show_count: int = Field(default=0)
    is_locked: bool = Field(default=False)
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )