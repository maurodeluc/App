from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, date
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class MoodLevel(str, Enum):
    molto_triste = "molto_triste"
    triste = "triste"
    neutro = "neutro"
    felice = "felice"
    molto_felice = "molto_felice"

class ActivityType(str, Enum):
    lavoro = "lavoro"
    famiglia = "famiglia"
    sport = "sport"
    relax = "relax"
    sociale = "sociale"
    hobby = "hobby"
    studio = "studio"
    altro = "altro"

# Models
class MoodEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mood_level: MoodLevel
    activities: List[ActivityType]
    note: Optional[str] = None
    date: date
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MoodEntryCreate(BaseModel):
    mood_level: MoodLevel
    activities: List[ActivityType]
    note: Optional[str] = None
    date: date

class MoodEntryUpdate(BaseModel):
    mood_level: Optional[MoodLevel] = None
    activities: Optional[List[ActivityType]] = None
    note: Optional[str] = None

class MoodStats(BaseModel):
    total_entries: int
    average_mood: float
    most_common_activities: List[str]
    mood_distribution: dict

# Basic routes
@api_router.get("/")
async def root():
    return {"message": "LEAF API - Laboratorio di Educazione Alla Felicità"}

# Mood Entry routes
@api_router.post("/mood-entries", response_model=MoodEntry)
async def create_mood_entry(entry: MoodEntryCreate):
    entry_dict = entry.dict()
    entry_dict['date'] = entry_dict['date'].isoformat()
    mood_entry = MoodEntry(**entry_dict)
    
    # Convert the mood_entry to dict and ensure date is string for MongoDB
    mood_entry_dict = mood_entry.dict()
    mood_entry_dict['date'] = mood_entry_dict['date'].isoformat() if isinstance(mood_entry_dict['date'], date) else mood_entry_dict['date']
    
    result = await db.mood_entries.insert_one(mood_entry_dict)
    if result.inserted_id:
        return mood_entry
    raise HTTPException(status_code=400, detail="Errore nella creazione dell'entry")

@api_router.get("/mood-entries", response_model=List[MoodEntry])
async def get_mood_entries(limit: int = 100):
    entries = await db.mood_entries.find().sort("timestamp", -1).limit(limit).to_list(limit)
    
    for entry in entries:
        if isinstance(entry.get('date'), str):
            entry['date'] = datetime.fromisoformat(entry['date']).date()
    
    return [MoodEntry(**entry) for entry in entries]

@api_router.get("/mood-entries/{entry_id}", response_model=MoodEntry)
async def get_mood_entry(entry_id: str):
    entry = await db.mood_entries.find_one({"id": entry_id})
    if not entry:
        raise HTTPException(status_code=404, detail="Entry non trovato")
    
    if isinstance(entry.get('date'), str):
        entry['date'] = datetime.fromisoformat(entry['date']).date()
    
    return MoodEntry(**entry)

@api_router.put("/mood-entries/{entry_id}", response_model=MoodEntry)
async def update_mood_entry(entry_id: str, update_data: MoodEntryUpdate):
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if update_dict:
        result = await db.mood_entries.update_one(
            {"id": entry_id}, 
            {"$set": update_dict}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Entry non trovato")
    
    return await get_mood_entry(entry_id)

@api_router.delete("/mood-entries/{entry_id}")
async def delete_mood_entry(entry_id: str):
    result = await db.mood_entries.delete_one({"id": entry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry non trovato")
    return {"message": "Entry eliminato con successo"}

# Statistics routes
@api_router.get("/mood-stats", response_model=MoodStats)
async def get_mood_stats():
    entries = await db.mood_entries.find().to_list(1000)
    
    if not entries:
        return MoodStats(
            total_entries=0,
            average_mood=0,
            most_common_activities=[],
            mood_distribution={}
        )
    
    # Calculate statistics
    mood_values = {"molto_triste": 1, "triste": 2, "neutro": 3, "felice": 4, "molto_felice": 5}
    total_mood = sum(mood_values[entry['mood_level']] for entry in entries)
    average_mood = total_mood / len(entries)
    
    # Activity frequency
    all_activities = []
    for entry in entries:
        all_activities.extend(entry.get('activities', []))
    
    activity_counts = {}
    for activity in all_activities:
        activity_counts[activity] = activity_counts.get(activity, 0) + 1
    
    most_common = sorted(activity_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    
    # Mood distribution
    mood_distribution = {}
    for entry in entries:
        mood = entry['mood_level']
        mood_distribution[mood] = mood_distribution.get(mood, 0) + 1
    
    return MoodStats(
        total_entries=len(entries),
        average_mood=round(average_mood, 2),
        most_common_activities=[activity for activity, _ in most_common],
        mood_distribution=mood_distribution
    )

# Export route
@api_router.get("/export-csv")
async def export_mood_data_csv():
    entries = await db.mood_entries.find().sort("date", 1).to_list(1000)
    
    if not entries:
        return {"csv_data": "Data,Umore,Attività,Note\n"}
    
    csv_lines = ["Data,Umore,Attività,Note"]
    
    mood_labels = {
        "molto_triste": "Molto Triste",
        "triste": "Triste", 
        "neutro": "Neutro",
        "felice": "Felice",
        "molto_felice": "Molto Felice"
    }
    
    activity_labels = {
        "lavoro": "Lavoro",
        "famiglia": "Famiglia",
        "sport": "Sport",
        "relax": "Relax",
        "sociale": "Sociale",
        "hobby": "Hobby",
        "studio": "Studio",
        "altro": "Altro"
    }
    
    for entry in entries:
        date_str = entry.get('date', '')
        if isinstance(date_str, str):
            date_str = datetime.fromisoformat(date_str).strftime('%d/%m/%Y')
        
        mood = mood_labels.get(entry.get('mood_level', ''), '')
        activities = '; '.join([activity_labels.get(act, act) for act in entry.get('activities', [])])
        note = entry.get('note', '').replace(',', ';').replace('\n', ' ')
        
        csv_lines.append(f"{date_str},{mood},{activities},{note}")
    
    return {"csv_data": "\n".join(csv_lines)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()