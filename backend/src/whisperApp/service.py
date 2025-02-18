from sqlalchemy.orm import Session
from . import models, schemas
from sqlalchemy.orm import Session


def get_transcription(db: Session, transcription_id: int):
    return db.query(models.Transcription).filter(models.Transcription.Id == transcription_id).first()


def get_transcriptions(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Transcription).offset(skip).limit(limit).all()


def create_transcriptions(db: Session, transcription_data:schemas.TranscriptionCreate):
    if type(transcription_data) == dict:
        db_transcriptions = models.Transcription(**transcription_data)
    else:
        db_transcriptions = models.Transcription(**transcription_data.model_dump())
    db.add(db_transcriptions)
    db.commit()
    db.refresh(db_transcriptions)
    return db_transcriptions
    

def update_transcription(db: Session, transcription_id: int, transcription: schemas.TranscriptionUpdate):
    db_transcriptions = db.query(models.Transcription).filter(
        models.Transcription.Id == transcription_id).first()
    if db_transcriptions:
        for key, value in transcription.model_dump().items():
            setattr(db_transcriptions, key, value)
        db.commit()
        db.refresh(db_transcriptions)
    return db_transcriptions


def delete_transcription(db: Session, transcription_id: int):
    db_transcriptions = db.query(models.Transcription).filter(
        models.Transcription.Id == transcription_id).first()
    if db_transcriptions:
        db.delete(db_transcriptions)
        db.commit()
    return db_transcriptions
