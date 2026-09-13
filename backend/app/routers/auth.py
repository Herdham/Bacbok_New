import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.model import User
from app import schemas
from app.security import hash_password, verify_password, create_access_token
from app.email_util import send_reset_email, send_verification_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

VERIFICATION_CODE_MINUTES = 15


def _generate_code() -> str:
    return f"{secrets.randbelow(1000000):06d}"


@router.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: schemas.SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        or_(User.email == payload.email, User.username == payload.username)
    ).first()

    if existing:
        if existing.email == payload.email:
            raise HTTPException(status_code=400, detail="Email already registered")
        raise HTTPException(status_code=400, detail="Username already taken")

    code = _generate_code()

    user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        username=payload.username,
        hashed_password=hash_password(payload.password),
        is_verified=False,
        verification_code=code,
        verification_code_expires=datetime.utcnow() + timedelta(minutes=VERIFICATION_CODE_MINUTES),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    send_verification_email(user.email, code)

    return user


@router.post("/verify-email")
def verify_email(payload: schemas.VerifyEmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="No account found with that email")

    if user.is_verified:
        return {"message": "Email is already verified"}

    if (
        not user.verification_code
        or user.verification_code != payload.code
        or not user.verification_code_expires
        or user.verification_code_expires < datetime.utcnow()
    ):
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")

    user.is_verified = True
    user.verification_code = None
    user.verification_code_expires = None
    db.commit()

    return {"message": "Email verified successfully"}


@router.post("/resend-code")
def resend_code(payload: schemas.ResendCodeRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="No account found with that email")

    if user.is_verified:
        return {"message": "Email is already verified"}

    code = _generate_code()
    user.verification_code = code
    user.verification_code_expires = datetime.utcnow() + timedelta(minutes=VERIFICATION_CODE_MINUTES)
    db.commit()

    send_verification_email(user.email, code)

    return {"message": "Verification code resent"}


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        or_(User.email == payload.identifier, User.username == payload.identifier)
    ).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before logging in")

    access_token = create_access_token(data={"sub": str(user.id)})
    return schemas.TokenResponse(access_token=access_token, user=user)


@router.post("/forgot-password")
def forgot_password(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if user:
        token = secrets.token_urlsafe(32)
        user.reset_token = token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        send_reset_email(user.email, token)

    return {"message": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == payload.token).first()

    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user.hashed_password = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {"message": "Password has been reset successfully"}
