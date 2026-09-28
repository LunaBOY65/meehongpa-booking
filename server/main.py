from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
import jwt
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException, status
from sqlmodel import Session, select

from database import get_session
from models import Room, User
from auth_utils import create_access_token, hash_password, verify_password, SECRET_KEY, ALGORITHM
from schemas import Token, TokenRequest, UserCreate, UserOut

app = FastAPI(title="Meeting Room Booking API")

# อนุญาตให้ Next.js (port 3000) คุยกับเซิร์ฟเวอร์นี้ได้
origins = ["http://localhost:3000",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # ยอมรับทุกคำสั่ง GET, POST, PUT, DELETE
    allow_headers=["*"],
)

# กำหนด Type Alias ด้วย Annotated เพื่อให้โค้ดสะอาด
SessionDep = Annotated[Session, Depends(get_session)]

# ดึง Token จาก Header Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ตรวจตั๋วเช็กว่า Token ถูกต้องไหม และเป็น User คนไหน
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token ไม่ถูกต้อง หรือหมดอายุแล้ว",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # ถอดรหัส Token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id: str | None = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    # 2. ค้นหา User ในฐานข้อมูล
    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user

CurrentUserDep = Annotated[User, Depends(get_current_user)]

@app.get("/")
def health_check():
    return {"status": "online"}

# API สมัครสมาชิก
@app.post("/auth/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, session: SessionDep):
    # 1. ตรวจสอบว่า email นี้ถูกใช้งานไปแล้วหรือยัง
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email นี้ถูกใช้งานแล้ว"
        )

    # 2. แปลงรหัสผ่านธรรมดาให้เป็น password_hash
    hashed_pw = hash_password(user_data.password)

    # 3. สร้าง User คนใหม่และบันทึกลงฐานข้อมูล
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
    # 1. ค้นหา User จาก Email
    user = session.exec(select(User).where(User.email == credentials.email)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email หรือรหัสผ่านไม่ถูกต้อง")

    # 2. ตรวจสอบรหัสผ่าน
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email หรือรหัสผ่านไม่ถูกต้อง")

    # 3. ถ้ารหัสผ่านถูก ให้สร้าง JWT Token ส่งกลับไป
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

# API ดูโปรไฟล์ตัวเอง (ต้องแนบ Token มาด้วย)
@app.get("/users/me", response_model=UserOut)
def get_my_profile(current_user: CurrentUserDep):
    return current_user

@app.post("/rooms", response_model=Room)
def create_room(room: Room, session: SessionDep):
    session.add(room)
    session.commit()
    session.refresh(room)
    return room

@app.get("/rooms", response_model=list[Room])
def get_rooms(session: SessionDep):
    rooms = session.exec(select(Room)).all()
    return rooms