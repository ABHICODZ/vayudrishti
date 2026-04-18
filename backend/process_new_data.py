#!/usr/bin/env python3
"""
Process New Delhi AQI Data (2021-2025)
Converts daily and hourly Excel files to a unified training dataset
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import glob

print("="*80)
print("Processing New Delhi AQI Data (2021-2025)")
print("="*80)

# ============================================================================
# STEP 1: Process Daily Data (2021-2025)
# ============================================================================

print("\n[STEP 1/4] Processing daily data (2021-2025)...")

daily_files = glob.glob('dataset_extracted/AQI_daily_city_level_delhi_*.xlsx')
daily_files = [f for f in daily_files if 'hourly' not in f]

print(f"  Found {len(daily_files)} daily files")

all_daily_data = []

for file in sorted(daily_files):
    year = file.split('_')[-1].replace('.xlsx', '')
    print(f"  Processing {year}...")
    
    df = pd.read_excel(file)
    
    # The data is in wide format: Day | January | February | ... | December
    # We need to convert to long format
    
    for month_idx, month_name in enumerate(['January', 'February', 'March', 'April', 
                                             'May', 'June', 'July', 'August', 
                                             'September', 'October', 'November', 'December'], 1):
        if month_name in df.columns:
            for _, row in df.iterrows():
                day = row['Day']
                aqi = row[month_name]
                
                if pd.notna(day) and pd.notna(aqi):
                    try:
                        date = datetime(int(year), month_idx, int(day))
                        all_daily_data.append({
                            'Date': date,
                            'AQI': float(aqi),
                            'Source': 'Daily'
                        })
                    except:
                        pass

df_daily = pd.DataFrame(all_daily_data)
print(f"  ✓ Processed {len(df_daily)} daily records")

# ============================================================================
# STEP 2: Process Hourly Data (2025)
# ============================================================================

print("\n[STEP 2/4] Processing hourly data (2025)...")

hourly_files = glob.glob('dataset_extracted/AQI_hourly_city_level_delhi_2025_*.xlsx')

print(f"  Found {len(hourly_files)} hourly files")

all_hourly_data = []

month_map = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
}

for file in sorted(hourly_files):
    # Extract month from filename
    for month_name, month_num in month_map.items():
        if month_name in file:
            print(f"  Processing {month_name} 2025...")
            
            df = pd.read_excel(file)
            
            # The data is in wide format: Date | 00:00:00 | 01:00:00 | ... | 23:00:00
            # We need to convert to long format
            
            for _, row in df.iterrows():
                day = row['Date']
                
                if pd.notna(day):
                    try:
                        date = datetime(2025, month_num, int(day))
                        
                        # Get hourly values
                        for hour in range(24):
                            hour_col = f'{hour:02d}:00:00'
                            if hour_col in df.columns:
                                aqi = row[hour_col]
                                if pd.notna(aqi):
                                    timestamp = date + timedelta(hours=hour)
                                    all_hourly_data.append({
                                        'Date': timestamp,
                                        'AQI': float(aqi),
                                        'Source': 'Hourly'
                                    })
                    except Exception as e:
                        pass
            break

df_hourly = pd.DataFrame(all_hourly_data)
print(f"  ✓ Processed {len(df_hourly)} hourly records")

# ============================================================================
# STEP 3: Combine with Existing Data
# ============================================================================

print("\n[STEP 3/4] Combining with existing data...")

# Load existing data
existing_data = []

# Load city_day.csv
if os.path.exists('dataset_extracted/city_day.csv'):
    df_city = pd.read_csv('dataset_extracted/city_day.csv')
    df_city_delhi = df_city[df_city['City'] == 'Delhi'].copy()
    df_city_delhi['Date'] = pd.to_datetime(df_city_delhi['Date'])
    
    for _, row in df_city_delhi.iterrows():
        existing_data.append({
            'Date': row['Date'],
            'AQI': row.get('AQI', None),
            'PM2.5': row.get('PM2.5', None),
            'PM10': row.get('PM10', None),
            'NO': row.get('NO', None),
            'NO2': row.get('NO2', None),
            'NOx': row.get('NOx', None),
            'NH3': row.get('NH3', None),
            'CO': row.get('CO', None),
            'SO2': row.get('SO2', None),
            'O3': row.get('O3', None),
            'Source': 'Historical'
        })
    print(f"  ✓ Loaded {len(df_city_delhi)} records from city_day.csv")

# Load delhi_aqi.csv
if os.path.exists('dataset_extracted/delhi_aqi.csv'):
    df_delhi_aqi = pd.read_csv('dataset_extracted/delhi_aqi.csv')
    # Column names are lowercase in this file
    df_delhi_aqi['Date'] = pd.to_datetime(df_delhi_aqi['date'], errors='coerce')
    
    for _, row in df_delhi_aqi.iterrows():
        if pd.notna(row['Date']):
            existing_data.append({
                'Date': row['Date'],
                'AQI': row.get('aqi', None),
                'PM2.5': row.get('pm25', None),
                'PM10': row.get('pm10', None),
                'NO': row.get('no', None),
                'NO2': row.get('no2', None),
                'NOx': row.get('nox', None),
                'NH3': row.get('nh3', None),
                'CO': row.get('co_ppb', None),
                'SO2': row.get('so2', None),
                'O3': row.get('o3', None),
                'Source': 'Historical'
            })
    print(f"  ✓ Loaded {len(df_delhi_aqi)} records from delhi_aqi.csv")

df_existing = pd.DataFrame(existing_data)

# Combine all data
df_combined = pd.concat([df_existing, df_daily, df_hourly], ignore_index=True)

# Remove duplicates (keep first occurrence)
df_combined = df_combined.sort_values('Date')
df_combined = df_combined.drop_duplicates(subset=['Date'], keep='first')

print(f"\n  Combined dataset:")
print(f"    Historical: {len(df_existing)} records")
print(f"    Daily (2021-2025): {len(df_daily)} records")
print(f"    Hourly (2025): {len(df_hourly)} records")
print(f"    Total: {len(df_combined)} records")

# ============================================================================
# STEP 4: Add Features and Save
# ============================================================================

print("\n[STEP 4/4] Adding features and saving...")

# Add temporal features
df_combined['year'] = df_combined['Date'].dt.year
df_combined['month'] = df_combined['Date'].dt.month
df_combined['day'] = df_combined['Date'].dt.day
df_combined['day_of_week'] = df_combined['Date'].dt.dayofweek
df_combined['day_of_year'] = df_combined['Date'].dt.dayofyear
df_combined['hour'] = df_combined['Date'].dt.hour
df_combined['is_weekend'] = (df_combined['day_of_week'] >= 5).astype(int)

# Add season
def get_season(month):
    if month in [12, 1, 2]:
        return 0  # winter
    elif month in [3, 4, 5]:
        return 1  # spring
    elif month in [6, 7, 8]:
        return 2  # summer
    else:
        return 3  # autumn

df_combined['season'] = df_combined['month'].apply(get_season)

# Estimate PM2.5 and PM10 from AQI if not available
# This is a rough approximation based on Indian AQI standards
def estimate_pm_from_aqi(aqi):
    """Estimate PM2.5 and PM10 from AQI (rough approximation)"""
    if pd.isna(aqi):
        return None, None
    
    # AQI breakpoints (assuming PM2.5 is the dominant pollutant)
    if aqi <= 50:
        pm25 = aqi * 30 / 50
        pm10 = aqi * 50 / 50
    elif aqi <= 100:
        pm25 = 30 + (aqi - 50) * 30 / 50
        pm10 = 50 + (aqi - 50) * 50 / 50
    elif aqi <= 200:
        pm25 = 60 + (aqi - 100) * 30 / 100
        pm10 = 100 + (aqi - 100) * 150 / 100
    elif aqi <= 300:
        pm25 = 90 + (aqi - 200) * 30 / 100
        pm10 = 250 + (aqi - 200) * 100 / 100
    elif aqi <= 400:
        pm25 = 120 + (aqi - 300) * 130 / 100
        pm10 = 350 + (aqi - 300) * 80 / 100
    else:
        pm25 = 250 + (aqi - 400) * 250 / 100
        pm10 = 430 + (aqi - 400) * 170 / 100
    
    return pm25, pm10

# Fill missing PM2.5 and PM10 values
for idx, row in df_combined.iterrows():
    if pd.isna(row['PM2.5']) or pd.isna(row['PM10']):
        if pd.notna(row['AQI']):
            pm25, pm10 = estimate_pm_from_aqi(row['AQI'])
            if pd.isna(row['PM2.5']):
                df_combined.at[idx, 'PM2.5'] = pm25
            if pd.isna(row['PM10']):
                df_combined.at[idx, 'PM10'] = pm10

# Save combined dataset
df_combined.to_csv('dataset_extracted/combined_delhi_data_2015_2025.csv', index=False)
print(f"  ✓ Saved to dataset_extracted/combined_delhi_data_2015_2025.csv")

# Create a clean version for training (remove rows with missing PM values)
df_clean = df_combined.dropna(subset=['PM2.5', 'PM10'])
df_clean = df_clean[df_clean['PM2.5'] < 999]
df_clean = df_clean[df_clean['PM10'] < 999]

df_clean.to_csv('dataset_extracted/training_data_clean.csv', index=False)
print(f"  ✓ Saved clean training data: {len(df_clean)} records")

# ============================================================================
# Summary Statistics
# ============================================================================

print("\n" + "="*80)
print("DATA PROCESSING COMPLETE!")
print("="*80)

print(f"\nDataset Summary:")
print(f"  Total records: {len(df_combined):,}")
print(f"  Clean records (with PM2.5 & PM10): {len(df_clean):,}")
print(f"  Date range: {df_combined['Date'].min()} to {df_combined['Date'].max()}")
print(f"  Years covered: {df_combined['year'].min()}-{df_combined['year'].max()}")

print(f"\nRecords by year:")
year_counts = df_combined['year'].value_counts().sort_index()
for year, count in year_counts.items():
    print(f"  {year}: {count:,} records")

print(f"\nRecords by source:")
source_counts = df_combined['Source'].value_counts()
for source, count in source_counts.items():
    print(f"  {source}: {count:,} records")

print(f"\nData quality:")
print(f"  Records with AQI: {df_combined['AQI'].notna().sum():,}")
print(f"  Records with PM2.5: {df_combined['PM2.5'].notna().sum():,}")
print(f"  Records with PM10: {df_combined['PM10'].notna().sum():,}")

print(f"\nAQI Statistics:")
print(f"  Mean AQI: {df_combined['AQI'].mean():.1f}")
print(f"  Median AQI: {df_combined['AQI'].median():.1f}")
print(f"  Min AQI: {df_combined['AQI'].min():.1f}")
print(f"  Max AQI: {df_combined['AQI'].max():.1f}")

print(f"\n" + "="*80)
print("Next Steps:")
print("  1. Review: dataset_extracted/combined_delhi_data_2015_2025.csv")
print("  2. Train: python train_advanced.py")
print("  3. Expected accuracy: 70-75% (with {len(df_clean):,} samples)")
print("="*80)
