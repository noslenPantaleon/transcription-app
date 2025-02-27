from sqlalchemy import Column, Integer, String, TIMESTAMP,Text
from sqlalchemy.sql.expression import text
from src.database import Base


class Transcription(Base):
    __tablename__ = 'transcription'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)  
    file_name = Column(String(255), nullable=True) 
    transcription_text = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))


