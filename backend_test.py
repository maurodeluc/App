#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for LEAF Mood Tracking App
Tests all API endpoints and scenarios for mood tracking functionality
"""

import requests
import json
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Any
import time

# Configuration
BASE_URL = "https://leaf-therapy.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class LEAFBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
        self.test_results = []
        self.created_entries = []  # Track created entries for cleanup
        
    def log_test(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return response and success status"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=self.headers, params=params, timeout=10)
            elif method.upper() == "POST":
                response = requests.post(url, headers=self.headers, json=data, timeout=10)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=self.headers, json=data, timeout=10)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=self.headers, timeout=10)
            else:
                return None, False, f"Unsupported method: {method}"
            
            return response, True, None
        except requests.exceptions.RequestException as e:
            return None, False, str(e)
    
    def test_health_check(self):
        """Test GET /api/ - health check"""
        print("\n=== Testing Health Check ===")
        
        response, success, error = self.make_request("GET", "/")
        
        if not success:
            self.log_test("Health Check", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "message" in data and "LEAF" in data["message"]:
                    self.log_test("Health Check", True, "API is responding correctly", data)
                    return True
                else:
                    self.log_test("Health Check", False, "Unexpected response format", data)
                    return False
            except json.JSONDecodeError:
                self.log_test("Health Check", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_mood_levels(self):
        """Test GET /api/moods - verify mood levels"""
        print("\n=== Testing Mood Levels ===")
        
        response, success, error = self.make_request("GET", "/moods")
        
        if not success:
            self.log_test("Mood Levels", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                moods = response.json()
                
                # Verify it's a list
                if not isinstance(moods, list):
                    self.log_test("Mood Levels", False, "Response is not a list", moods)
                    return False
                
                # Verify we have the expected 5 mood levels
                if len(moods) != 5:
                    self.log_test("Mood Levels", False, f"Expected 5 moods, got {len(moods)}", moods)
                    return False
                
                # Verify mood structure
                required_fields = ["id", "name", "emoji", "color", "order"]
                for mood in moods:
                    for field in required_fields:
                        if field not in mood:
                            self.log_test("Mood Levels", False, f"Missing field '{field}' in mood", mood)
                            return False
                
                # Verify Italian mood names
                expected_moods = ["molto male", "male", "neutro", "bene", "molto bene"]
                mood_names = [mood["name"] for mood in moods]
                
                for expected in expected_moods:
                    if expected not in mood_names:
                        self.log_test("Mood Levels", False, f"Missing expected mood: {expected}", mood_names)
                        return False
                
                self.log_test("Mood Levels", True, f"Successfully retrieved {len(moods)} mood levels", moods)
                return True
                
            except json.JSONDecodeError:
                self.log_test("Mood Levels", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Mood Levels", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_activity_categories(self):
        """Test GET /api/activity-categories - verify activity categories"""
        print("\n=== Testing Activity Categories ===")
        
        response, success, error = self.make_request("GET", "/activity-categories")
        
        if not success:
            self.log_test("Activity Categories", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                categories = response.json()
                
                # Verify it's a list
                if not isinstance(categories, list):
                    self.log_test("Activity Categories", False, "Response is not a list", categories)
                    return False
                
                # Verify we have the expected 6 categories
                if len(categories) != 6:
                    self.log_test("Activity Categories", False, f"Expected 6 categories, got {len(categories)}", categories)
                    return False
                
                # Verify category structure
                total_activities = 0
                expected_categories = [
                    "Benessere Fisico", "Alimentazione", "Relazioni Sociali", 
                    "Attività Terapeutiche", "Lavoro/Studio", "Crescita Personale"
                ]
                
                category_names = [cat["name"] for cat in categories]
                
                for expected in expected_categories:
                    if expected not in category_names:
                        self.log_test("Activity Categories", False, f"Missing expected category: {expected}", category_names)
                        return False
                
                # Verify each category has activities
                for category in categories:
                    if "activities" not in category or not isinstance(category["activities"], list):
                        self.log_test("Activity Categories", False, f"Category missing activities: {category['name']}", category)
                        return False
                    
                    if len(category["activities"]) == 0:
                        self.log_test("Activity Categories", False, f"Category has no activities: {category['name']}", category)
                        return False
                    
                    total_activities += len(category["activities"])
                    
                    # Verify activity structure
                    for activity in category["activities"]:
                        required_fields = ["id", "name", "icon", "category"]
                        for field in required_fields:
                            if field not in activity:
                                self.log_test("Activity Categories", False, f"Activity missing field '{field}'", activity)
                                return False
                
                self.log_test("Activity Categories", True, f"Successfully retrieved {len(categories)} categories with {total_activities} total activities", categories)
                return True
                
            except json.JSONDecodeError:
                self.log_test("Activity Categories", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Activity Categories", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_get_all_entries_empty(self):
        """Test GET /api/entries - get all entries (should be empty initially)"""
        print("\n=== Testing Get All Entries (Empty) ===")
        
        response, success, error = self.make_request("GET", "/entries")
        
        if not success:
            self.log_test("Get All Entries (Empty)", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                entries = response.json()
                
                if not isinstance(entries, list):
                    self.log_test("Get All Entries (Empty)", False, "Response is not a list", entries)
                    return False
                
                self.log_test("Get All Entries (Empty)", True, f"Successfully retrieved {len(entries)} entries", entries)
                return True
                
            except json.JSONDecodeError:
                self.log_test("Get All Entries (Empty)", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Get All Entries (Empty)", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_create_mood_entry(self):
        """Test POST /api/entries - create new mood entry"""
        print("\n=== Testing Create Mood Entry ===")
        
        # Create a realistic mood entry
        today = datetime.now().strftime("%Y-%m-%d")
        entry_data = {
            "date": today,
            "mood": {
                "id": 4,
                "name": "bene",
                "emoji": "😊",
                "color": "#6BCF7F"
            },
            "activities": [
                {
                    "id": 1,
                    "name": "Esercizio fisico",
                    "icon": "💪",
                    "category": "Benessere Fisico"
                },
                {
                    "id": 13,
                    "name": "Meditazione",
                    "icon": "🧘",
                    "category": "Attività Terapeutiche"
                }
            ],
            "note": "Giornata produttiva con allenamento mattutino e meditazione serale"
        }
        
        response, success, error = self.make_request("POST", "/entries", data=entry_data)
        
        if not success:
            self.log_test("Create Mood Entry", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                created_entry = response.json()
                
                # Verify entry structure
                required_fields = ["id", "date", "mood", "activities", "note", "created_at", "patient_id"]
                for field in required_fields:
                    if field not in created_entry:
                        self.log_test("Create Mood Entry", False, f"Missing field '{field}' in created entry", created_entry)
                        return False
                
                # Verify data matches
                if created_entry["date"] != entry_data["date"]:
                    self.log_test("Create Mood Entry", False, "Date mismatch", created_entry)
                    return False
                
                if created_entry["mood"]["id"] != entry_data["mood"]["id"]:
                    self.log_test("Create Mood Entry", False, "Mood mismatch", created_entry)
                    return False
                
                if len(created_entry["activities"]) != len(entry_data["activities"]):
                    self.log_test("Create Mood Entry", False, "Activities count mismatch", created_entry)
                    return False
                
                # Store entry ID for later tests
                self.created_entries.append(created_entry["id"])
                
                self.log_test("Create Mood Entry", True, f"Successfully created entry for {today}", created_entry)
                return True
                
            except json.JSONDecodeError:
                self.log_test("Create Mood Entry", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Create Mood Entry", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_create_duplicate_entry(self):
        """Test creating duplicate entry for same date (should fail)"""
        print("\n=== Testing Create Duplicate Entry ===")
        
        today = datetime.now().strftime("%Y-%m-%d")
        entry_data = {
            "date": today,
            "mood": {
                "id": 3,
                "name": "neutro",
                "emoji": "😐",
                "color": "#FFD23F"
            },
            "activities": [],
            "note": "Tentativo di duplicato"
        }
        
        response, success, error = self.make_request("POST", "/entries", data=entry_data)
        
        if not success:
            self.log_test("Create Duplicate Entry", False, f"Request failed: {error}")
            return False
        
        # Should return 400 Bad Request for duplicate
        if response.status_code == 400:
            try:
                error_response = response.json()
                if "already exists" in error_response.get("detail", "").lower():
                    self.log_test("Create Duplicate Entry", True, "Correctly rejected duplicate entry", error_response)
                    return True
                else:
                    self.log_test("Create Duplicate Entry", False, "Wrong error message for duplicate", error_response)
                    return False
            except json.JSONDecodeError:
                self.log_test("Create Duplicate Entry", False, "Invalid JSON error response", response.text)
                return False
        else:
            self.log_test("Create Duplicate Entry", False, f"Expected 400, got {response.status_code}", response.text)
            return False
    
    def test_get_entry_by_date(self):
        """Test GET /api/entries/{date} - get entry by specific date"""
        print("\n=== Testing Get Entry By Date ===")
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        response, success, error = self.make_request("GET", f"/entries/{today}")
        
        if not success:
            self.log_test("Get Entry By Date", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                entry = response.json()
                
                # Verify entry structure
                if "date" not in entry or entry["date"] != today:
                    self.log_test("Get Entry By Date", False, "Date mismatch in retrieved entry", entry)
                    return False
                
                if "mood" not in entry or "activities" not in entry:
                    self.log_test("Get Entry By Date", False, "Missing mood or activities in entry", entry)
                    return False
                
                self.log_test("Get Entry By Date", True, f"Successfully retrieved entry for {today}", entry)
                return True
                
            except json.JSONDecodeError:
                self.log_test("Get Entry By Date", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Get Entry By Date", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_get_nonexistent_entry(self):
        """Test GET /api/entries/{date} for non-existent date"""
        print("\n=== Testing Get Non-existent Entry ===")
        
        # Use a date far in the future
        future_date = (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d")
        
        response, success, error = self.make_request("GET", f"/entries/{future_date}")
        
        if not success:
            self.log_test("Get Non-existent Entry", False, f"Request failed: {error}")
            return False
        
        # Should return 404 Not Found
        if response.status_code == 404:
            try:
                error_response = response.json()
                if "not found" in error_response.get("detail", "").lower():
                    self.log_test("Get Non-existent Entry", True, "Correctly returned 404 for non-existent entry", error_response)
                    return True
                else:
                    self.log_test("Get Non-existent Entry", False, "Wrong error message for non-existent entry", error_response)
                    return False
            except json.JSONDecodeError:
                self.log_test("Get Non-existent Entry", False, "Invalid JSON error response", response.text)
                return False
        else:
            self.log_test("Get Non-existent Entry", False, f"Expected 404, got {response.status_code}", response.text)
            return False
    
    def test_get_all_entries_with_data(self):
        """Test GET /api/entries - get all entries (should have data now)"""
        print("\n=== Testing Get All Entries (With Data) ===")
        
        response, success, error = self.make_request("GET", "/entries")
        
        if not success:
            self.log_test("Get All Entries (With Data)", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                entries = response.json()
                
                if not isinstance(entries, list):
                    self.log_test("Get All Entries (With Data)", False, "Response is not a list", entries)
                    return False
                
                if len(entries) == 0:
                    self.log_test("Get All Entries (With Data)", False, "No entries found after creation", entries)
                    return False
                
                # Verify entry structure
                for entry in entries:
                    required_fields = ["id", "date", "mood", "activities", "created_at"]
                    for field in required_fields:
                        if field not in entry:
                            self.log_test("Get All Entries (With Data)", False, f"Missing field '{field}' in entry", entry)
                            return False
                
                self.log_test("Get All Entries (With Data)", True, f"Successfully retrieved {len(entries)} entries", entries)
                return True
                
            except json.JSONDecodeError:
                self.log_test("Get All Entries (With Data)", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Get All Entries (With Data)", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_statistics_overview(self):
        """Test GET /api/stats/overview - get mood statistics"""
        print("\n=== Testing Statistics Overview ===")
        
        response, success, error = self.make_request("GET", "/stats/overview")
        
        if not success:
            self.log_test("Statistics Overview", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                stats = response.json()
                
                # Verify statistics structure
                required_fields = ["total_entries", "current_streak", "average_mood", "most_common_activities", "mood_distribution"]
                for field in required_fields:
                    if field not in stats:
                        self.log_test("Statistics Overview", False, f"Missing field '{field}' in statistics", stats)
                        return False
                
                # Verify data types
                if not isinstance(stats["total_entries"], int):
                    self.log_test("Statistics Overview", False, "total_entries is not an integer", stats)
                    return False
                
                if not isinstance(stats["current_streak"], int):
                    self.log_test("Statistics Overview", False, "current_streak is not an integer", stats)
                    return False
                
                if not isinstance(stats["most_common_activities"], list):
                    self.log_test("Statistics Overview", False, "most_common_activities is not a list", stats)
                    return False
                
                if not isinstance(stats["mood_distribution"], dict):
                    self.log_test("Statistics Overview", False, "mood_distribution is not a dict", stats)
                    return False
                
                # Verify we have at least one entry (from our test)
                if stats["total_entries"] < 1:
                    self.log_test("Statistics Overview", False, "Expected at least 1 entry in statistics", stats)
                    return False
                
                self.log_test("Statistics Overview", True, f"Successfully retrieved statistics: {stats['total_entries']} entries, streak: {stats['current_streak']}", stats)
                return True
                
            except json.JSONDecodeError:
                self.log_test("Statistics Overview", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Statistics Overview", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_create_additional_entries(self):
        """Create additional entries for more comprehensive testing"""
        print("\n=== Testing Create Additional Entries ===")
        
        # Create entries for the past few days
        success_count = 0
        total_attempts = 3
        
        for i in range(1, total_attempts + 1):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            
            entry_data = {
                "date": date,
                "mood": {
                    "id": (i % 5) + 1,  # Cycle through mood IDs 1-5
                    "name": ["molto male", "male", "neutro", "bene", "molto bene"][(i % 5)],
                    "emoji": ["😞", "😔", "😐", "😊", "😄"][(i % 5)],
                    "color": ["#FF4747", "#FF8E53", "#FFD23F", "#6BCF7F", "#4FC3F7"][(i % 5)]
                },
                "activities": [
                    {
                        "id": i,
                        "name": f"Attività {i}",
                        "icon": "🎯",
                        "category": "Test"
                    }
                ],
                "note": f"Entry di test per il giorno {date}"
            }
            
            response, success, error = self.make_request("POST", "/entries", data=entry_data)
            
            if success and response.status_code == 200:
                success_count += 1
                try:
                    created_entry = response.json()
                    self.created_entries.append(created_entry["id"])
                except:
                    pass
        
        if success_count == total_attempts:
            self.log_test("Create Additional Entries", True, f"Successfully created {success_count} additional entries")
            return True
        else:
            self.log_test("Create Additional Entries", False, f"Only created {success_count}/{total_attempts} entries")
            return False
    
    def test_mood_trend_default(self):
        """Test GET /api/stats/mood-trend - default behavior (90 days)"""
        print("\n=== Testing Mood Trend (Default 90 days) ===")
        
        response, success, error = self.make_request("GET", "/stats/mood-trend")
        
        if not success:
            self.log_test("Mood Trend Default", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                trend_data = response.json()
                
                # Verify it's a list
                if not isinstance(trend_data, list):
                    self.log_test("Mood Trend Default", False, "Response is not a list", trend_data)
                    return False
                
                # If we have data, verify structure
                if len(trend_data) > 0:
                    required_fields = ["date", "mood_id", "mood_name", "mood_emoji", "mood_color", "activities_count", "note"]
                    for entry in trend_data:
                        for field in required_fields:
                            if field not in entry:
                                self.log_test("Mood Trend Default", False, f"Missing field '{field}' in trend entry", entry)
                                return False
                        
                        # Verify data types
                        if not isinstance(entry["mood_id"], int) or entry["mood_id"] < 1 or entry["mood_id"] > 5:
                            self.log_test("Mood Trend Default", False, f"Invalid mood_id: {entry['mood_id']}", entry)
                            return False
                        
                        if not isinstance(entry["activities_count"], int) or entry["activities_count"] < 0:
                            self.log_test("Mood Trend Default", False, f"Invalid activities_count: {entry['activities_count']}", entry)
                            return False
                        
                        # Verify date format (YYYY-MM-DD)
                        try:
                            datetime.strptime(entry["date"], "%Y-%m-%d")
                        except ValueError:
                            self.log_test("Mood Trend Default", False, f"Invalid date format: {entry['date']}", entry)
                            return False
                        
                        # Verify Italian mood names
                        expected_moods = ["molto male", "male", "neutro", "bene", "molto bene"]
                        if entry["mood_name"] not in expected_moods:
                            self.log_test("Mood Trend Default", False, f"Invalid mood name: {entry['mood_name']}", entry)
                            return False
                
                self.log_test("Mood Trend Default", True, f"Successfully retrieved mood trend data with {len(trend_data)} entries", trend_data)
                return True
                
            except json.JSONDecodeError:
                self.log_test("Mood Trend Default", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Mood Trend Default", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_mood_trend_with_days_parameter(self):
        """Test GET /api/stats/mood-trend with different days parameters"""
        print("\n=== Testing Mood Trend with Days Parameter ===")
        
        test_days = [30, 60, 90, 180, 365]
        success_count = 0
        
        for days in test_days:
            response, success, error = self.make_request("GET", "/stats/mood-trend", params={"days": days})
            
            if not success:
                self.log_test(f"Mood Trend {days} days", False, f"Request failed: {error}")
                continue
            
            if response.status_code == 200:
                try:
                    trend_data = response.json()
                    
                    if isinstance(trend_data, list):
                        self.log_test(f"Mood Trend {days} days", True, f"Successfully retrieved trend data for {days} days with {len(trend_data)} entries")
                        success_count += 1
                    else:
                        self.log_test(f"Mood Trend {days} days", False, "Response is not a list", trend_data)
                        
                except json.JSONDecodeError:
                    self.log_test(f"Mood Trend {days} days", False, "Invalid JSON response", response.text)
            else:
                self.log_test(f"Mood Trend {days} days", False, f"HTTP {response.status_code}", response.text)
        
        return success_count == len(test_days)
    
    def test_mood_trend_with_patient_id(self):
        """Test GET /api/stats/mood-trend with patient_id parameter"""
        print("\n=== Testing Mood Trend with Patient ID ===")
        
        response, success, error = self.make_request("GET", "/stats/mood-trend", params={"patient_id": "test_patient", "days": 30})
        
        if not success:
            self.log_test("Mood Trend with Patient ID", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            try:
                trend_data = response.json()
                
                if isinstance(trend_data, list):
                    # Should be empty for non-existent patient
                    self.log_test("Mood Trend with Patient ID", True, f"Successfully handled patient_id parameter, returned {len(trend_data)} entries")
                    return True
                else:
                    self.log_test("Mood Trend with Patient ID", False, "Response is not a list", trend_data)
                    return False
                    
            except json.JSONDecodeError:
                self.log_test("Mood Trend with Patient ID", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Mood Trend with Patient ID", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_csv_export_default(self):
        """Test GET /api/export/csv - CSV export with default patient_id"""
        print("\n=== Testing CSV Export (Default) ===")
        
        response, success, error = self.make_request("GET", "/export/csv")
        
        if not success:
            self.log_test("CSV Export Default", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            # Check Content-Type header
            content_type = response.headers.get('content-type', '')
            if 'text/csv' not in content_type:
                self.log_test("CSV Export Default", False, f"Wrong Content-Type: {content_type}")
                return False
            
            # Check Content-Disposition header for download
            content_disposition = response.headers.get('content-disposition', '')
            if 'attachment' not in content_disposition or 'filename=' not in content_disposition:
                self.log_test("CSV Export Default", False, f"Missing or invalid Content-Disposition: {content_disposition}")
                return False
            
            # Check filename format
            if 'LEAF_mood_data_' not in content_disposition and '.csv' not in content_disposition:
                self.log_test("CSV Export Default", False, f"Invalid filename format: {content_disposition}")
                return False
            
            # Check CSV content
            csv_content = response.text
            if not csv_content:
                self.log_test("CSV Export Default", False, "Empty CSV content")
                return False
            
            # Verify CSV structure
            lines = csv_content.strip().split('\n')
            if len(lines) < 1:
                self.log_test("CSV Export Default", False, "CSV has no content")
                return False
            
            # Check CSV headers
            expected_headers = ['Data', 'Umore', 'Livello_Umore', 'Emoji', 'Attività', 'Note', 'Data_Creazione']
            first_line = lines[0]
            for header in expected_headers:
                if header not in first_line:
                    self.log_test("CSV Export Default", False, f"Missing CSV header: {header}")
                    return False
            
            # Check for statistics section
            if '=== STATISTICHE RIASSUNTIVE ===' not in csv_content:
                self.log_test("CSV Export Default", False, "Missing statistics section in CSV")
                return False
            
            # Check for mood distribution section
            if '=== DISTRIBUZIONE UMORE ===' not in csv_content:
                self.log_test("CSV Export Default", False, "Missing mood distribution section in CSV")
                return False
            
            self.log_test("CSV Export Default", True, f"Successfully exported CSV with {len(lines)} lines, proper headers and sections")
            return True
            
        else:
            self.log_test("CSV Export Default", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_csv_export_with_patient_id(self):
        """Test GET /api/export/csv with specific patient_id parameter"""
        print("\n=== Testing CSV Export with Patient ID ===")
        
        response, success, error = self.make_request("GET", "/export/csv", params={"patient_id": "test_patient"})
        
        if not success:
            self.log_test("CSV Export with Patient ID", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            # Check headers
            content_type = response.headers.get('content-type', '')
            if 'text/csv' not in content_type:
                self.log_test("CSV Export with Patient ID", False, f"Wrong Content-Type: {content_type}")
                return False
            
            # Check CSV content (should be minimal for non-existent patient)
            csv_content = response.text
            lines = csv_content.strip().split('\n')
            
            # Should still have headers and sections even if no data
            expected_headers = ['Data', 'Umore', 'Livello_Umore', 'Emoji', 'Attività', 'Note', 'Data_Creazione']
            first_line = lines[0]
            for header in expected_headers:
                if header not in first_line:
                    self.log_test("CSV Export with Patient ID", False, f"Missing CSV header: {header}")
                    return False
            
            self.log_test("CSV Export with Patient ID", True, f"Successfully handled patient_id parameter, returned CSV with {len(lines)} lines")
            return True
            
        else:
            self.log_test("CSV Export with Patient ID", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_csv_content_verification(self):
        """Test CSV content structure and data integrity"""
        print("\n=== Testing CSV Content Verification ===")
        
        response, success, error = self.make_request("GET", "/export/csv")
        
        if not success:
            self.log_test("CSV Content Verification", False, f"Request failed: {error}")
            return False
        
        if response.status_code == 200:
            csv_content = response.text
            lines = csv_content.strip().split('\n')
            
            # Parse CSV content
            import csv
            import io
            
            try:
                csv_reader = csv.reader(io.StringIO(csv_content))
                rows = list(csv_reader)
                
                if len(rows) < 1:
                    self.log_test("CSV Content Verification", False, "No rows in CSV")
                    return False
                
                # Check headers
                headers = rows[0]
                expected_headers = ['Data', 'Umore', 'Livello_Umore', 'Emoji', 'Attività', 'Note', 'Data_Creazione']
                if headers != expected_headers:
                    self.log_test("CSV Content Verification", False, f"Header mismatch. Expected: {expected_headers}, Got: {headers}")
                    return False
                
                # Count data rows (before statistics section)
                data_rows = 0
                stats_section_found = False
                distribution_section_found = False
                
                for i, row in enumerate(rows[1:], 1):  # Skip header
                    if len(row) > 0 and '=== STATISTICHE RIASSUNTIVE ===' in row[0]:
                        stats_section_found = True
                        break
                    elif len(row) == len(headers) and row[0] and row[0] != '':
                        # This is a data row
                        data_rows += 1
                        
                        # Verify date format (YYYY-MM-DD)
                        try:
                            datetime.strptime(row[0], "%Y-%m-%d")
                        except ValueError:
                            self.log_test("CSV Content Verification", False, f"Invalid date format in row {i}: {row[0]}")
                            return False
                        
                        # Verify mood level is numeric
                        try:
                            mood_level = int(row[2])
                            if mood_level < 1 or mood_level > 5:
                                self.log_test("CSV Content Verification", False, f"Invalid mood level in row {i}: {mood_level}")
                                return False
                        except ValueError:
                            self.log_test("CSV Content Verification", False, f"Non-numeric mood level in row {i}: {row[2]}")
                            return False
                
                # Check for statistics section
                for row in rows:
                    if len(row) > 0 and '=== STATISTICHE RIASSUNTIVE ===' in row[0]:
                        stats_section_found = True
                    elif len(row) > 0 and '=== DISTRIBUZIONE UMORE ===' in row[0]:
                        distribution_section_found = True
                
                if not stats_section_found:
                    self.log_test("CSV Content Verification", False, "Statistics section not found in CSV")
                    return False
                
                if not distribution_section_found:
                    self.log_test("CSV Content Verification", False, "Mood distribution section not found in CSV")
                    return False
                
                self.log_test("CSV Content Verification", True, f"CSV content verified: {data_rows} data rows, statistics and distribution sections present")
                return True
                
            except Exception as e:
                self.log_test("CSV Content Verification", False, f"Error parsing CSV: {str(e)}")
                return False
            
        else:
            self.log_test("CSV Content Verification", False, f"HTTP {response.status_code}", response.text)
            return False
    
    def test_existing_endpoints_verification(self):
        """Quick verification that existing endpoints still work after CSV implementation"""
        print("\n=== Testing Existing Endpoints Verification ===")
        
        success_count = 0
        total_tests = 2
        
        # Test statistics overview
        response, success, error = self.make_request("GET", "/stats/overview")
        if success and response.status_code == 200:
            self.log_test("Existing Endpoint - Stats Overview", True, "Statistics overview endpoint still working")
            success_count += 1
        else:
            self.log_test("Existing Endpoint - Stats Overview", False, f"Statistics overview failed: {error or response.status_code}")
        
        # Test entries endpoint
        response, success, error = self.make_request("GET", "/entries")
        if success and response.status_code == 200:
            self.log_test("Existing Endpoint - Entries", True, "Entries endpoint still working")
            success_count += 1
        else:
            self.log_test("Existing Endpoint - Entries", False, f"Entries endpoint failed: {error or response.status_code}")
        
        return success_count == total_tests
    
    def test_data_validation(self):
        """Test data validation scenarios"""
        print("\n=== Testing Data Validation ===")
        
        # Test invalid date format
        invalid_entry = {
            "date": "invalid-date",
            "mood": {
                "id": 3,
                "name": "neutro",
                "emoji": "😐",
                "color": "#FFD23F"
            },
            "activities": [],
            "note": "Test con data invalida"
        }
        
        response, success, error = self.make_request("POST", "/entries", data=invalid_entry)
        
        if not success:
            self.log_test("Data Validation - Invalid Date", True, f"Request correctly failed: {error}")
            return True
        
        # If request succeeded, check if it was properly rejected
        if response.status_code >= 400:
            self.log_test("Data Validation - Invalid Date", True, f"Invalid date correctly rejected with status {response.status_code}")
            return True
        else:
            self.log_test("Data Validation - Invalid Date", False, f"Invalid date was accepted (status {response.status_code})")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting LEAF Backend Test Suite")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_health_check,
            self.test_mood_levels,
            self.test_activity_categories,
            self.test_get_all_entries_empty,
            self.test_create_mood_entry,
            self.test_create_duplicate_entry,
            self.test_get_entry_by_date,
            self.test_get_nonexistent_entry,
            self.test_get_all_entries_with_data,
            self.test_create_additional_entries,
            self.test_statistics_overview,
            self.test_mood_trend_default,
            self.test_mood_trend_with_days_parameter,
            self.test_mood_trend_with_patient_id,
            self.test_existing_endpoints_verification,
            self.test_data_validation
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                self.log_test(test.__name__, False, f"Test threw exception: {str(e)}")
                failed += 1
            
            # Small delay between tests
            time.sleep(0.5)
        
        # Print summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📊 Total: {passed + failed}")
        print(f"📈 Success Rate: {(passed / (passed + failed) * 100):.1f}%")
        
        if failed == 0:
            print("\n🎉 All tests passed! Backend is working correctly.")
        else:
            print(f"\n⚠️  {failed} test(s) failed. Check the details above.")
        
        return failed == 0

def main():
    """Main test execution"""
    tester = LEAFBackendTester()
    
    try:
        success = tester.run_all_tests()
        
        # Save detailed results
        with open("/app/backend_test_results.json", "w") as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "base_url": BASE_URL,
                "total_tests": len(tester.test_results),
                "passed": sum(1 for r in tester.test_results if r["success"]),
                "failed": sum(1 for r in tester.test_results if not r["success"]),
                "results": tester.test_results
            }, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n💥 Test suite crashed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())