from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.whisperApp.router import whisper_router
from fastapi.staticfiles import StaticFiles

import os

app = FastAPI()

# Ensure FFmpeg path is set in the environment
os.environ["PATH"] += os.pathsep + "C:\\ffmpeg\\bin"
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow your frontend origin
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(whisper_router)