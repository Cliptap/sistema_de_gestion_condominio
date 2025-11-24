import sys
import os

# Add backend directory to path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__)))

from app.db.session import engine
from app.models.models import Base

def create_tables():
    print("Creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    create_tables()
