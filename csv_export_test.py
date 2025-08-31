#!/usr/bin/env python3
"""
Focused CSV Export Test Suite for LEAF Mood Tracking App
Tests the new CSV export endpoint /api/export/csv
"""

import requests
import json
import sys
from datetime import datetime
import csv
import io

# Configuration
BASE_URL = "https://leaf-therapy.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class CSVExportTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: any = None):
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
    
    def make_request(self, method: str, endpoint: str, params: dict = None) -> tuple:
        """Make HTTP request and return response and success status"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=self.headers, params=params, timeout=10)
            else:
                return None, False, f"Unsupported method: {method}"
            
            return response, True, None
        except requests.exceptions.RequestException as e:
            return None, False, str(e)
    
    def test_csv_export_default_behavior(self):
        """Test CSV export with default patient_id"""
        print("\n=== Testing CSV Export Default Behavior ===")
        
        response, success, error = self.make_request("GET", "/export/csv")
        
        if not success:
            self.log_test("CSV Export Default", False, f"Request failed: {error}")
            return False
        
        if response.status_code != 200:
            self.log_test("CSV Export Default", False, f"HTTP {response.status_code}", response.text)
            return False
        
        # Check Content-Type header
        content_type = response.headers.get('content-type', '')
        if 'text/csv' not in content_type:
            self.log_test("CSV Export Default", False, f"Wrong Content-Type: {content_type}")
            return False
        
        # Check Content-Disposition header
        content_disposition = response.headers.get('content-disposition', '')
        if 'attachment' not in content_disposition or 'filename=' not in content_disposition:
            self.log_test("CSV Export Default", False, f"Missing Content-Disposition: {content_disposition}")
            return False
        
        # Check filename format
        if 'LEAF_mood_data_' not in content_disposition and '.csv' not in content_disposition:
            self.log_test("CSV Export Default", False, f"Invalid filename: {content_disposition}")
            return False
        
        # Check CSV content exists
        csv_content = response.text
        if not csv_content:
            self.log_test("CSV Export Default", False, "Empty CSV content")
            return False
        
        self.log_test("CSV Export Default", True, f"Successfully exported CSV with proper headers and content")
        return True
    
    def test_csv_export_with_patient_id(self):
        """Test CSV export with specific patient_id parameter"""
        print("\n=== Testing CSV Export with Patient ID ===")
        
        response, success, error = self.make_request("GET", "/export/csv", params={"patient_id": "test_patient"})
        
        if not success:
            self.log_test("CSV Export Patient ID", False, f"Request failed: {error}")
            return False
        
        if response.status_code != 200:
            self.log_test("CSV Export Patient ID", False, f"HTTP {response.status_code}", response.text)
            return False
        
        # Check headers
        content_type = response.headers.get('content-type', '')
        if 'text/csv' not in content_type:
            self.log_test("CSV Export Patient ID", False, f"Wrong Content-Type: {content_type}")
            return False
        
        csv_content = response.text
        if not csv_content:
            self.log_test("CSV Export Patient ID", False, "Empty CSV content")
            return False
        
        self.log_test("CSV Export Patient ID", True, "Successfully handled patient_id parameter")
        return True
    
    def test_csv_structure_verification(self):
        """Test CSV structure and format"""
        print("\n=== Testing CSV Structure Verification ===")
        
        response, success, error = self.make_request("GET", "/export/csv")
        
        if not success:
            self.log_test("CSV Structure", False, f"Request failed: {error}")
            return False
        
        if response.status_code != 200:
            self.log_test("CSV Structure", False, f"HTTP {response.status_code}", response.text)
            return False
        
        csv_content = response.text
        lines = csv_content.strip().split('\n')
        
        # Check minimum lines
        if len(lines) < 5:  # At least headers + some content
            self.log_test("CSV Structure", False, f"Too few lines in CSV: {len(lines)}")
            return False
        
        # Check CSV headers
        expected_headers = ['Data', 'Umore', 'Livello_Umore', 'Emoji', 'Attività', 'Note', 'Data_Creazione']
        first_line = lines[0]
        
        for header in expected_headers:
            if header not in first_line:
                self.log_test("CSV Structure", False, f"Missing header: {header}")
                return False
        
        # Check for required sections
        csv_text = '\n'.join(lines)
        
        if '=== STATISTICHE RIASSUNTIVE ===' not in csv_text:
            self.log_test("CSV Structure", False, "Missing statistics section")
            return False
        
        if '=== DISTRIBUZIONE UMORE ===' not in csv_text:
            self.log_test("CSV Structure", False, "Missing mood distribution section")
            return False
        
        self.log_test("CSV Structure", True, f"CSV structure verified with {len(lines)} lines and all required sections")
        return True
    
    def test_csv_content_parsing(self):
        """Test CSV content can be properly parsed"""
        print("\n=== Testing CSV Content Parsing ===")
        
        response, success, error = self.make_request("GET", "/export/csv")
        
        if not success:
            self.log_test("CSV Content Parsing", False, f"Request failed: {error}")
            return False
        
        if response.status_code != 200:
            self.log_test("CSV Content Parsing", False, f"HTTP {response.status_code}", response.text)
            return False
        
        csv_content = response.text
        
        try:
            # Parse CSV content
            csv_reader = csv.reader(io.StringIO(csv_content))
            rows = list(csv_reader)
            
            if len(rows) < 1:
                self.log_test("CSV Content Parsing", False, "No rows in CSV")
                return False
            
            # Check headers
            headers = rows[0]
            expected_headers = ['Data', 'Umore', 'Livello_Umore', 'Emoji', 'Attività', 'Note', 'Data_Creazione']
            
            if headers != expected_headers:
                self.log_test("CSV Content Parsing", False, f"Header mismatch. Expected: {expected_headers}, Got: {headers}")
                return False
            
            # Count data rows and validate structure
            data_rows = 0
            stats_found = False
            distribution_found = False
            
            for i, row in enumerate(rows[1:], 1):
                if len(row) > 0:
                    if '=== STATISTICHE RIASSUNTIVE ===' in row[0]:
                        stats_found = True
                        continue
                    elif '=== DISTRIBUZIONE UMORE ===' in row[0]:
                        distribution_found = True
                        continue
                    elif len(row) == len(headers) and row[0] and not row[0].startswith('==='):
                        # This is a data row
                        data_rows += 1
                        
                        # Validate mood level is numeric (allowing for invalid dates from existing data)
                        try:
                            mood_level = int(row[2])
                            if mood_level < 1 or mood_level > 5:
                                self.log_test("CSV Content Parsing", False, f"Invalid mood level: {mood_level}")
                                return False
                        except ValueError:
                            self.log_test("CSV Content Parsing", False, f"Non-numeric mood level: {row[2]}")
                            return False
            
            if not stats_found:
                self.log_test("CSV Content Parsing", False, "Statistics section not found")
                return False
            
            if not distribution_found:
                self.log_test("CSV Content Parsing", False, "Distribution section not found")
                return False
            
            self.log_test("CSV Content Parsing", True, f"CSV parsed successfully: {data_rows} data rows, statistics and distribution sections present")
            return True
            
        except Exception as e:
            self.log_test("CSV Content Parsing", False, f"CSV parsing error: {str(e)}")
            return False
    
    def test_integration_existing_endpoints(self):
        """Test that existing endpoints still work after CSV implementation"""
        print("\n=== Testing Integration with Existing Endpoints ===")
        
        success_count = 0
        total_tests = 2
        
        # Test statistics overview
        response, success, error = self.make_request("GET", "/stats/overview")
        if success and response.status_code == 200:
            self.log_test("Integration - Stats Overview", True, "Statistics endpoint working")
            success_count += 1
        else:
            self.log_test("Integration - Stats Overview", False, f"Stats failed: {error or response.status_code}")
        
        # Test entries endpoint
        response, success, error = self.make_request("GET", "/entries")
        if success and response.status_code == 200:
            self.log_test("Integration - Entries", True, "Entries endpoint working")
            success_count += 1
        else:
            self.log_test("Integration - Entries", False, f"Entries failed: {error or response.status_code}")
        
        return success_count == total_tests
    
    def test_csv_statistics_content(self):
        """Test that CSV contains proper statistics data"""
        print("\n=== Testing CSV Statistics Content ===")
        
        response, success, error = self.make_request("GET", "/export/csv")
        
        if not success:
            self.log_test("CSV Statistics Content", False, f"Request failed: {error}")
            return False
        
        if response.status_code != 200:
            self.log_test("CSV Statistics Content", False, f"HTTP {response.status_code}", response.text)
            return False
        
        csv_content = response.text
        
        # Check for specific statistics metrics
        required_metrics = [
            'Entries totali',
            'Giorni consecutivi', 
            'Umore medio',
            'Attività più comuni'
        ]
        
        for metric in required_metrics:
            if metric not in csv_content:
                self.log_test("CSV Statistics Content", False, f"Missing statistic: {metric}")
                return False
        
        # Check for mood distribution
        italian_moods = ['molto male', 'male', 'neutro', 'bene', 'molto bene']
        mood_found = False
        for mood in italian_moods:
            if mood in csv_content:
                mood_found = True
                break
        
        if not mood_found:
            self.log_test("CSV Statistics Content", False, "No Italian mood names found in distribution")
            return False
        
        self.log_test("CSV Statistics Content", True, "CSV contains proper statistics and mood distribution data")
        return True
    
    def run_csv_export_tests(self):
        """Run all CSV export tests"""
        print("🚀 Starting LEAF CSV Export Test Suite")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test sequence focused on CSV export
        tests = [
            self.test_csv_export_default_behavior,
            self.test_csv_export_with_patient_id,
            self.test_csv_structure_verification,
            self.test_csv_content_parsing,
            self.test_csv_statistics_content,
            self.test_integration_existing_endpoints
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
        
        # Print summary
        print("\n" + "=" * 60)
        print("🏁 CSV EXPORT TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📊 Total: {passed + failed}")
        print(f"📈 Success Rate: {(passed / (passed + failed) * 100):.1f}%")
        
        if failed == 0:
            print("\n🎉 All CSV export tests passed! CSV functionality is ready for production.")
        else:
            print(f"\n⚠️  {failed} test(s) failed. Check the details above.")
        
        return failed == 0

def main():
    """Main test execution"""
    tester = CSVExportTester()
    
    try:
        success = tester.run_csv_export_tests()
        
        # Save detailed results
        with open("/app/csv_export_test_results.json", "w") as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "base_url": BASE_URL,
                "total_tests": len(tester.test_results),
                "passed": sum(1 for r in tester.test_results if r["success"]),
                "failed": sum(1 for r in tester.test_results if not r["success"]),
                "results": tester.test_results
            }, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: /app/csv_export_test_results.json")
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n💥 Test suite crashed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())