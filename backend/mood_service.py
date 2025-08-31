from typing import List, Optional
from datetime import datetime, timedelta
from models import MoodEntry, CreateMoodEntryRequest, UpdateMoodEntryRequest, MoodStatistics, MoodTrend, ActivityFrequency
from database import mood_entries_collection, get_mood_levels
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class MoodService:
    
    @staticmethod
    async def create_entry(entry_data: CreateMoodEntryRequest, patient_id: str = "default") -> MoodEntry:
        """Create a new mood entry"""
        try:
            # Check if entry already exists for this date
            existing_entry = await mood_entries_collection.find_one({
                "date": entry_data.date,
                "patient_id": patient_id
            })
            
            if existing_entry:
                raise ValueError(f"Entry already exists for date {entry_data.date}")
            
            # Create new entry
            entry = MoodEntry(
                date=entry_data.date,
                mood=entry_data.mood,
                activities=entry_data.activities,
                note=entry_data.note,
                patient_id=patient_id
            )
            
            # Save to database
            entry_dict = entry.dict()
            result = await mood_entries_collection.insert_one(entry_dict)
            entry_dict["_id"] = str(result.inserted_id)
            
            logger.info(f"Created mood entry for date {entry_data.date}")
            return MoodEntry(**entry_dict)
            
        except Exception as e:
            logger.error(f"Error creating mood entry: {str(e)}")
            raise
    
    @staticmethod
    async def get_entry_by_date(date: str, patient_id: str = "default") -> Optional[MoodEntry]:
        """Get mood entry by date"""
        try:
            entry_doc = await mood_entries_collection.find_one({
                "date": date,
                "patient_id": patient_id
            })
            
            if entry_doc:
                entry_doc["_id"] = str(entry_doc["_id"])
                return MoodEntry(**entry_doc)
            return None
            
        except Exception as e:
            logger.error(f"Error getting mood entry by date {date}: {str(e)}")
            raise
    
    @staticmethod
    async def get_all_entries(patient_id: str = "default", limit: int = 100) -> List[MoodEntry]:
        """Get all mood entries for a patient"""
        try:
            cursor = mood_entries_collection.find({
                "patient_id": patient_id
            }).sort("date", -1).limit(limit)
            
            entries = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                entries.append(MoodEntry(**doc))
            
            return entries
            
        except Exception as e:
            logger.error(f"Error getting all mood entries: {str(e)}")
            raise
    
    @staticmethod
    async def update_entry(entry_id: str, update_data: UpdateMoodEntryRequest) -> Optional[MoodEntry]:
        """Update a mood entry"""
        try:
            update_dict = {}
            if update_data.mood is not None:
                update_dict["mood"] = update_data.mood.dict()
            if update_data.activities is not None:
                update_dict["activities"] = [activity.dict() for activity in update_data.activities]
            if update_data.note is not None:
                update_dict["note"] = update_data.note
            
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await mood_entries_collection.update_one(
                {"id": entry_id},
                {"$set": update_dict}
            )
            
            if result.modified_count == 0:
                return None
            
            # Get updated entry
            updated_doc = await mood_entries_collection.find_one({"id": entry_id})
            if updated_doc:
                updated_doc["_id"] = str(updated_doc["_id"])
                return MoodEntry(**updated_doc)
            
            return None
            
        except Exception as e:
            logger.error(f"Error updating mood entry {entry_id}: {str(e)}")
            raise
    
    @staticmethod
    async def delete_entry(entry_id: str) -> bool:
        """Delete a mood entry"""
        try:
            result = await mood_entries_collection.delete_one({"id": entry_id})
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Error deleting mood entry {entry_id}: {str(e)}")
            raise
    
    @staticmethod
    async def get_statistics(patient_id: str = "default") -> MoodStatistics:
        """Get mood statistics for a patient"""
        try:
            # Get all entries with date validation
            all_entries = await MoodService.get_all_entries(patient_id)
            
            # Filter out entries with invalid dates
            valid_entries = []
            for entry in all_entries:
                try:
                    # Validate date format
                    datetime.strptime(entry.date, "%Y-%m-%d")
                    valid_entries.append(entry)
                except ValueError:
                    logger.warning(f"Skipping entry with invalid date format: {entry.date}")
                    continue
            
            if not valid_entries:
                return MoodStatistics(
                    total_entries=0,
                    current_streak=0,
                    average_mood="N/A",
                    most_common_activities=[],
                    mood_distribution={}
                )
            
            # Calculate statistics with valid entries only
            total_entries = len(valid_entries)
            
            # Calculate current streak (consecutive days with entries)
            current_streak = await MoodService._calculate_streak(valid_entries)
            
            # Calculate average mood
            mood_scores = [entry.mood.id for entry in valid_entries]
            avg_mood_score = sum(mood_scores) / len(mood_scores)
            mood_levels = await get_mood_levels()
            avg_mood = next((mood.name for mood in mood_levels if mood.id == round(avg_mood_score)), "N/A")
            
            # Most common activities
            activity_counts = {}
            for entry in valid_entries:
                for activity in entry.activities:
                    activity_counts[activity.name] = activity_counts.get(activity.name, 0) + 1
            
            most_common = sorted(activity_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            most_common_activities = [activity[0] for activity in most_common]
            
            # Mood distribution
            mood_distribution = {}
            for entry in valid_entries:
                mood_name = entry.mood.name
                mood_distribution[mood_name] = mood_distribution.get(mood_name, 0) + 1
            
            return MoodStatistics(
                total_entries=total_entries,
                current_streak=current_streak,
                average_mood=f"{avg_mood} 😊",
                most_common_activities=most_common_activities,
                mood_distribution=mood_distribution
            )
            
        except Exception as e:
            logger.error(f"Error getting statistics: {str(e)}")
            # Return safe default statistics instead of raising
            return MoodStatistics(
                total_entries=0,
                current_streak=0,
                average_mood="N/A",
                most_common_activities=[],
                mood_distribution={}
            )
    
    @staticmethod
    async def _calculate_streak(entries: List[MoodEntry]) -> int:
        """Calculate consecutive days streak"""
        if not entries:
            return 0
        
        # Sort entries by date (most recent first)
        sorted_entries = sorted(entries, key=lambda x: x.date, reverse=True)
        
        streak = 0
        current_date = datetime.now().date()
        
        for entry in sorted_entries:
            entry_date = datetime.strptime(entry.date, "%Y-%m-%d").date()
            
            if entry_date == current_date:
                streak += 1
                current_date -= timedelta(days=1)
            elif entry_date == current_date + timedelta(days=1):
                # Account for today not having an entry yet
                streak += 1
                current_date = entry_date - timedelta(days=1)
            else:
                break
        
        return streak