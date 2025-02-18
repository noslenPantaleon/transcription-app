from database import get_db

def get_db_session():
    db = next(get_db())
    return db
