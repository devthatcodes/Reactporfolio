import requests
import sys
import json
from datetime import datetime

class MacroHubAPITester:
    def __init__(self):
        self.base_url = "https://friendly-ardinghelli-4.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.currencies = ["USD", "GBP", "EUR", "CAD", "AUD", "NZD", "JPY", "CHF"]
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status=200, params=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=params, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    json_data = response.json()
                    print(f"   Response: {json.dumps(json_data, indent=2)[:200]}...")
                    return True, json_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.test_results.append({
                    "test": name,
                    "status": "FAILED",
                    "expected": expected_status,
                    "actual": response.status_code,
                    "error": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "test": name,
                "status": "ERROR",
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test basic API health"""
        return self.run_test("API Health Check", "GET", "/")

    def test_risk_sentiment(self, currency="USD"):
        """Test risk sentiment endpoint"""
        success, data = self.run_test(f"Risk Sentiment - {currency}", "GET", f"/risk-sentiment/{currency}")
        if success and data:
            if 'value' in data and 'label' in data:
                print(f"   Risk Value: {data['value']}%, Label: {data['label']}")
                return True
            else:
                print(f"   ❌ Missing required fields in response")
                return False
        return success

    def test_trade_flows(self, currency="USD"):
        """Test trade flows endpoint"""
        success, data = self.run_test(f"Trade Flows - {currency}", "GET", f"/trade-flows/{currency}")
        if success and data:
            if 'exports' in data and 'imports' in data:
                print(f"   Exports items: {len(data['exports'])}, Imports items: {len(data['imports'])}")
                return True
            else:
                print(f"   ❌ Missing exports/imports in response")
                return False
        return success

    def test_insights(self, currency="USD"):
        """Test insights endpoint"""
        success, data = self.run_test(f"Insights - {currency}", "GET", f"/insights/{currency}")
        if success and data:
            if 'insights' in data:
                print(f"   Insights count: {len(data['insights'])}")
                return True
            else:
                print(f"   ❌ Missing insights in response")
                return False
        return success

    def test_fed_data(self, currency="USD"):
        """Test fed data endpoint"""
        success, data = self.run_test(f"Fed Data - {currency}", "GET", f"/fed-data/{currency}")
        if success and data:
            required_fields = ['stance', 'rate', 'last_change', 'next_date', 'hold_probability']
            if all(field in data for field in required_fields):
                print(f"   Fed Stance: {data['stance']}, Rate: {data['rate']}")
                return True
            else:
                print(f"   ❌ Missing required fields in fed data response")
                return False
        return success

    def test_fed_events(self, currency="USD"):
        """Test fed events endpoint"""
        success, data = self.run_test(f"Fed Events - {currency}", "GET", f"/fed-events/{currency}")
        if success and data:
            if 'events' in data:
                print(f"   Events count: {len(data['events'])}")
                return True
            else:
                print(f"   ❌ Missing events in response")
                return False
        return success

    def test_recent_news(self, currency="USD"):
        """Test recent news endpoint"""
        success, data = self.run_test(f"Recent News - {currency}", "GET", f"/recent-news/{currency}")
        if success and data:
            if 'news' in data:
                print(f"   News items count: {len(data['news'])}")
                return True
            else:
                print(f"   ❌ Missing news in response")
                return False
        return success

    def test_yield_reactions(self, currency="USD"):
        """Test yield reactions endpoint"""
        success, data = self.run_test(f"Yield Reactions - {currency}", "GET", f"/yield-reactions/{currency}")
        if success and data:
            if 'reactions' in data:
                print(f"   Reactions count: {len(data['reactions'])}")
                return True
            else:
                print(f"   ❌ Missing reactions in response")
                return False
        return success

    def test_fedwatch(self, currency="USD"):
        """Test fedwatch endpoint"""
        success, data = self.run_test(f"FedWatch - {currency}", "GET", f"/fedwatch/{currency}")
        if success and data:
            if 'fedwatch' in data:
                print(f"   FedWatch items count: {len(data['fedwatch'])}")
                return True
            else:
                print(f"   ❌ Missing fedwatch in response")
                return False
        return success

    def test_labor_market(self, currency="USD"):
        """Test labor market endpoint"""
        success, data = self.run_test(f"Labor Market - {currency}", "GET", f"/labor-market/{currency}")
        if success and data:
            if 'data' in data and len(data['data']) > 0:
                print(f"   Labor market data points: {len(data['data'])}")
                return True
            else:
                print(f"   ❌ Missing labor market data in response")
                return False
        return success

    def test_inflation(self, currency="USD"):
        """Test inflation endpoint"""
        success, data = self.run_test(f"Inflation - {currency}", "GET", f"/inflation/{currency}")
        if success and data:
            if 'data' in data and len(data['data']) > 0:
                print(f"   Inflation data points: {len(data['data'])}")
                return True
            else:
                print(f"   ❌ Missing inflation data in response")
                return False
        return success

    def test_seasonality(self, currency="USD"):
        """Test seasonality endpoint"""
        success, data = self.run_test(f"Seasonality - {currency}", "GET", f"/seasonality/{currency}")
        if success and data:
            if 'data' in data and len(data['data']) > 0:
                print(f"   Seasonality data points: {len(data['data'])}")
                return True
            else:
                print(f"   ❌ Missing seasonality data in response")
                return False
        return success

    def test_currency_strength(self, currency="USD"):
        """Test currency strength endpoint"""
        success, data = self.run_test(f"Currency Strength - {currency}", "GET", f"/currency-strength/{currency}")
        if success and data:
            if 'currencies' in data and len(data['currencies']) > 0:
                print(f"   Currency strength items: {len(data['currencies'])}")
                return True
            else:
                print(f"   ❌ Missing currencies data in response")
                return False
        return success

    def test_currency_heatmap(self, currency="USD"):
        """Test currency heatmap endpoint"""
        success, data = self.run_test(f"Currency Heatmap - {currency}", "GET", f"/currency-heatmap/{currency}")
        if success and data:
            if 'heatmap' in data and 'timeframes' in data:
                print(f"   Heatmap currencies: {len(data['heatmap'])}, Timeframes: {len(data['timeframes'])}")
                return True
            else:
                print(f"   ❌ Missing heatmap/timeframes in response")
                return False
        return success

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Macro Hub Backend API Tests...")
        print(f"Base URL: {self.base_url}")
        
        # Test API health first
        if not self.test_health_check():
            print("❌ API health check failed. Cannot continue with other tests.")
            return False

        # Test all endpoints with USD first
        test_currency = "USD"
        
        # Core endpoints
        self.test_risk_sentiment(test_currency)
        self.test_trade_flows(test_currency)
        self.test_insights(test_currency)
        self.test_fed_data(test_currency)
        self.test_fed_events(test_currency)
        self.test_recent_news(test_currency)
        self.test_yield_reactions(test_currency)
        self.test_fedwatch(test_currency)
        
        # Chart data endpoints
        self.test_labor_market(test_currency)
        self.test_inflation(test_currency)
        self.test_seasonality(test_currency)
        
        # Currency related endpoints
        self.test_currency_strength(test_currency)
        self.test_currency_heatmap(test_currency)

        # Test with a different currency to ensure currency switching works
        print(f"\n🔄 Testing currency switching with EUR...")
        self.test_risk_sentiment("EUR")
        self.test_trade_flows("EUR")
        self.test_fed_data("EUR")

        # Print final results
        print(f"\n📊 Backend Test Results:")
        print(f"   Tests passed: {self.tests_passed}/{self.tests_run}")
        print(f"   Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.test_results:
            print(f"\n❌ Failed tests:")
            for result in self.test_results:
                print(f"   - {result['test']}: {result.get('error', 'Status code mismatch')}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = MacroHubAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())