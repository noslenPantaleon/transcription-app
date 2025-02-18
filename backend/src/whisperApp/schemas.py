from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class TranscriptionBase(BaseModel):
    fileName: str 
    file: str 


class TranscriptionCreate(TranscriptionBase):
    pass


class TranscriptionUpdate(TranscriptionBase):
    pass


class TranscriptionInDBBase(TranscriptionBase):
    Id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Transcription(TranscriptionInDBBase):
    pass


class TrasncriptionInDB(TranscriptionInDBBase):
    pass



