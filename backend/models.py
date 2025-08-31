from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Base Models
class MoodLevel(BaseModel):
    id: int
    name: str
    emoji: str
    color: str
    order: int = 0

class Activity(BaseModel):
    id: int
    name: str
    icon: str
    category: str

class ActivityCategory(BaseModel):
    id: int
    name: str
    activities: List[Activity]

# Entry Models
class MoodEntryActivity(BaseModel):
    id: int
    name: str
    icon: str
    category: str

class MoodEntryMood(BaseModel):
    id: int
    name: str
    emoji: str
    color: str

class MoodEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str  # YYYY-MM-DD format
    mood: MoodEntryMood
    activities: List[MoodEntryActivity] = []
    note: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    patient_id: str = "default"  # For future multi-patient support

# Request/Response Models
class CreateMoodEntryRequest(BaseModel):
    date: str
    mood: MoodEntryMood
    activities: List[MoodEntryActivity] = []
    note: str = ""

class UpdateMoodEntryRequest(BaseModel):
    mood: Optional[MoodEntryMood] = None
    activities: Optional[List[MoodEntryActivity]] = None
    note: Optional[str] = None

# Statistics Models
class MoodStatistics(BaseModel):
    total_entries: int
    current_streak: int
    average_mood: str
    most_common_activities: List[str]
    mood_distribution: dict

class MoodTrend(BaseModel):
    date: str
    mood_score: int
    mood_name: str
    mood_color: str

class ActivityFrequency(BaseModel):
    activity_name: str
    count: int
    percentage: float