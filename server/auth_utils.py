from datetime import datetime, timedelta, timezone
import os

import bcrypt
from dotenv import load_dotenv
import jwt

# โหลดค่าจากไฟล์ .env
load_dotenv()

# ดึงคีย์ลับสำหรับสร้างและอ่าน Token จาก .env ถ้าหาไม่เจอจะใช้ค่าสำรองด้านหลัง
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# 1. แฮชรหัสผ่าน (แปลง 1234 -> $2b$12$...)(แปลงรหัสผ่านเป็น byte -> สุ่ม salt -> แฮช -> แปลงกลับเป็น str)
def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


# 2. ตรวจสอบรหัสผ่าน
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


# 3. สร้าง JWT Access Token (ตั๋วเข้าใช้งาน)
def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=8)) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)