from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from mock_data import MOCK_ML_DATA
from models import Label
import sqlite3
import uvicorn
import logging
from datetime import datetime

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Database setup
connection = sqlite3.connect("database.db")
cursor = connection.cursor()

# Create table if doesn't exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS label (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imageId TEXT NOT NULL,
        label TEXT NOT NULL
    )
""")
connection.commit()
##

# API setup
app = FastAPI()

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "backend", "127.0.0.1"])

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
##

def get_reviewed_image_ids():
    rows = cursor.execute("SELECT imageId FROM label").fetchall()
    return {row[0] for row in rows}

@app.get("/api/images/next")
async def get_next_unreviewed_image():
    """
    Get the next unreviewed image.
    Returns one entry at a time that hasn't been reviewed yet.
    Returns null if all images have been reviewed.
    """
    reviewed_ids = get_reviewed_image_ids()

    for entry in MOCK_ML_DATA:
        entry_imageId = f"image_{entry['id']}"
        if entry_imageId not in reviewed_ids:
            return entry
    
    return {"message": "All images have been reviewed", "data": None}

@app.get("/api/stats")
async def get_stats():
    """
    Get statistics about reviewed vs unreviewed images.
    """
    rows = cursor.execute("SELECT imageId, label FROM label").fetchall()
    reviewed_labels = [{"imageId": row[0], "label": row[1]} for row in rows]

    return {
        "total_images": len(MOCK_ML_DATA),
        "reviewed": len(rows),
        "remaining": len(MOCK_ML_DATA) - len(rows),
        "reviewed_labels": sorted(reviewed_labels, key=lambda x: x["imageId"])
    }

@app.get("/api/reset")
async def reset_reviews():
    """
    Reset all reviews by clearing the database.
    """
    logger.warning("Database reset requested")
    cursor.execute("DELETE FROM label")
    connection.commit()
    logger.info("Database reset completed")
    return {"message": "Reviews reset successfully"}

@app.post("/api/labels")
async def create_label(label: Label):
    """
    Mark an image as reviewed with the provided label.
    Adds the entry to the database.
    """
    try:
        cursor.execute("INSERT INTO label (imageId, label) VALUES (?, ?)", (label.imageId, label.label))
        connection.commit()
        logger.info(f"Label created: imageId={label.imageId}, label={label.label}")
    except sqlite3.IntegrityError as e:
        logger.error(f"Database integrity error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Label already exists for this image"
        )
    
    rows = cursor.execute("SELECT imageId FROM label").fetchall()
    
    return {
        "message": "Label saved successfully",
        "entry_id": label.imageId,
        "label": label.label,
        "reviewed_count": len(rows),
        "total_images": len(MOCK_ML_DATA)
    }


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8800)

