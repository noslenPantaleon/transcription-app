from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.whisperApp.router import whisper_router
import os
#from database import engine, Base


app = FastAPI()

# Ensure FFmpeg path is set in the environment
os.environ["PATH"] += os.pathsep + "C:\\ffmpeg\\bin"


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(whisper_router)