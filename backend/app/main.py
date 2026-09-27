from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.posts import router as posts_router

app = FastAPI(title="Bacbok API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://bacbok.vercel.app",
        "https://bacbok.com",
        "https://www.bacbok.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(posts_router)


@app.get("/")
def root():
    return {"message": "Bacbok API is running"}
