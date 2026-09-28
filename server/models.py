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