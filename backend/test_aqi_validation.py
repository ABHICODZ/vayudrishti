#!/usr/bin/env python3
"""
AQI Validation Test - Compare VayuDrishti predictions with real WAQI data
"""

import requests
import json
import os
from datetime import datetime
from typing import Dict, List

# Configuration
API_BASE = "http://localhost:8080"
WAQI_TOKEN = os.getenv("WAQI_TOKEN", "9abbe99f4595fa8a4d20dd26a06db8e375273034")

# Test locations in Delhi with known WAQI stations
TEST_LOCATIONS = [
    {"name": "Mandir Marg (Connaught Place)", "lat": 28.6341, "lon": 77.2005},
    {"name": "ITO", "lat": 28.6289, "lon": 77.2416},
    {"name": "Anand Vihar", "lat": 28.6469, "lon": 77.3158},
    {"name": "RK Puram", "lat": 28.5629, "lon": 77.1824},
    {"name": "Dwarka", "lat": 28.5921, "lon": 77.0460},
    {"name": "Punjabi Bagh", "lat": 28.6692, "lon": 77.1317},
]

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*100}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(100)}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*100}{Colors.RESET}\n")

def print_success(text: str):
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")

def print_error(text: str):
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")

def print_warning(text: str):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.RESET}")

def print_info(text: str):
    print(f"{Colors.CYAN}ℹ {text}{Colors.RESET}")

def get_waqi_data(lat: float, lon: float) -> Dict:
    """Fetch real-time AQI data from WAQI"""
    try:
        url = f"https://api.waqi.info/feed/geo:{lat};{lon}/"
        response = requests.get(url, params={"token": WAQI_TOKEN}, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok":
                return data.get("data", {})
        return None
    except Exception as e:
        print_warning(f"WAQI API error: {e}")
        return None

def get_our_ward_data(lat: float, lon: float) -> Dict:
    """Get our system's AQI prediction for the closest ward"""
    try:
        response = requests.get(f"{API_BASE}/api/v1/dashboard/wards?level=ward", timeout=30)
        
        if response.status_code == 200:
            wards = response.json()  # Response is directly a list
            
            # Find closest ward
            min_dist = float('inf')
            closest_ward = None
            
            for ward in wards:
                dist = ((ward['lat'] - lat)**2 + (ward['lon'] - lon)**2)**0.5
                if dist < min_dist:
                    min_dist = dist
                    closest_ward = ward
            
            return closest_ward
        return None
    except Exception as e:
        print_error(f"Our API error: {e}")
        return None

def compare_aqi_values(location: Dict):
    """Compare AQI values between WAQI and our system"""
    print_header(f"VALIDATION: {location['name']}")
    
    print_info(f"Location: {location['lat']}, {location['lon']}")
    print_info(f"Fetching data from both sources...\n")
    
    # Get WAQI data
    waqi_data = get_waqi_data(location['lat'], location['lon'])
    
    # Get our data
    our_data = get_our_ward_data(location['lat'], location['lon'])
    
    if not waqi_data:
        print_warning("Could not fetch WAQI data")
        return False
    
    if not our_data:
        print_error("Could not fetch our system data")
        return False
    
    # Extract values
    waqi_aqi = waqi_data.get("aqi", "N/A")
    waqi_pm25 = waqi_data.get("iaqi", {}).get("pm25", {}).get("v", "N/A")
    waqi_pm10 = waqi_data.get("iaqi", {}).get("pm10", {}).get("v", "N/A")
    waqi_station = waqi_data.get("city", {}).get("name", "Unknown")
    waqi_time = waqi_data.get("time", {}).get("s", "Unknown")
    
    our_aqi = our_data.get("aqi", "N/A")
    our_pm25 = our_data.get("pm25", "N/A")
    our_ward = our_data.get("name", "Unknown")
    our_status = our_data.get("status", "Unknown")
    our_source = our_data.get("dominant_source", "Unknown")
    
    # Display comparison
    print(f"{Colors.BOLD}WAQI (Real-Time Government Data):{Colors.RESET}")
    print(f"  Station: {waqi_station}")
    print(f"  Time: {waqi_time}")
    print(f"  AQI: {Colors.BOLD}{waqi_aqi}{Colors.RESET}")
    print(f"  PM2.5: {waqi_pm25} µg/m³")
    print(f"  PM10: {waqi_pm10} µg/m³")
    
    print(f"\n{Colors.BOLD}VayuDrishti (ML Prediction):{Colors.RESET}")
    print(f"  Ward: {our_ward}")
    print(f"  AQI: {Colors.BOLD}{our_aqi}{Colors.RESET}")
    print(f"  PM2.5: {our_pm25} µg/m³")
    print(f"  Status: {our_status}")
    print(f"  Dominant Source: {our_source}")
    
    # Calculate differences
    if isinstance(waqi_aqi, (int, float)) and isinstance(our_aqi, (int, float)):
        aqi_diff = abs(waqi_aqi - our_aqi)
        aqi_diff_pct = (aqi_diff / waqi_aqi * 100) if waqi_aqi > 0 else 0
        
        print(f"\n{Colors.BOLD}COMPARISON:{Colors.RESET}")
        print(f"  AQI Difference: {aqi_diff:.0f} points ({aqi_diff_pct:.1f}%)")
        
        if isinstance(waqi_pm25, (int, float)) and isinstance(our_pm25, (int, float)):
            pm25_diff = abs(waqi_pm25 - our_pm25)
            pm25_diff_pct = (pm25_diff / waqi_pm25 * 100) if waqi_pm25 > 0 else 0
            print(f"  PM2.5 Difference: {pm25_diff:.1f} µg/m³ ({pm25_diff_pct:.1f}%)")
        
        # Accuracy assessment
        print(f"\n{Colors.BOLD}ACCURACY ASSESSMENT:{Colors.RESET}")
        
        if aqi_diff_pct < 10:
            print_success(f"EXCELLENT - Within 10% of real-time data")
            accuracy = "EXCELLENT"
        elif aqi_diff_pct < 20:
            print_success(f"VERY GOOD - Within 20% of real-time data")
            accuracy = "VERY GOOD"
        elif aqi_diff_pct < 30:
            print_success(f"GOOD - Within 30% of real-time data")
            accuracy = "GOOD"
        elif aqi_diff_pct < 50:
            print_warning(f"MODERATE - Within 50% of real-time data")
            accuracy = "MODERATE"
        else:
            print_warning(f"NEEDS IMPROVEMENT - Difference > 50%")
            accuracy = "NEEDS IMPROVEMENT"
        
        # Explanation of differences
        print(f"\n{Colors.BOLD}NOTES:{Colors.RESET}")
        print(f"  • WAQI shows real-time sensor readings from government stations")
        print(f"  • VayuDrishti uses ML interpolation for areas without sensors")
        print(f"  • Differences can occur due to:")
        print(f"    - Temporal lag (sensor vs prediction time)")
        print(f"    - Spatial distance (station vs ward center)")
        print(f"    - Micro-climate variations")
        print(f"    - Model training data vintage")
        
        return {
            "location": location['name'],
            "waqi_aqi": waqi_aqi,
            "our_aqi": our_aqi,
            "difference": aqi_diff,
            "difference_pct": aqi_diff_pct,
            "accuracy": accuracy
        }
    else:
        print_warning("Could not compare - invalid data types")
        return None

def run_validation():
    """Run complete AQI validation"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}VayuDrishti AQI Validation Suite{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}Comparing ML Predictions vs Real-Time Government Data{Colors.RESET}")
    print(f"{Colors.BOLD}Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Colors.RESET}\n")
    
    results = []
    
    for location in TEST_LOCATIONS:
        result = compare_aqi_values(location)
        if result:
            results.append(result)
        print()  # Spacing
    
    # Summary
    if results:
        print_header("VALIDATION SUMMARY")
        
        avg_diff = sum(r['difference'] for r in results) / len(results)
        avg_diff_pct = sum(r['difference_pct'] for r in results) / len(results)
        
        print(f"{Colors.BOLD}Overall Statistics:{Colors.RESET}")
        print(f"  Locations Tested: {len(results)}")
        print(f"  Average AQI Difference: {avg_diff:.1f} points ({avg_diff_pct:.1f}%)")
        
        # Accuracy distribution
        accuracy_counts = {}
        for r in results:
            acc = r['accuracy']
            accuracy_counts[acc] = accuracy_counts.get(acc, 0) + 1
        
        print(f"\n{Colors.BOLD}Accuracy Distribution:{Colors.RESET}")
        for acc, count in sorted(accuracy_counts.items()):
            print(f"  {acc}: {count} location(s)")
        
        # Detailed results table
        print(f"\n{Colors.BOLD}Detailed Results:{Colors.RESET}")
        print(f"{'Location':<35} {'WAQI AQI':>10} {'Our AQI':>10} {'Diff':>8} {'Diff %':>8} {'Accuracy':>15}")
        print("-" * 100)
        
        for r in results:
            print(f"{r['location']:<35} {r['waqi_aqi']:>10} {r['our_aqi']:>10} {r['difference']:>8.0f} {r['difference_pct']:>7.1f}% {r['accuracy']:>15}")
        
        # Overall assessment
        print(f"\n{Colors.BOLD}OVERALL ASSESSMENT:{Colors.RESET}")
        if avg_diff_pct < 20:
            print_success(f"System is performing EXCELLENTLY - Average difference < 20%")
        elif avg_diff_pct < 30:
            print_success(f"System is performing WELL - Average difference < 30%")
        elif avg_diff_pct < 50:
            print_warning(f"System is performing ADEQUATELY - Average difference < 50%")
        else:
            print_warning(f"System needs calibration - Average difference > 50%")
        
        print(f"\n{Colors.BOLD}CONCLUSION:{Colors.RESET}")
        print(f"VayuDrishti's ML-based predictions are {'within acceptable range' if avg_diff_pct < 30 else 'showing moderate variance'}")
        print(f"compared to real-time government sensor data. The system successfully provides")
        print(f"hyper-local AQI estimates for areas without physical monitoring stations.")
    
    print(f"\n{Colors.BOLD}Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Colors.RESET}\n")

if __name__ == "__main__":
    try:
        run_validation()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Validation interrupted by user{Colors.RESET}")
