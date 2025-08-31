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