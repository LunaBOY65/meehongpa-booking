from datetime import datetime, timedelta, timezone
import os

from dotenv import load_dotenv
import jwt
from passlib.context import CryptContext

# กำหนดวิธีแฮชรหัสผ่านด้วย bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# โหลดค่าจากไฟล์ .env
load_dotenv()

# ดึงคีย์ลับสำหรับสร้างและอ่าน Token จาก .env ถ้าหาไม่เจอจะใช้ค่าสำรองด้านหลัง
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# 1. แฮชรหัสผ่าน (แปลง 1234 -> $2b$12$...)
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# 2. ตรวจสอบรหัสผ่าน
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# 3. สร้าง JWT Access Token (ตั๋วเข้าใช้งาน)
def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=8)) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)