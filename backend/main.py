from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import whisper
import os
from tempfile import NamedTemporaryFile
import shutil
import subprocess

# Initialize FastAPI app
app = FastAPI()

# Load Whisper model
model = whisper.load_model("base")

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
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

        # Transcribe the audio using Whisper
        result = model.transcribe(audio_filename)
        transcription = result.get("text", "No transcription available.")

        # Return the transcription result
        return JSONResponse(content={"transcription": transcription})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up the temporary files
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists(audio_filename) and audio_filename != temp_filename:
            os.remove(audio_filename)

@app.get("/")
async def root():
    return {"message": "Welcome to the Whisper Transcription API!"}
