from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


# ---------- Auth ----------

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    password: str
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class LoginRequest(BaseModel):
    identifier: str  # email OR username
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str


class ResendCodeRequest(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    is_verified: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ---------- Posts: shared / author ----------

class PostAuthor(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


# ---------- Post Images ----------

class PostImageResponse(BaseModel):
    id: int
    image_url: str
    position: int

    class Config:
        from_attributes = True


# ---------- Reactions ----------

class ReactionCreate(BaseModel):
    reaction_type: str  # "like", "love", "care", "haha", "wow", "sad", "angry"


class ReactionSummary(BaseModel):
    reaction_type: str
    count: int


# ---------- Comments ----------

class CommentCreate(BaseModel):
    text: str


class CommentResponse(BaseModel):
    id: int
    text: str
    created_at: datetime
    author: PostAuthor

    class Config:
        from_attributes = True


# ---------- Posts ----------

class PostCreate(BaseModel):
    text: str
    image_urls: list[str] = []


class PostResponse(BaseModel):
    id: int
    text: str
    created_at: datetime
    author: PostAuthor
    images: list[PostImageResponse] = []
    reactions: list[ReactionSummary] = []
    my_reaction: str | None = None
    comment_count: int = 0

    class Config:
        from_attributes = True
