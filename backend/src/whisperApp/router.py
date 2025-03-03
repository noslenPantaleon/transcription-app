from fastapi import File, UploadFile, HTTPException
from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import FileResponse
import os
from tempfile import NamedTemporaryFile
import shutil
import subprocess
import whisper
from sqlalchemy.orm import Session
from .dependencies import get_db_session
from sqlalchemy.orm import Session
from . import schemas, service
from typing import List
from .constants import UPLOAD_DIRECTORY
from .utils.create_upload_directory import create_upload_directory

whisper_router= APIRouter()
model = whisper.load_model("base")

@whisper_router.get("/")
async def root():
   return {"message": "Welcome to the Whisper Transcription API!"}


@whisper_router.get("/transcriptions/", response_model=List[schemas.Transcription])
def read_transcriptions(skip: int = 0, limit: int = 30, db: Session = Depends(get_db_session)):
    transcription = service.get_transcriptions(db, skip=skip, limit=limit)
    return transcription

@whisper_router.get("/transcription/{transcription_id}", response_model=schemas.Transcription)
def get_transcription_id(transcription_id: int, db: Session = Depends(get_db_session)):
    transcription = service.get_transcription(db, transcription_id)
    if transcription is None:
        raise HTTPException(status_code=404, detail="Transcription not found")
    return transcription

@whisper_router.post("/transcription/update{transcription_id}", response_model=schemas.TranscriptionUpdate)
def update_transcription(transcription_id: int, transcription: schemas.TranscriptionUpdate, db: Session = Depends(get_db_session)):
    updated_transcription = service.update_transcription(db, transcription_id, transcription)
    return updated_transcription

@whisper_router.delete("/transcriptions/delete{transcription_id}", response_model=schemas.Transcription)
def delete_transcription(transcription_id: int, db: Session = Depends(get_db_session)):
    transcription = service.delete_transcription(db, transcription_id)
    return transcription


@whisper_router.get("/audio/{audio_url}")
def get_audio(audio_url: str):
    file_path = os.path.join(UPLOAD_DIRECTORY, audio_url)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(file_path, media_type="audio/wav")


@whisper_router.post("/transcribe/", response_model=schemas.Transcription)
async def transcribe_audio(file: UploadFile = File(...), db: Session = Depends(get_db_session)):
    # Ensure file type is audio or video
    if not (file.content_type.startswith("audio") or file.content_type.startswith("video")):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio or video file.")
    
    try:
        # Save the uploaded file temporarily
        with NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[-1]) as temp_media:
            shutil.copyfileobj(file.file, temp_media)
            temp_filename = temp_media.name

        # Convert video to audio if necessary
        audio_filename = temp_filename.replace(os.path.splitext(temp_filename)[1], ".wav")

        if file.content_type.startswith("video"):
            subprocess.run(
                ["ffmpeg", "-i", temp_filename, "-q:a", "0", "-map", "a", audio_filename],
                check=True
            )
        else:
            audio_filename = temp_filename

        create_upload_directory()
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Transcribe the audio using Whisper
        result = model.transcribe(audio_filename)
        transcription = result.get("text", "No transcription available.")
        
        # save in database
        transcription_entry = schemas.TranscriptionCreate(
        file_name=file.filename,
        transcription_text=transcription,
        audio_url=file.filename)
        db_transcription = service.create_transcriptions(db=db, transcription_data=transcription_entry)
        return db_transcription 

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up the temporary files
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists(audio_filename) and audio_filename != temp_filename:
            os.remove(audio_filename)
