import calendar
from datetime import datetime, date, timezone, timedelta
import random
from typing import Annotated, Optional
import uuid

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from sqlmodel import Session, select, col, SQLModel

from database import engine, get_session
from models import Room, User, UserRole, Booking, BookingStatus
from auth_utils import create_access_token, hash_password, verify_password, SECRET_KEY, ALGORITHM
from schemas import (
    Token,
    TokenRequest,
    UserCreate,
    UserOut,
    UserUpdate,
    RoomCreate,
    RoomUpdate,
    RoomOut,
    BookingCreate,
    BookingOut,
    BookingRejectRequest,
    BookingCancelRequest,
    CheckInRequest,
    AnalyticsSummaryOut,
    RoomUtilizationOut,
    DailyUtilizationRecord,
    UserLockoutOut,
    UserLockoutItem,
)

# สร้าง Table ใน Database หากยังไม่มี
SQLModel.metadata.create_all(engine)

app = FastAPI(title="Meeting Room Booking API")

# อนุญาตให้ Frontend (Next.js) คุยกับ FastAPI ได้
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SessionDep = Annotated[Session, Depends(get_session)]
security_scheme = HTTPBearer()

# ฟังก์ชันตรวจสอบ JWT Token สำหรับ Authenticated User
def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)], session: SessionDep) -> User:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token ไม่ถูกต้อง หรือหมดอายุแล้ว",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str | None = payload.get("sub")
        if not user_id_str:
            raise credentials_exception
        user_id = uuid.UUID(user_id_str)
    except Exception:
        raise credentials_exception

    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user

CurrentUserDep = Annotated[User, Depends(get_current_user)]

# ฟังก์ชันตรวจสอบสิทธิ์เฉพาะ Admin
def require_admin(current_user: CurrentUserDep) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="ไม่มีสิทธิ์เข้าถึง: สำหรับ Admin เท่านั้น")
    return current_user

AdminDep = Annotated[User, Depends(require_admin)]


@app.get("/")
def health_check():
    return {"status": "online"}


# ==========================================
# 1. Authentication & User Management APIs
# ==========================================

# API สมัครสมาชิก
@app.post("/auth/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, session: SessionDep):
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email นี้ถูกใช้งานแล้ว"
        )

    hashed_pw = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_pw,
        full_name=user_data.full_name,
        department=user_data.department
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


# API เข้าสู่ระบบ
@app.post("/auth/login", response_model=Token)
def login(credentials: TokenRequest, session: SessionDep):
    user = session.exec(select(User).where(User.email == credentials.email)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email หรือรหัสผ่านไม่ถูกต้อง")

    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email หรือรหัสผ่านไม่ถูกต้อง")

    if user.is_locked:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ")

    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


# API ดูข้อมูลส่วนตัวของผู้ใช้งาน
@app.get("/users/me", response_model=UserOut)
def get_my_profile(current_user: CurrentUserDep):
    return current_user


# API ดึงรายชื่อผู้ใช้งานทั้งหมด (Admin เท่านั้น)
@app.get("/users", response_model=list[UserOut])
def get_users(
    session: SessionDep,
    admin: AdminDep,
    department: Optional[str] = None,
    is_locked: Optional[bool] = None,
    role: Optional[UserRole] = None,
):
    query = select(User)
    if department:
        query = query.where(User.department == department)
    if is_locked is not None:
        query = query.where(User.is_locked == is_locked)
    if role:
        query = query.where(User.role == role)

    return session.exec(query).all()


# API ดึงข้อมูลผู้ใช้งานรายบุคคลตาม ID
@app.get("/users/{id}", response_model=UserOut)
def get_user_by_id(id: uuid.UUID, session: SessionDep, current_user: CurrentUserDep):
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบผู้ใช้งานนี้")
    return user


# API แก้ไขข้อมูลผู้ใช้งาน หรือ ปลดล็อกบัญชี (Admin เท่านั้น)
@app.patch("/users/{id}", response_model=UserOut)
def update_user(id: uuid.UUID, user_data: UserUpdate, session: SessionDep, admin: AdminDep):
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบผู้ใช้งานนี้")

    update_dict = user_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(user, key, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


# API ลบผู้ใช้งาน (Admin เท่านั้น)
@app.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(id: uuid.UUID, session: SessionDep, admin: AdminDep):
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบผู้ใช้งานนี้")

    session.delete(user)
    session.commit()
    return None


# ==========================================
# 2. Rooms & Facilities Management APIs
# ==========================================

# API ดึงรายการห้องประชุมทั้งหมด
@app.get("/rooms", response_model=list[RoomOut])
def get_rooms(
    session: SessionDep,
    building: Optional[str] = None,
    floor: Optional[str] = None,
    min_capacity: Optional[int] = None,
    is_active: Optional[bool] = None,
):
    query = select(Room)
    if building:
        query = query.where(Room.building == building)
    if floor:
        query = query.where(Room.floor == floor)
    if min_capacity is not None:
        query = query.where(Room.capacity >= min_capacity)
    if is_active is not None:
        query = query.where(Room.is_active == is_active)

    return session.exec(query).all()


# API ดูรายละเอียดห้องประชุมตาม ID
@app.get("/rooms/{id}", response_model=RoomOut)
def get_room_by_id(id: uuid.UUID, session: SessionDep):
    room = session.get(Room, id)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบห้องประชุมนี้")
    return room


# API เพิ่มห้องประชุมใหม่ (Admin เท่านั้น)
@app.post("/rooms", response_model=RoomOut, status_code=status.HTTP_201_CREATED)
def create_room(room_data: RoomCreate, session: SessionDep, admin: AdminDep):
    new_room = Room(**room_data.model_dump())
    session.add(new_room)
    session.commit()
    session.refresh(new_room)
    return new_room


# API แก้ไขข้อมูลห้องประชุม (Admin เท่านั้น)
@app.patch("/rooms/{id}", response_model=RoomOut)
def update_room(id: uuid.UUID, room_data: RoomUpdate, session: SessionDep, admin: AdminDep):
    room = session.get(Room, id)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบห้องประชุมนี้")

    update_dict = room_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(room, key, value)

    session.add(room)
    session.commit()
    session.refresh(room)
    return room


# API ลบห้องประชุม (Admin เท่านั้น)
@app.delete("/rooms/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(id: uuid.UUID, session: SessionDep, admin: AdminDep):
    room = session.get(Room, id)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบห้องประชุมนี้")
    session.delete(room)
    session.commit()
    return None


# ==========================================
# 3. Bookings Management APIs
# ==========================================

# API ดึงรายการจองห้องประชุมทั้งหมด (รองรับ Filter)
@app.get("/bookings", response_model=list[BookingOut])
def get_bookings(
    session: SessionDep,
    current_user: CurrentUserDep,
    user_id: Optional[uuid.UUID] = None,
    room_id: Optional[uuid.UUID] = None,
    date_str: Optional[str] = None,
    booking_status: Optional[BookingStatus] = None,
):
    query = select(Booking)
    if user_id:
        query = query.where(Booking.user_id == user_id)
    if room_id:
        query = query.where(Booking.room_id == room_id)
    if booking_status:
        query = query.where(col(Booking.status) == booking_status)

    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
            end_of_day = datetime.combine(target_date, datetime.max.time()).replace(tzinfo=timezone.utc)
            query = query.where(
                Booking.start_time < end_of_day,
                Booking.end_time > start_of_day
            )
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="รูปแบบวันที่ไม่ถูกต้อง กรุณาใช้ YYYY-MM-DD")

    return session.exec(query).all()


# API ดึงข้อมูลรายการจองตาม ID
@app.get("/bookings/{id}", response_model=BookingOut)
def get_booking_by_id(id: uuid.UUID, session: SessionDep, current_user: CurrentUserDep):
    booking = session.get(Booking, id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบรายการจองนี้")
    return booking


# API จองห้องประชุม (พร้อมตรวจสอบเวลาซ้ำซ้อน Overlap Check)
@app.post("/bookings", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(booking_data: BookingCreate, session: SessionDep, current_user: CurrentUserDep):
    # 1. เช็กความถูกต้องของเวลา
    if booking_data.start_time >= booking_data.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="เวลาเริ่มต้นต้องเกิดขึ้นก่อนเวลาสิ้นสุด"
        )

    # 2. เช็กว่าห้องประชุมพร้อมใช้งานหรือไม่
    room = session.get(Room, booking_data.room_id)
    if not room or not room.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบห้องประชุมนี้ หรือห้องปิดปรับปรุงอยู่"
        )

    # 3. ตรวจสอบช่วงเวลาซ้ำซ้อน (Overlap Check)
    overlapping_booking = session.exec(
        select(Booking).where(
            Booking.room_id == booking_data.room_id,
            col(Booking.status).in_([BookingStatus.APPROVED, BookingStatus.PENDING, BookingStatus.CHECKED_IN]),
            Booking.start_time < booking_data.end_time,
            Booking.end_time > booking_data.start_time
        )
    ).first()

    if overlapping_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ช่วงเวลานี้มีผู้จองห้องประชุมไปแล้ว"
        )

    # 4. กำหนดสถานะและการสร้าง PIN 6 หลักสำหรับการ Check-in
    initial_status = BookingStatus.PENDING if room.requires_approval else BookingStatus.APPROVED
    pin = f"{random.randint(100000, 999999)}" if initial_status == BookingStatus.APPROVED else None

    assert current_user.id is not None

    new_booking = Booking(
        room_id=booking_data.room_id,
        user_id=current_user.id,
        title=booking_data.title,
        start_time=booking_data.start_time,
        end_time=booking_data.end_time,
        status=initial_status,
        check_in_pin=pin
    )
    session.add(new_booking)
    session.commit()
    session.refresh(new_booking)
    return new_booking


# API อนุมัติการจอง (Admin เท่านั้น)
@app.post("/bookings/{id}/approve", response_model=BookingOut)
def approve_booking(id: uuid.UUID, session: SessionDep, admin: AdminDep):
    booking = session.get(Booking, id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบรายการจองนี้")

    if booking.status in [BookingStatus.CANCELLED, BookingStatus.REJECTED]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ไม่สามารถอนุมัติรายการที่ยกเลิกหรือถูกปฏิเสธไปแล้วได้")

    booking.status = BookingStatus.APPROVED
    if not booking.check_in_pin:
        booking.check_in_pin = f"{random.randint(100000, 999999)}"

    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking


# API ปฏิเสธการจอง (Admin เท่านั้น)
@app.post("/bookings/{id}/reject", response_model=BookingOut)
def reject_booking(id: uuid.UUID, reject_data: BookingRejectRequest, session: SessionDep, admin: AdminDep):
    booking = session.get(Booking, id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบรายการจองนี้")

    booking.status = BookingStatus.REJECTED
    booking.rejection_reason = reject_data.reason
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking


# API ขอยกเลิกการจอง
@app.post("/bookings/{id}/cancel", response_model=BookingOut)
def cancel_booking(
    id: uuid.UUID,
    cancel_data: BookingCancelRequest,
    session: SessionDep,
    current_user: CurrentUserDep
):
    booking = session.get(Booking, id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบรายการจองนี้")

    if booking.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="ไม่มีสิทธิ์ยกเลิกรายการจองของผู้อื่น")

    booking.status = BookingStatus.CANCELLED
    booking.cancellation_reason = cancel_data.reason
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking


# API Check-in เข้าห้องประชุมด้วย PIN
@app.post("/bookings/check-in", response_model=BookingOut)
def check_in_booking(check_in_data: CheckInRequest, session: SessionDep):
    booking = session.get(Booking, check_in_data.booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ไม่พบรายการจองนี้")

    if booking.status == BookingStatus.CHECKED_IN:
        return booking

    if booking.status != BookingStatus.APPROVED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="รายการจองนี้ยังไม่อยู่ในสถานะพร้อมให้ Check-in")

    if booking.check_in_pin != check_in_data.pin.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="รหัส PIN สำหรับ Check-in ไม่ถูกต้อง")

    booking.status = BookingStatus.CHECKED_IN
    booking.checked_in_at = datetime.now(timezone.utc)
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking


# ==========================================
# 4. Analytics & Reports APIs
# ==========================================

# API รายงานภาพรวมประจำเดือน (Summary KPIs)
@app.get("/analytics/summary", response_model=AnalyticsSummaryOut)
def get_analytics_summary(
    session: SessionDep,
    current_user: CurrentUserDep,
    month: int = 9,
    year: int = 2026,
):
    bookings = session.exec(select(Booking)).all()

    filtered = [
        b for b in bookings
        if b.start_time.month == month and b.start_time.year == year
    ]

    total_reservations = len(filtered)
    completed_check_ins = sum(1 for b in filtered if b.status == BookingStatus.CHECKED_IN)
    cancellations = sum(1 for b in filtered if b.status == BookingStatus.CANCELLED)

    return {
        "month": month,
        "year": year,
        "total_reservations": total_reservations,
        "completed_check_ins": completed_check_ins,
        "cancellations": cancellations,
    }


# API รายงานอัตราการใช้งานห้องประชุมรายวัน (Room Utilization)
@app.get("/analytics/room-utilization", response_model=RoomUtilizationOut)
def get_room_utilization(
    session: SessionDep,
    current_user: CurrentUserDep,
    room_id: uuid.UUID,
    month: int = 9,
    year: int = 2026,
):
    _, num_days = calendar.monthrange(year, month)
    daily_records: list[DailyUtilizationRecord] = []

    # ดึงการจองทั้งหมดของห้องนี้
    bookings = session.exec(
        select(Booking).where(
            Booking.room_id == room_id,
            col(Booking.status).in_([BookingStatus.APPROVED, BookingStatus.CHECKED_IN])
        )
    ).all()

    for day in range(1, num_days + 1):
        day_date = date(year, month, day)
        date_str = day_date.strftime("%Y-%m-%d")

        # กรองรายการจองที่ตรงกับวันนั้น
        day_bookings = [
            b for b in bookings
            if b.start_time.date() == day_date
        ]

        total_seconds = 0.0
        for b in day_bookings:
            duration = (b.end_time - b.start_time).total_seconds()
            total_seconds += max(0.0, duration)

        total_hours = round(total_seconds / 3600.0, 2)
        # สมมติฐานเวลาเปิดให้บริการ 10 ชั่วโมงต่อวัน (08:00 - 18:00)
        utilization_pct = round(min(100.0, (total_hours / 10.0) * 100.0), 1)

        daily_records.append(
            DailyUtilizationRecord(
                date=date_str,
                total_booked_hours=total_hours,
                utilization_percentage=utilization_pct,
                booking_count=len(day_bookings)
            )
        )

    return RoomUtilizationOut(
        room_id=room_id,
        month=month,
        year=year,
        daily_data=daily_records
    )


# API รายงานผู้ใช้งานที่ถูกระงับ หรือมีสถิติ No-show
@app.get("/analytics/user-lockouts", response_model=UserLockoutOut)
def get_user_lockouts(session: SessionDep, current_user: CurrentUserDep):
    users = session.exec(
        select(User).where((User.is_locked == True) | (User.no_show_count > 0))
    ).all()

    items: list[UserLockoutItem] = []
    for u in users:
        assert u.id is not None
        items.append(
            UserLockoutItem(
                id=u.id,
                email=u.email,
                full_name=u.full_name,
                department=u.department,
                no_show_count=u.no_show_count,
                is_locked=u.is_locked,
            )
        )

    return UserLockoutOut(locked_users=items)