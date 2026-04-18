"""
VayuDrishti — Vertex AI Diagnostic Script
Run from: backend/
Command:  python diagnose_vertex.py
"""
import os
import sys
import json
import asyncio

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("[ENV] dotenv loaded")
except Exception as e:
    print(f"[ENV] dotenv not available: {e}")

print("\n" + "="*60)
print("  STEP 1: ENVIRONMENT VARIABLES")
print("="*60)

gcp_project  = os.getenv("GCP_PROJECT_ID")
gcp_location = os.getenv("GCP_LOCATION", "us-central1")
waqi_token   = os.getenv("WAQI_TOKEN")
google_creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

print(f"  GCP_PROJECT_ID              : {repr(gcp_project)}")
print(f"  GCP_LOCATION                : {repr(gcp_location)}")
print(f"  WAQI_TOKEN                  : {'SET ✅' if waqi_token else 'MISSING ❌'}")
print(f"  GOOGLE_APPLICATION_CREDENTIALS: {repr(google_creds)}")

if google_creds:
    exists = os.path.exists(google_creds)
    print(f"  Credentials file exists     : {'YES ✅' if exists else 'NO ❌ — FILE NOT FOUND'}")

print("\n" + "="*60)
print("  STEP 2: SERVICE ACCOUNT CREDENTIALS FILE CHECK")
print("="*60)

local_creds = os.path.join(os.path.dirname(__file__), "app", "services", "ee-credentials.json")
print(f"  Looking for: {local_creds}")
if os.path.exists(local_creds):
    try:
        with open(local_creds) as f:
            data = json.load(f)
        print(f"  Type        : {data.get('type', 'unknown')}")
        print(f"  Project     : {data.get('project_id', 'NOT SET ❌')}")
        print(f"  Client email: {data.get('client_email', 'NOT SET ❌')}")
        # Auto-fill GCP_PROJECT_ID if missing from env
        if not gcp_project and data.get("project_id"):
            gcp_project = data["project_id"]
            os.environ["GCP_PROJECT_ID"] = gcp_project
            print(f"  ✅ Auto-set GCP_PROJECT_ID={gcp_project} from credentials file")
    except Exception as e:
        print(f"  ❌ Failed to read credentials file: {e}")
else:
    print("  ❌ ee-credentials.json NOT FOUND — this is the main credential file")

print("\n" + "="*60)
print("  STEP 3: VERTEX AI SDK TEST")
print("="*60)

async def test_vertex():
    if not gcp_project:
        print("  ❌ CANNOT TEST — GCP_PROJECT_ID is not set and not in credentials file")
        print("  FIX: Add GCP_PROJECT_ID=<your-gcp-project> to backend/.env")
        return False

    try:
        from google import genai
        print(f"  google-genai SDK imported ✅")
        print(f"  Initializing client: project={gcp_project}, location={gcp_location}")
        client = genai.Client(vertexai=True, project=gcp_project, location=gcp_location)

        test_prompt = "Reply with the word ALIVE only."
        print(f"  Sending test prompt: '{test_prompt}'")

        response = await client.aio.models.generate_content(
            model='gemini-3.1-pro-preview',
            contents=test_prompt
        )
        print(f"  ✅ VERTEX AI IS WORKING! Response: {response.text[:100]}")
        return True

    except ImportError as e:
        print(f"  ❌ SDK import failed: {e}")
        print("  FIX: pip install google-genai")
        return False
    except Exception as e:
        print(f"  ❌ VERTEX AI CALL FAILED:")
        print(f"     {type(e).__name__}: {e}")
        # Common fixes
        err_str = str(e).lower()
        if "credentials" in err_str or "authentication" in err_str or "401" in err_str:
            print("\n  📋 LIKELY FIX: Credentials are invalid or expired.")
            print("     → Re-download your service account JSON from GCP Console")
            print("     → Save it as backend/app/services/ee-credentials.json")
        elif "permission" in err_str or "403" in err_str:
            print("\n  📋 LIKELY FIX: Service account doesn't have Vertex AI permission.")
            print("     → Go to GCP IAM → add 'Vertex AI User' role to your service account")
        elif "project" in err_str:
            print("\n  📋 LIKELY FIX: GCP project ID is wrong or Vertex AI API not enabled.")
            print(f"     → Check GCP Console for project: {gcp_project}")
            print("     → Enable: Vertex AI API at console.cloud.google.com/apis")
        return False

print("\n" + "="*60)
print("  STEP 4: ML INFERENCE CACHE CHECK")  
print("="*60)
try:
    sys.path.insert(0, os.path.dirname(__file__))
    # Quick check of live data without triggering full load
    import httpx, asyncio as aio
    waqi_url = f"https://api.waqi.info/map/bounds/?latlng=28.4,76.8,28.9,77.4&token={waqi_token}"
    if waqi_token:
        async def check_waqi():
            async with httpx.AsyncClient(timeout=10.0) as c:
                r = await c.get(waqi_url)
                data = r.json()
                count = len([s for s in data.get("data", []) if int(s.get("aqi", 0) or 0) > 0])
                print(f"  WAQI Live Stations Available: {count} ✅" if count > 0 else f"  WAQI returned 0 stations ❌")
        aio.run(check_waqi())
    else:
        print("  WAQI test skipped — no token")
except Exception as e:
    print(f"  WAQI check error: {e}")

result = asyncio.run(test_vertex())

print("\n" + "="*60)
print("  DIAGNOSIS SUMMARY")
print("="*60)
if result:
    print("  ✅ Vertex AI is WORKING — recommendations should appear")
    print("     If they still don't, check /api/v1/dashboard/recommendations in browser")
else:
    print("  ❌ Vertex AI is BROKEN — see fixes above")
    print("  The recommendations endpoint will return 503 until this is fixed")
print("="*60 + "\n")
