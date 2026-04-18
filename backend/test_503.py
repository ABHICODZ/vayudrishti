import urllib.request
import urllib.error
import json
import time

try:
    print("Fetching Wards to initialize ML Cache...")
    wards_res = urllib.request.urlopen('http://127.0.0.1:8080/api/v1/dashboard/wards')
    wards = json.loads(wards_res.read())
    print(f"Wards fetched: {len(wards)}")
    
    # Wait a bit to ensure async cache is populated globally
    time.sleep(2)
    
    print("Fetching Recommendations via Vertex AI...")
    req = urllib.request.Request('http://127.0.0.1:8080/api/v1/dashboard/recommendations')
    response = urllib.request.urlopen(req, timeout=120)
    print("Success:")
    print(json.dumps(json.loads(response.read().decode()), indent=2))
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}:")
    print(e.read().decode())
except Exception as e:
    print(f"Other Error: {e}")
