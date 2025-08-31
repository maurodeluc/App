from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional

# Import our models and services
from models import (
    MoodEntry, CreateMoodEntryRequest, UpdateMoodEntryRequest,
    MoodLevel, ActivityCategory, MoodStatistics
)
from database import init_reference_data, get_mood_levels, get_activity_categories
from mood_service import MoodService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="LEAF - Laboratorio di Educazione Alla Felicità")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Basic health check
@api_router.get("/")
async def root():
    return {"message": "LEAF API - Laboratorio di Educazione Alla Felicità"}

# Reference Data Endpoints
@api_router.get("/moods", response_model=List[MoodLevel])
async def get_moods():
    """Get all available mood levels"""
    try:
        return await get_mood_levels()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/activity-categories", response_model=List[ActivityCategory])
async def get_activity_categories_endpoint():
    """Get all activity categories with their activities"""
    try:
        return await get_activity_categories()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mood Entry Endpoints
@api_router.post("/entries", response_model=MoodEntry)
async def create_mood_entry(entry_data: CreateMoodEntryRequest, patient_id: str = "default"):
    """Create a new mood entry"""
    try:
        return await MoodService.create_entry(entry_data, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/entries", response_model=List[MoodEntry])
async def get_all_entries(patient_id: str = "default", limit: int = 100):
    """Get all mood entries for a patient"""
    try:
        return await MoodService.get_all_entries(patient_id, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/entries/{date}")
async def get_entry_by_date(date: str, patient_id: str = "default"):
    """Get mood entry by specific date (YYYY-MM-DD)"""
    try:
        entry = await MoodService.get_entry_by_date(date, patient_id)
        if not entry:
            raise HTTPException(status_code=404, detail=f"No entry found for date {date}")
        return entry
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/entries/{entry_id}", response_model=MoodEntry)
async def update_mood_entry(entry_id: str, update_data: UpdateMoodEntryRequest):
    """Update an existing mood entry"""
    try:
        updated_entry = await MoodService.update_entry(entry_id, update_data)
        if not updated_entry:
            raise HTTPException(status_code=404, detail=f"Entry {entry_id} not found")
        return updated_entry
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/entries/{entry_id}")
async def delete_mood_entry(entry_id: str):
    """Delete a mood entry"""
    try:
        deleted = await MoodService.delete_entry(entry_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"Entry {entry_id} not found")
        return {"message": f"Entry {entry_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Statistics Endpoints
@api_router.get("/stats/overview", response_model=MoodStatistics)
async def get_mood_statistics(patient_id: str = "default"):
    """Get mood statistics overview for a patient"""
    try:
        return await MoodService.get_statistics(patient_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/stats/mood-trend")
async def get_mood_trend(days: int = 90, patient_id: str = "default"):
    """Get mood trend data for charting (default: last 90 days / 3 months)"""
    try:
        return await MoodService.get_mood_trend(days, patient_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/export/csv")
async def export_mood_data_csv(patient_id: str = "default"):
    """Export all mood data and statistics as CSV"""
    try:
        from fastapi.responses import StreamingResponse
        import io
        import csv
        from datetime import datetime
        
        # Get all entries and statistics
        entries = await MoodService.get_all_entries(patient_id, limit=1000)  # Get more entries for export
        statistics = await MoodService.get_statistics(patient_id)
        
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write CSV headers
        writer.writerow([
            'Data', 'Umore', 'Livello_Umore', 'Emoji', 'Attività', 'Note', 'Data_Creazione'
        ])
        
        # Write mood entries
        for entry in entries:
            activities_text = '; '.join([f"{act.name} ({act.category})" for act in entry.activities])
            writer.writerow([
                entry.date,
                entry.mood.name,
                entry.mood.id,
                entry.mood.emoji,
                activities_text,
                entry.note,
                entry.created_at.strftime('%Y-%m-%d %H:%M:%S') if entry.created_at else ''
            ])
        
        # Add empty row
        writer.writerow([])
        
        # Write statistics summary
        writer.writerow(['=== STATISTICHE RIASSUNTIVE ==='])
        writer.writerow(['Metric', 'Valore'])
        writer.writerow(['Entries totali', statistics.total_entries])
        writer.writerow(['Giorni consecutivi', statistics.current_streak])
        writer.writerow(['Umore medio', statistics.average_mood])
        writer.writerow(['Attività più comuni', '; '.join(statistics.most_common_activities)])
        
        # Mood distribution
        writer.writerow([])
        writer.writerow(['=== DISTRIBUZIONE UMORE ==='])
        writer.writerow(['Umore', 'Conteggio'])
        for mood, count in statistics.mood_distribution.items():
            writer.writerow([mood, count])
        
        # Generate filename with current date
        current_date = datetime.now().strftime('%Y-%m-%d')
        filename = f"LEAF_mood_data_{current_date}.csv"
        
        # Create response
        output.seek(0)
        response = StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8')),
            media_type='text/csv',
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating CSV: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize reference data on startup"""
    await init_reference_data()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
