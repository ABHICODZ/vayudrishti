"""
Test script for Policy Simulator endpoint
Run this to verify the mathematical model works correctly
"""

import requests
import json

# Test configuration
API_BASE = "http://127.0.0.1:8080"
# You'll need to replace this with a valid token from your session
TEST_TOKEN = "your_token_here"

def test_policy_simulation():
    """Test the policy simulation endpoint"""
    
    print("=" * 60)
    print("TESTING POLICY SIMULATOR")
    print("=" * 60)
    
    # Test data
    payload = {
        "current_aqi": 350.0,
        "traffic_reduction": 50.0,
        "industrial_reduction": 30.0,
        "construction_ban": True,
        "duration": 7
    }
    
    print(f"\nTest Input:")
    print(json.dumps(payload, indent=2))
    
    # Make request
    url = f"{API_BASE}/api/v1/admin/policy/simulate"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {TEST_TOKEN}"
    }
    
    try:
        print(f"\nCalling: {url}")
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✅ SUCCESS! Simulation Result:")
            print(json.dumps(result, indent=2))
            
            # Verify the mathematical model
            print(f"\n📊 Analysis:")
            print(f"  Current AQI: {result['current_aqi']}")
            print(f"  Predicted AQI: {result['predicted_aqi']}")
            print(f"  Reduction: {result['aqi_reduction']} ({result['percent_change']}%)")
            print(f"  Methodology: {result['methodology']}")
            print(f"  Confidence: {result['confidence'] * 100}%")
            print(f"\n  Sector Breakdown:")
            for sector, impact in result['breakdown'].items():
                print(f"    - {sector}: {impact}%")
            
        else:
            print(f"\n❌ ERROR: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print(f"\n❌ CONNECTION ERROR: Cannot connect to {API_BASE}")
        print("Make sure the backend server is running!")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

def test_without_auth():
    """Test without authentication to see the error"""
    print("\n" + "=" * 60)
    print("TESTING WITHOUT AUTHENTICATION")
    print("=" * 60)
    
    payload = {
        "current_aqi": 350.0,
        "traffic_reduction": 50.0,
        "industrial_reduction": 30.0,
        "construction_ban": True,
        "duration": 7
    }
    
    url = f"{API_BASE}/api/v1/admin/policy/simulate"
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    print("\n🧪 Policy Simulator Test Suite\n")
    
    # Test 1: Without auth (to see what error users might get)
    test_without_auth()
    
    # Test 2: With auth (you need to provide a token)
    print("\n\n⚠️  To test with authentication:")
    print("1. Login to your app and get the access_token from browser DevTools")
    print("2. Replace TEST_TOKEN in this script")
    print("3. Run: python backend/test_policy_simulator.py")
    
    # Uncomment this when you have a token:
    # test_policy_simulation()
