"""
Test script for Satellite and AI endpoints
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_satellite_endpoint():
    """Test Google Earth Engine satellite analysis"""
    print("\n" + "="*60)
    print("TESTING SATELLITE ENDPOINT (GEE)")
    print("="*60)
    
    url = f"{BASE_URL}/api/v1/gee/analyze"
    params = {
        "lat": 28.6139,  # New Delhi coordinates
        "lon": 77.2090
    }
    
    print(f"\n📡 Testing: {url}")
    print(f"Parameters: {params}")
    
    try:
        start = time.time()
        response = requests.get(url, params=params, timeout=60)
        elapsed = time.time() - start
        
        print(f"\n⏱️  Response Time: {elapsed:.2f}s")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ SUCCESS!")
            print(f"\nSatellite Analysis Results:")
            print(f"  • Location: {data.get('lat')}, {data.get('lon')}")
            print(f"  • Construction Dust Index: {data.get('construction_dust_index')}")
            print(f"  • Biomass Burning Index: {data.get('biomass_burning_index')}")
            print(f"  • Dominant Source: {data.get('dominant_source')}")
            return True
        else:
            print(f"\n❌ FAILED!")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

def test_ai_agent_endpoint():
    """Test AI Agent query endpoint"""
    print("\n" + "="*60)
    print("TESTING AI AGENT ENDPOINT")
    print("="*60)
    
    url = f"{BASE_URL}/api/v1/admin/agents/query"
    payload = {
        "query": "What is the current air quality situation in Delhi?"
    }
    
    print(f"\n🤖 Testing: {url}")
    print(f"Query: {payload['query']}")
    
    try:
        start = time.time()
        response = requests.post(url, json=payload, timeout=60)
        elapsed = time.time() - start
        
        print(f"\n⏱️  Response Time: {elapsed:.2f}s")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ SUCCESS!")
            print(f"\nAI Agent Response:")
            print(f"  • Query: {data.get('query')}")
            print(f"  • Confidence: {data.get('confidence', 0)*100:.1f}%")
            print(f"  • Data Sources: {', '.join(data.get('data_sources', []))}")
            print(f"  • Response Time: {data.get('response_time_ms')}ms")
            print(f"\n  Analysis Preview:")
            analysis = data.get('analysis', '')
            preview = analysis[:300] + "..." if len(analysis) > 300 else analysis
            print(f"  {preview}")
            return True
        else:
            print(f"\n❌ FAILED!")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

def test_policy_recommendations():
    """Test Policy Recommendations endpoint (uses Gemini)"""
    print("\n" + "="*60)
    print("TESTING POLICY RECOMMENDATIONS ENDPOINT")
    print("="*60)
    
    url = f"{BASE_URL}/api/v1/dashboard/policy-recommendations"
    
    print(f"\n📋 Testing: {url}")
    
    try:
        start = time.time()
        response = requests.get(url, timeout=60)
        elapsed = time.time() - start
        
        print(f"\n⏱️  Response Time: {elapsed:.2f}s")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ SUCCESS!")
            print(f"\nPolicy Recommendations:")
            recommendations = data.get('recommendations', '')
            preview = recommendations[:400] + "..." if len(recommendations) > 400 else recommendations
            print(f"  {preview}")
            return True
        else:
            print(f"\n❌ FAILED!")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

if __name__ == "__main__":
    print("\n🚀 Starting Endpoint Tests...")
    print("Testing Gemini 3.1 Pro Preview Integration")
    
    results = {
        "Satellite (GEE)": test_satellite_endpoint(),
        "AI Agent": test_ai_agent_endpoint(),
        "Policy Recommendations": test_policy_recommendations()
    }
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    total = len(results)
    passed = sum(results.values())
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Gemini 3.1 Pro is working correctly!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the logs above.")
