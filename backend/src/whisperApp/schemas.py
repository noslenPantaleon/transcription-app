from datetime import datetime
from pydantic import BaseModel


class TranscriptionBase(BaseModel):
    file_name: str 
    transcription_text: str
    audio_url: str


class TranscriptionCreate(TranscriptionBase):
    pass


class TranscriptionUpdate(BaseModel):
    file_name: str  
    transcription_text: str 
  


class TranscriptionInDBBase(TranscriptionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Transcription(TranscriptionInDBBase):
    pass


class TrasncriptionInDB(TranscriptionInDBBase):
    pass



