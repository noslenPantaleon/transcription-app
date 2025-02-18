from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql.expression import text
from database import Base
import datetime


class Transcription(Base):
    __tablename__ = 'ocr_cedulas'
    __table_args__ = {'extend_existing': True}

    Id = Column(Integer, primary_key=True)
    fileName = Column(String(255), nullable=True)
    file = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text('now()'))