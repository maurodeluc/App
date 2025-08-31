from motor.motor_asyncio import AsyncIOMotorClient
from models import MoodLevel, ActivityCategory, Activity
from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Get MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
mood_entries_collection = db.mood_entries
mood_levels_collection = db.mood_levels
activity_categories_collection = db.activity_categories

async def init_reference_data():
    """Initialize mood levels and activity categories in the database"""
    
    # Check if data already exists
    mood_count = await mood_levels_collection.count_documents({})
    if mood_count > 0:
        return  # Data already initialized
    
    # Initialize mood levels
    mood_levels = [
        {"id": 1, "name": "molto male", "emoji": "😞", "color": "#FF4747", "order": 1},
        {"id": 2, "name": "male", "emoji": "😔", "color": "#FF8E53", "order": 2},
        {"id": 3, "name": "neutro", "emoji": "😐", "color": "#FFD23F", "order": 3},
        {"id": 4, "name": "bene", "emoji": "😊", "color": "#6BCF7F", "order": 4},
        {"id": 5, "name": "molto bene", "emoji": "😄", "color": "#4FC3F7", "order": 5}
    ]
    
    await mood_levels_collection.insert_many(mood_levels)
    
    # Initialize activity categories
    activity_categories = [
        {
            "id": 1,
            "name": "Benessere Fisico",
            "activities": [
                {"id": 1, "name": "Esercizio fisico", "icon": "💪", "category": "Benessere Fisico"},
                {"id": 2, "name": "Sonno ristoratore", "icon": "😴", "category": "Benessere Fisico"},
                {"id": 3, "name": "Visite mediche", "icon": "🏥", "category": "Benessere Fisico"},  
                {"id": 4, "name": "Cure personali", "icon": "🧴", "category": "Benessere Fisico"}
            ]
        },
        {
            "id": 2,
            "name": "Alimentazione",
            "activities": [
                {"id": 5, "name": "Cucinare", "icon": "🍳", "category": "Alimentazione"},
                {"id": 6, "name": "Pasti regolari", "icon": "🍽️", "category": "Alimentazione"},
                {"id": 7, "name": "Idratazione", "icon": "💧", "category": "Alimentazione"},
                {"id": 8, "name": "Alimentazione sana", "icon": "🥗", "category": "Alimentazione"}
            ]
        },
        {
            "id": 3,
            "name": "Relazioni Sociali",
            "activities": [
                {"id": 9, "name": "Tempo con amici", "icon": "👥", "category": "Relazioni Sociali"},
                {"id": 10, "name": "Famiglia", "icon": "👨‍👩‍👧‍👦", "category": "Relazioni Sociali"},
                {"id": 11, "name": "Supporto sociale", "icon": "🤝", "category": "Relazioni Sociali"},
                {"id": 12, "name": "Relazione di coppia", "icon": "💕", "category": "Relazioni Sociali"}
            ]
        },
        {
            "id": 4,
            "name": "Attività Terapeutiche",
            "activities": [
                {"id": 13, "name": "Meditazione", "icon": "🧘", "category": "Attività Terapeutiche"},
                {"id": 14, "name": "Respirazione", "icon": "🌬️", "category": "Attività Terapeutiche"},
                {"id": 15, "name": "Journaling", "icon": "📝", "category": "Attività Terapeutiche"},
                {"id": 16, "name": "Mindfulness", "icon": "🎯", "category": "Attività Terapeutiche"}
            ]
        },
        {
            "id": 5,
            "name": "Lavoro/Studio",
            "activities": [
                {"id": 17, "name": "Produttività", "icon": "💼", "category": "Lavoro/Studio"},
                {"id": 18, "name": "Obiettivi raggiunti", "icon": "✅", "category": "Lavoro/Studio"},
                {"id": 19, "name": "Stress lavorativo", "icon": "😰", "category": "Lavoro/Studio"},
                {"id": 20, "name": "Pausa/Riposo", "icon": "☕", "category": "Lavoro/Studio"}
            ]
        },
        {
            "id": 6,
            "name": "Crescita Personale",
            "activities": [
                {"id": 21, "name": "Lettura", "icon": "📚", "category": "Crescita Personale"},
                {"id": 22, "name": "Apprendimento", "icon": "🎓", "category": "Crescita Personale"},
                {"id": 23, "name": "Creatività", "icon": "🎨", "category": "Crescita Personale"},
                {"id": 24, "name": "Riflessione", "icon": "💭", "category": "Crescita Personale"}
            ]
        }
    ]
    
    await activity_categories_collection.insert_many(activity_categories)
    print("Reference data initialized successfully")

# Helper functions
async def get_mood_levels():
    """Get all mood levels"""
    cursor = mood_levels_collection.find({}).sort("order", 1)
    return [MoodLevel(**doc) async for doc in cursor]

async def get_activity_categories():
    """Get all activity categories"""
    cursor = activity_categories_collection.find({}).sort("id", 1)
    return [ActivityCategory(**doc) async for doc in cursor]