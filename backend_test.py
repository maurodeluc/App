#!/usr/bin/env python3
"""
Test completo del backend LEAF per mood tracking
Testa tutte le funzionalità dell'API FastAPI + MongoDB
"""

import requests
import json
from datetime import datetime, date
import uuid
import time

# Configurazione URL del backend
BACKEND_URL = "https://felicita-app.preview.emergentagent.com/api"

class LEAFBackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_entries = []
        self.results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def log_result(self, test_name, success, message=""):
        if success:
            self.results["passed"] += 1
            print(f"✅ {test_name}: PASS {message}")
        else:
            self.results["failed"] += 1
            self.results["errors"].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: FAIL {message}")
    
    def test_base_endpoint(self):
        """Test 1: Endpoint base GET /api/"""
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "LEAF" in data.get("message", ""):
                    self.log_result("Base Endpoint", True, f"Response: {data}")
                else:
                    self.log_result("Base Endpoint", False, f"Unexpected message: {data}")
            else:
                self.log_result("Base Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Base Endpoint", False, f"Exception: {str(e)}")
    
    def test_create_mood_entry_complete(self):
        """Test 2: Creare entry completo con umore + attività + nota"""
        try:
            entry_data = {
                "mood_level": "felice",
                "activities": ["famiglia", "relax"],
                "note": "Giornata piacevole con la famiglia al parco",
                "date": date.today().isoformat()
            }
            
            response = requests.post(f"{self.base_url}/mood-entries", json=entry_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("id") and data.get("mood_level") == "felice":
                    self.test_entries.append(data["id"])
                    self.log_result("Create Complete Entry", True, f"ID: {data['id']}")
                else:
                    self.log_result("Create Complete Entry", False, f"Invalid response: {data}")
            else:
                self.log_result("Create Complete Entry", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("Create Complete Entry", False, f"Exception: {str(e)}")
    
    def test_create_mood_entry_minimal(self):
        """Test 3: Creare entry minimo (solo umore + attività)"""
        try:
            entry_data = {
                "mood_level": "neutro",
                "activities": ["lavoro"],
                "date": date.today().isoformat()
            }
            
            response = requests.post(f"{self.base_url}/mood-entries", json=entry_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("id") and data.get("mood_level") == "neutro":
                    self.test_entries.append(data["id"])
                    self.log_result("Create Minimal Entry", True, f"ID: {data['id']}")
                else:
                    self.log_result("Create Minimal Entry", False, f"Invalid response: {data}")
            else:
                self.log_result("Create Minimal Entry", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("Create Minimal Entry", False, f"Exception: {str(e)}")
    
    def test_get_all_mood_entries(self):
        """Test 4: Ottenere tutti gli entries"""
        try:
            response = requests.get(f"{self.base_url}/mood-entries")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get All Entries", True, f"Found {len(data)} entries")
                else:
                    self.log_result("Get All Entries", False, f"Expected list, got: {type(data)}")
            else:
                self.log_result("Get All Entries", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Get All Entries", False, f"Exception: {str(e)}")
    
    def test_get_specific_mood_entry(self):
        """Test 5: Ottenere entry specifico"""
        if not self.test_entries:
            self.log_result("Get Specific Entry", False, "No test entries available")
            return
        
        try:
            entry_id = self.test_entries[0]
            response = requests.get(f"{self.base_url}/mood-entries/{entry_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get("id") == entry_id:
                    self.log_result("Get Specific Entry", True, f"Retrieved entry: {entry_id}")
                else:
                    self.log_result("Get Specific Entry", False, f"ID mismatch: {data.get('id')} != {entry_id}")
            else:
                self.log_result("Get Specific Entry", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Get Specific Entry", False, f"Exception: {str(e)}")
    
    def test_update_mood_entry(self):
        """Test 6: Aggiornare entry esistente"""
        if not self.test_entries:
            self.log_result("Update Entry", False, "No test entries available")
            return
        
        try:
            entry_id = self.test_entries[0]
            update_data = {
                "mood_level": "molto_felice",
                "note": "Aggiornato: giornata fantastica!"
            }
            
            response = requests.put(f"{self.base_url}/mood-entries/{entry_id}", json=update_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("mood_level") == "molto_felice":
                    self.log_result("Update Entry", True, f"Updated entry: {entry_id}")
                else:
                    self.log_result("Update Entry", False, f"Update failed: {data}")
            else:
                self.log_result("Update Entry", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Update Entry", False, f"Exception: {str(e)}")
    
    def test_mood_statistics(self):
        """Test 7: Ottenere statistiche con alcuni entries"""
        try:
            response = requests.get(f"{self.base_url}/mood-stats")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_entries", "average_mood", "most_common_activities", "mood_distribution"]
                if all(field in data for field in required_fields):
                    self.log_result("Mood Statistics", True, f"Stats: {data['total_entries']} entries, avg mood: {data['average_mood']}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Mood Statistics", False, f"Missing fields: {missing}")
            else:
                self.log_result("Mood Statistics", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Mood Statistics", False, f"Exception: {str(e)}")
    
    def test_export_csv(self):
        """Test 8: Esportare dati in CSV"""
        try:
            response = requests.get(f"{self.base_url}/export-csv")
            if response.status_code == 200:
                data = response.json()
                if "csv_data" in data and "Data,Umore,Attività,Note" in data["csv_data"]:
                    lines = data["csv_data"].split('\n')
                    self.log_result("Export CSV", True, f"CSV with {len(lines)} lines")
                else:
                    self.log_result("Export CSV", False, f"Invalid CSV format: {data}")
            else:
                self.log_result("Export CSV", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Export CSV", False, f"Exception: {str(e)}")
    
    def test_validation_no_mood(self):
        """Test 9: Validazione - entry senza umore"""
        try:
            entry_data = {
                "activities": ["lavoro"],
                "date": date.today().isoformat()
            }
            
            response = requests.post(f"{self.base_url}/mood-entries", json=entry_data)
            if response.status_code == 422:  # Validation error expected
                self.log_result("Validation No Mood", True, "Correctly rejected entry without mood")
            else:
                self.log_result("Validation No Mood", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("Validation No Mood", False, f"Exception: {str(e)}")
    
    def test_validation_invalid_mood(self):
        """Test 10: Validazione - umore invalido"""
        try:
            entry_data = {
                "mood_level": "super_felice",  # Invalid mood
                "activities": ["lavoro"],
                "date": date.today().isoformat()
            }
            
            response = requests.post(f"{self.base_url}/mood-entries", json=entry_data)
            if response.status_code == 422:  # Validation error expected
                self.log_result("Validation Invalid Mood", True, "Correctly rejected invalid mood")
            else:
                self.log_result("Validation Invalid Mood", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_result("Validation Invalid Mood", False, f"Exception: {str(e)}")
    
    def test_get_nonexistent_entry(self):
        """Test 11: Ottenere entry inesistente"""
        try:
            fake_id = str(uuid.uuid4())
            response = requests.get(f"{self.base_url}/mood-entries/{fake_id}")
            if response.status_code == 404:
                self.log_result("Get Nonexistent Entry", True, "Correctly returned 404")
            else:
                self.log_result("Get Nonexistent Entry", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_result("Get Nonexistent Entry", False, f"Exception: {str(e)}")
    
    def test_delete_mood_entry(self):
        """Test 12: Eliminare entry"""
        if not self.test_entries:
            self.log_result("Delete Entry", False, "No test entries available")
            return
        
        try:
            entry_id = self.test_entries[-1]  # Delete last entry
            response = requests.delete(f"{self.base_url}/mood-entries/{entry_id}")
            if response.status_code == 200:
                data = response.json()
                if "eliminato" in data.get("message", "").lower():
                    self.test_entries.remove(entry_id)
                    self.log_result("Delete Entry", True, f"Deleted entry: {entry_id}")
                else:
                    self.log_result("Delete Entry", False, f"Unexpected message: {data}")
            else:
                self.log_result("Delete Entry", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Delete Entry", False, f"Exception: {str(e)}")
    
    def test_create_multiple_activities(self):
        """Test 13: Entry con multiple attività"""
        try:
            entry_data = {
                "mood_level": "molto_felice",
                "activities": ["sport", "sociale", "hobby"],
                "note": "Giornata piena di attività divertenti",
                "date": date.today().isoformat()
            }
            
            response = requests.post(f"{self.base_url}/mood-entries", json=entry_data)
            if response.status_code == 200:
                data = response.json()
                if len(data.get("activities", [])) == 3:
                    self.test_entries.append(data["id"])
                    self.log_result("Multiple Activities", True, f"Created with 3 activities")
                else:
                    self.log_result("Multiple Activities", False, f"Expected 3 activities, got {len(data.get('activities', []))}")
            else:
                self.log_result("Multiple Activities", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Multiple Activities", False, f"Exception: {str(e)}")
    
    def cleanup_test_entries(self):
        """Pulisce gli entries di test creati"""
        print("\n🧹 Cleaning up test entries...")
        for entry_id in self.test_entries[:]:
            try:
                response = requests.delete(f"{self.base_url}/mood-entries/{entry_id}")
                if response.status_code == 200:
                    print(f"   Deleted: {entry_id}")
                    self.test_entries.remove(entry_id)
            except Exception as e:
                print(f"   Failed to delete {entry_id}: {str(e)}")
    
    def run_all_tests(self):
        """Esegue tutti i test"""
        print("🚀 Starting LEAF Backend Tests")
        print(f"🔗 Testing URL: {self.base_url}")
        print("=" * 60)
        
        # Test di base
        self.test_base_endpoint()
        
        # Test CRUD
        self.test_create_mood_entry_complete()
        self.test_create_mood_entry_minimal()
        self.test_create_multiple_activities()
        self.test_get_all_mood_entries()
        self.test_get_specific_mood_entry()
        self.test_update_mood_entry()
        
        # Test funzionalità avanzate
        self.test_mood_statistics()
        self.test_export_csv()
        
        # Test validazione
        self.test_validation_no_mood()
        self.test_validation_invalid_mood()
        self.test_get_nonexistent_entry()
        
        # Test eliminazione
        self.test_delete_mood_entry()
        
        # Cleanup
        self.cleanup_test_entries()
        
        # Risultati finali
        print("\n" + "=" * 60)
        print("📊 RISULTATI FINALI:")
        print(f"✅ Test Passati: {self.results['passed']}")
        print(f"❌ Test Falliti: {self.results['failed']}")
        
        if self.results['errors']:
            print("\n🔍 ERRORI DETTAGLIATI:")
            for error in self.results['errors']:
                print(f"   • {error}")
        
        success_rate = (self.results['passed'] / (self.results['passed'] + self.results['failed'])) * 100
        print(f"\n📈 Tasso di Successo: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 ECCELLENTE! Backend funziona correttamente")
        elif success_rate >= 70:
            print("⚠️  BUONO: Alcuni problemi minori da risolvere")
        else:
            print("🚨 CRITICO: Problemi significativi nel backend")
        
        return success_rate >= 70

if __name__ == "__main__":
    tester = LEAFBackendTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)