#!/usr/bin/env python3
"""
Collect Training Data from Online Sources
Fetches data from WAQI, OpenAQ, and other APIs
"""

import requests
import pandas as pd
import time
from datetime import datetime, timedelta
import json
import os

print("="*80)
print("VayuDrishti - Online Data Collection")
print("="*80)

# ============================================================================
# CONFIGURATION
# ============================================================================

# WAQI API Token (from .env)
WAQI_TOKEN = os.getenv('WAQI_TOKEN', 'your_token_here')

# Delhi monitoring stations
DELHI_STATIONS = [
    'Anand Vihar',
    'ITO',
    'Dwarka',
    'Mandir Marg',
    'RK Puram',
    'Punjabi Bagh',
    'Rohini',
    'Vivek Vihar',
    'Najafgarh',
    'Mundka'
]

# ============================================================================
# 1. WAQI API - Real-time and Historical Data
# ============================================================================

def fetch_waqi_station_data(station_name):
    """Fetch current data from WAQI for a station"""
    try:
        url = f"https://api.waqi.info/feed/{station_name},delhi/?token={WAQI_TOKEN}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data['status'] == 'ok':
                return data['data']
        return None
    except Exception as e:
        print(f"  Error fetching {station_name}: {e}")
        return None

def collect_waqi_data():
    """Collect data from all Delhi WAQI stations"""
    print("\n[1/4] Collecting WAQI Data...")
    
    all_data = []
    
    for station in DELHI_STATIONS:
        print(f"  Fetching {station}...")
        data = fetch_waqi_station_data(station)
        
        if data:
            record = {
                'timestamp': datetime.now().isoformat(),
                'station': station,
                'aqi': data.get('aqi', None),
                'pm25': data.get('iaqi', {}).get('pm25', {}).get('v', None),
                'pm10': data.get('iaqi', {}).get('pm10', {}).get('v', None),
                'no2': data.get('iaqi', {}).get('no2', {}).get('v', None),
                'so2': data.get('iaqi', {}).get('so2', {}).get('v', None),
                'co': data.get('iaqi', {}).get('co', {}).get('v', None),
                'o3': data.get('iaqi', {}).get('o3', {}).get('v', None),
                'temp': data.get('iaqi', {}).get('t', {}).get('v', None),
                'humidity': data.get('iaqi', {}).get('h', {}).get('v', None),
                'pressure': data.get('iaqi', {}).get('p', {}).get('v', None),
                'wind_speed': data.get('iaqi', {}).get('w', {}).get('v', None),
            }
            all_data.append(record)
            print(f"    ✓ AQI: {record['aqi']}, PM2.5: {record['pm25']}, PM10: {record['pm10']}")
        
        time.sleep(1)  # Rate limiting
    
    df = pd.DataFrame(all_data)
    df.to_csv('collected_data/waqi_current.csv', index=False)
    print(f"  ✓ Saved {len(df)} records to collected_data/waqi_current.csv")
    
    return df

# ============================================================================
# 2. OpenAQ API - Historical Data
# ============================================================================

def fetch_openaq_data(days=30):
    """Fetch historical data from OpenAQ"""
    print(f"\n[2/4] Collecting OpenAQ Data (last {days} days)...")
    
    # OpenAQ API endpoint
    base_url = "https://api.openaq.org/v2/measurements"
    
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    all_data = []
    
    # Parameters for Delhi
    params = {
        'country': 'IN',
        'city': 'Delhi',
        'date_from': start_date.strftime('%Y-%m-%d'),
        'date_to': end_date.strftime('%Y-%m-%d'),
        'limit': 10000,
        'parameter': 'pm25,pm10,no2,so2,co,o3'
    }
    
    try:
        print(f"  Fetching from {start_date.date()} to {end_date.date()}...")
        response = requests.get(base_url, params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])
            
            for r in results:
                record = {
                    'timestamp': r['date']['utc'],
                    'location': r['location'],
                    'parameter': r['parameter'],
                    'value': r['value'],
                    'unit': r['unit'],
                    'latitude': r['coordinates']['latitude'],
                    'longitude': r['coordinates']['longitude']
                }
                all_data.append(record)
            
            print(f"  ✓ Fetched {len(all_data)} measurements")
        else:
            print(f"  ✗ Error: Status code {response.status_code}")
    
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    if all_data:
        df = pd.DataFrame(all_data)
        
        # Pivot to wide format
        df_pivot = df.pivot_table(
            index=['timestamp', 'location', 'latitude', 'longitude'],
            columns='parameter',
            values='value',
            aggfunc='mean'
        ).reset_index()
        
        df_pivot.to_csv('collected_data/openaq_historical.csv', index=False)
        print(f"  ✓ Saved {len(df_pivot)} records to collected_data/openaq_historical.csv")
        
        return df_pivot
    
    return None

# ============================================================================
# 3. CPCB Data (if available)
# ============================================================================

def fetch_cpcb_data():
    """Fetch data from CPCB (Central Pollution Control Board)"""
    print("\n[3/4] Collecting CPCB Data...")
    
    # CPCB doesn't have a public API, but we can try their data portal
    # This is a placeholder - you'd need to implement web scraping or use their official API
    
    print("  ℹ CPCB requires manual download or web scraping")
    print("  Visit: https://app.cpcbccr.com/ccr/#/caaqm-dashboard-all/caaqm-landing")
    print("  Download data manually and place in collected_data/cpcb_data.csv")
    
    # Check if manual file exists
    if os.path.exists('collected_data/cpcb_data.csv'):
        df = pd.read_csv('collected_data/cpcb_data.csv')
        print(f"  ✓ Loaded {len(df)} records from collected_data/cpcb_data.csv")
        return df
    else:
        print("  ✗ No CPCB data file found")
        return None

# ============================================================================
# 4. Combine All Data
# ============================================================================

def combine_all_data():
    """Combine data from all sources"""
    print("\n[4/4] Combining all data sources...")
    
    all_dfs = []
    
    # Load WAQI
    if os.path.exists('collected_data/waqi_current.csv'):
        df_waqi = pd.read_csv('collected_data/waqi_current.csv')
        df_waqi['source'] = 'WAQI'
        all_dfs.append(df_waqi)
        print(f"  ✓ WAQI: {len(df_waqi)} records")
    
    # Load OpenAQ
    if os.path.exists('collected_data/openaq_historical.csv'):
        df_openaq = pd.read_csv('collected_data/openaq_historical.csv')
        df_openaq['source'] = 'OpenAQ'
        all_dfs.append(df_openaq)
        print(f"  ✓ OpenAQ: {len(df_openaq)} records")
    
    # Load CPCB
    if os.path.exists('collected_data/cpcb_data.csv'):
        df_cpcb = pd.read_csv('collected_data/cpcb_data.csv')
        df_cpcb['source'] = 'CPCB'
        all_dfs.append(df_cpcb)
        print(f"  ✓ CPCB: {len(df_cpcb)} records")
    
    # Load existing datasets
    if os.path.exists('dataset_extracted/city_day.csv'):
        df_city = pd.read_csv('dataset_extracted/city_day.csv')
        df_city = df_city[df_city['City'] == 'Delhi']
        df_city['source'] = 'Historical'
        all_dfs.append(df_city)
        print(f"  ✓ Historical: {len(df_city)} records")
    
    if all_dfs:
        # Combine all
        df_combined = pd.concat(all_dfs, ignore_index=True, sort=False)
        
        # Remove duplicates
        df_combined = df_combined.drop_duplicates()
        
        # Save
        df_combined.to_csv('collected_data/combined_training_data.csv', index=False)
        print(f"\n  ✓ Combined dataset: {len(df_combined)} records")
        print(f"  ✓ Saved to collected_data/combined_training_data.csv")
        
        # Show summary
        print(f"\n  Summary by source:")
        print(df_combined['source'].value_counts())
        
        return df_combined
    else:
        print("  ✗ No data collected")
        return None

# ============================================================================
# MAIN
# ============================================================================

def main():
    # Create output directory
    os.makedirs('collected_data', exist_ok=True)
    
    # Collect from all sources
    df_waqi = collect_waqi_data()
    df_openaq = fetch_openaq_data(days=30)
    df_cpcb = fetch_cpcb_data()
    
    # Combine
    df_combined = combine_all_data()
    
    print("\n" + "="*80)
    print("DATA COLLECTION COMPLETE!")
    print("="*80)
    
    if df_combined is not None:
        print(f"\nTotal records collected: {len(df_combined)}")
        print(f"\nNext steps:")
        print(f"  1. Review collected_data/combined_training_data.csv")
        print(f"  2. Run: python train_advanced.py")
        print(f"  3. Compare results with baseline model")
    else:
        print("\nNo data collected. Check your API tokens and internet connection.")
    
    print("="*80)

if __name__ == "__main__":
    main()
