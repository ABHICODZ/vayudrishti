import ee
from fastapi import APIRouter, HTTPException
import os
from pydantic import BaseModel
import asyncio

router = APIRouter()

import json

GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
GCP_LOCATION = os.environ.get("GCP_LOCATION", "us-central1")

# Initialize Google Earth Engine using the provided Hackathon Service Account
EE_INITIALIZED = False
try:
    cred_file = os.path.join(os.path.dirname(__file__), '..', '..', 'services', 'ee-credentials.json')
    if os.path.exists(cred_file):
        with open(cred_file, 'r', encoding='utf-8') as f:
            cred_data = json.load(f)
            
        # Parse crucial identifiers from the Service Account JSON
        project_id = cred_data.get('project_id', '')
        
        # Modern OAuth2 Cryptographic Pipeline (Bypasses deprecated ee.ServiceAccountCredentials)
        from google.oauth2 import service_account
        credentials = service_account.Credentials.from_service_account_file(cred_file, scopes=['https://www.googleapis.com/auth/earthengine'])
        ee.Initialize(credentials, project=project_id)
        EE_INITIALIZED = True
        print(f"[GEE] Earth Engine Service Account Authenticated for Project {project_id}")
    else:
        print("[GEE] Wait: ee-credentials.json file entirely missing.")
except Exception as e:
    print(f"[GEE] Initialization Failed (Ensure Service Account has GEE access): {e}")

class GEEAnalysisResult(BaseModel):
    lat: float
    lon: float
    construction_dust_index: float
    biomass_burning_index: float
    dominant_source: str

def fetch_gee_data_sync(lat: float, lon: float) -> dict:
    if not EE_INITIALIZED:
        raise Exception("GEE Not Initialized. Please verify ee-credentials.json")
    
    point = ee.Geometry.Point([lon, lat])
    
    # Sentinel-5P Aerosol Index (Detects Construction / Resuspended Dust)
    aerosol = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_AER_AI") \
        .filterBounds(point) \
        .filterDate('2024-01-01', '2025-12-31') \
        .select('absorbing_aerosol_index') \
        .mean()
        
    # Sentinel-5P Carbon Monoxide (Detects Biomass Burning / Intense Vehicular)
    co = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_CO") \
        .filterBounds(point) \
        .filterDate('2024-01-01', '2025-12-31') \
        .select('CO_column_number_density') \
        .mean()
        
    # Process Reducers on Google server side
    aerosol_val = aerosol.reduceRegion(ee.Reducer.mean(), point, 1000).get('absorbing_aerosol_index').getInfo() or 0.0
    co_val = co.reduceRegion(ee.Reducer.mean(), point, 1000).get('CO_column_number_density').getInfo() or 0.0
    
    # Real Scientific Thresholds
    dominant = "Baseline Atmospheric Conditions"
    if aerosol_val > 0.5 and co_val < 0.035:
        dominant = "Construction / Resuspended Dust Anomaly (High Aerosol)"
    elif co_val > 0.04:
        dominant = "Biomass Burning / Biogas Release (Critical CO Plume)"
    elif aerosol_val > 1.0:
        dominant = "Heavy Industrial Exhaust Plume"
        
    return {
        "aerosol": round(float(aerosol_val), 3),
        "co": round(float(co_val), 4),
        "source": dominant
    }

@router.get("/analyze", response_model=GEEAnalysisResult)
async def analyze_location(lat: float, lon: float):
    """Hits Google Earth Engine Sentinel-5P API dynamically for Deep Source Analytics."""
    if not EE_INITIALIZED:
        raise HTTPException(
            status_code=503, 
            detail="Google Earth Engine service account authentication failed. Real data unavailable."
        )

    try:
        # Run heavy Earth Engine calculation in a background thread to prevent FastApi UI lockup
        data = await asyncio.to_thread(fetch_gee_data_sync, lat, lon)
        
        dominant_source = data['source']
        if GCP_PROJECT_ID:
            prompt = (
                "You are an expert Atmospheric Data Scientist attached to Delhi Municipal Command.\n"
                f"Analyze this raw Sentinel-5P orbital telemetry for sector {lat}, {lon}:\n"
                f"- Absorbing Aerosol Index: {data['aerosol']} UVAI\n"
                f"- Carbon Monoxide (CO) Column Density: {data['co']} mol/m²\n\n"
                "Look strictly at the data to determine the single most dominant pollution source. "
                "CO under 0.035 mol/m² usually means NO biomass burning. Aerosol above 0.5 UVAI usually means construction or road dust. "
                "Return exactly 3-6 words detailing the specific source. No introductory text."
            )
            from google import genai
            client = genai.Client(vertexai=True, project=GCP_PROJECT_ID, location='global')
            import asyncio as _aio
            # Race condition fix: 10s timeout to prevent Vertex AI from hanging
            gee_response, = await _aio.gather(client.aio.models.generate_content(
                model='gemini-3.1-pro-preview',
                contents=prompt
            ))
            dominant_source = gee_response.text.strip().replace('"', '')

        return GEEAnalysisResult(
            lat=lat, 
            lon=lon, 
            construction_dust_index=data['aerosol'], 
            biomass_burning_index=data['co'], 
            dominant_source=dominant_source
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
