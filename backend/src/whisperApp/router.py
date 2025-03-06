from fastapi import File, UploadFile, HTTPException,Request,APIRouter, Depends, File, UploadFile
from fastapi.responses import FileResponse, StreamingResponse
import os
import re
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
import mimetypes
from urllib.parse import unquote 

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

@whisper_router.put("/transcription/update/{transcription_id}", response_model=schemas.TranscriptionUpdate)
def update_transcription(transcription_id: int, transcription: schemas.TranscriptionUpdate, db: Session = Depends(get_db_session)):
    print("trasnscription:", transcription)

    updated_transcription = service.update_transcription(db, transcription_id, transcription)
    return updated_transcription

@whisper_router.delete("/transcription/delete/{transcription_id}", response_model=schemas.Transcription)
def delete_transcription(transcription_id: int, db: Session = Depends(get_db_session)):
    transcription = service.delete_transcription(db, transcription_id)
    return transcription



@whisper_router.post("/transcribe/", response_model=schemas.Transcription)
async def transcribe_audio(file: UploadFile = File(...), db: Session = Depends(get_db_session)):
    # Ensure file type is audio or video
    if not (file.content_type.startswith("audio") or file.content_type.startswith("video")):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio or video file.")
    
    try:
        # Save the uploaded file temporarily
        temp_filename = None
        try:
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

            if not os.path.exists(UPLOAD_DIRECTORY):
                os.makedirs(UPLOAD_DIRECTORY)

            file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        except Exception as e:

            raise HTTPException(status_code=500, detail=f"Error processing file: {e}")

        # Transcribe the audio using Whisper
        result = model.transcribe(audio_filename)
        transcription = result.get("text", "No transcription available.")
        shutil.move(temp_filename, file_path)
        
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



def find_case_insensitive_file(directory, filename):
    """
    Find a file in the directory with a case-insensitive match.
    """
    for file in os.listdir(directory):
        if file.lower() == filename.lower():
            return file
    return None


@whisper_router.get("/audio/{audio_url}")
async def get_audio(audio_url: str, request: Request):
    decoded_audio_url = unquote(audio_url)
    print(f"Decoded audio URL: {decoded_audio_url}")  # Debugging
    
    # Find the actual file name with case-insensitive matching
    actual_filename = find_case_insensitive_file(UPLOAD_DIRECTORY, decoded_audio_url)
    if not actual_filename:
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    file_path = os.path.join(UPLOAD_DIRECTORY, actual_filename)
    print(f"File path: {file_path}")  # Debugging
    
    # Check if the file is readable
    try:
        with open(file_path, "rb") as f:
            print(f"File opened successfully: {file_path}")
    except Exception as e:
        print(f"Error opening file: {e}")
        raise HTTPException(status_code=500, detail="Error reading audio file")
    
    # Validate the MIME type
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type or not (mime_type.startswith("audio/") or mime_type == "video/webm"):
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    # Get the file size
    file_size = os.path.getsize(file_path)
    
    # Handle range requests
    range_header = request.headers.get("Range")
    if range_header:
        # Parse the range header
        match = re.match(r"bytes=(\d+)-(\d+)?", range_header)
        if not match:
            raise HTTPException(status_code=416, detail="Invalid range header")
        
        start = int(match.group(1))
        end = int(match.group(2)) if match.group(2) else file_size - 1

        # Validate the range
        if start >= file_size or end >= file_size or start > end:
            raise HTTPException(status_code=416, detail="Range not satisfiable")
        
        # Open the file and stream the requested range
        def file_iterator():
            with open(file_path, "rb") as f:
                f.seek(start)
                remaining = end - start + 1
                while remaining > 0:
                    chunk_size = min(4096, remaining)
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    yield chunk
                    remaining -= chunk_size
        
        # Return a StreamingResponse with the partial content
        headers = {
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(end - start + 1),
        }
        return StreamingResponse(file_iterator(), status_code=206, headers=headers, media_type=mime_type)
    
    else:
        # If no range header, return the entire file
        return FileResponse(file_path, media_type=mime_type)