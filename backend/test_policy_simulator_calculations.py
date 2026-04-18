"""
Test Policy Simulator Calculations
Validates that the mathematical model produces correct results
"""

import sys
sys.path.insert(0, '.')

from app.services.policy_engine import PolicySimulator

def test_basic_calculation():
    """Test 1: Basic calculation with known inputs"""
    print("\n" + "="*60)
    print("TEST 1: Basic Calculation")
    print("="*60)
    
    # Test case: 350 AQI, 50% traffic, 30% industry, construction ban, 7 days
    result = PolicySimulator.simulate(
        current_aqi=350.0,
        traffic_reduction=50.0,
        industrial_reduction=30.0,
        construction_ban=True,
        duration=7
    )
    
    print(f"\nInput:")
    print(f"  Current AQI: 350")
    print(f"  Traffic Reduction: 50%")
    print(f"  Industrial Reduction: 30%")
    print(f"  Construction Ban: Yes")
    print(f"  Duration: 7 days")
    
    print(f"\nOutput:")
    print(f"  Predicted AQI: {result.predicted_aqi}")
    print(f"  AQI Reduction: {result.aqi_reduction}")
    print(f"  Percent Change: {result.percent_change}%")
    print(f"  Confidence: {result.confidence * 100}%")
    
    print(f"\nBreakdown:")
    for key, value in result.breakdown.items():
        print(f"  {key}: {value}%")
    
    # Manual calculation to verify
    # Traffic: 0.23 * 0.5 * 0.85 = 0.09775 (9.775%)
    # Industry: 0.09 * 0.3 * 0.70 = 0.0189 (1.89%)
    # Construction: 0.15 * 1.0 * 0.60 = 0.09 (9%)
    # Total: 20.665%
    # New AQI: 350 * (1 - 0.20665) = 277.67
    
    expected_traffic = 0.23 * 0.5 * 0.85 * 100  # 9.775%
    expected_industry = 0.09 * 0.3 * 0.70 * 100  # 1.89%
    expected_construction = 0.15 * 1.0 * 0.60 * 100  # 9%
    expected_total = expected_traffic + expected_industry + expected_construction  # 20.665%
    expected_aqi = 350 * (1 - expected_total / 100)  # 277.67
    
    print(f"\nExpected Calculations:")
    print(f"  Traffic Impact: {expected_traffic:.2f}%")
    print(f"  Industry Impact: {expected_industry:.2f}%")
    print(f"  Construction Impact: {expected_construction:.2f}%")
    print(f"  Total Reduction: {expected_total:.2f}%")
    print(f"  Expected AQI: {expected_aqi:.2f}")
    
    # Verify
    assert abs(result.breakdown['transport_impact'] - expected_traffic) < 0.1, "Traffic calculation mismatch"
    assert abs(result.breakdown['industrial_impact'] - expected_industry) < 0.1, "Industry calculation mismatch"
    assert abs(result.breakdown['construction_impact'] - expected_construction) < 0.1, "Construction calculation mismatch"
    assert abs(result.predicted_aqi - expected_aqi) < 1.0, "AQI calculation mismatch"
    
    print(f"\n✅ TEST 1 PASSED: Calculations are correct!")
    return result


def test_no_intervention():
    """Test 2: No intervention (0% reductions)"""
    print("\n" + "="*60)
    print("TEST 2: No Intervention")
    print("="*60)
    
    result = PolicySimulator.simulate(
        current_aqi=300.0,
        traffic_reduction=0.0,
        industrial_reduction=0.0,
        construction_ban=False,
        duration=7
    )
    
    print(f"\nInput: No interventions")
    print(f"  Current AQI: 300")
    print(f"\nOutput:")
    print(f"  Predicted AQI: {result.predicted_aqi}")
    print(f"  AQI Reduction: {result.aqi_reduction}")
    
    # With no intervention, AQI should remain the same
    assert result.predicted_aqi == 300.0, "No intervention should not change AQI"
    assert result.aqi_reduction == 0.0, "No reduction expected"
    
    print(f"\n✅ TEST 2 PASSED: No intervention = no change")
    return result


def test_maximum_intervention():
    """Test 3: Maximum intervention (100% reductions)"""
    print("\n" + "="*60)
    print("TEST 3: Maximum Intervention")
    print("="*60)
    
    result = PolicySimulator.simulate(
        current_aqi=400.0,
        traffic_reduction=100.0,
        industrial_reduction=100.0,
        construction_ban=True,
        duration=7
    )
    
    print(f"\nInput: Maximum interventions")
    print(f"  Current AQI: 400")
    print(f"  Traffic Reduction: 100%")
    print(f"  Industrial Reduction: 100%")
    print(f"  Construction Ban: Yes")
    
    print(f"\nOutput:")
    print(f"  Predicted AQI: {result.predicted_aqi}")
    print(f"  AQI Reduction: {result.aqi_reduction}")
    print(f"  Percent Change: {result.percent_change}%")
    
    # Maximum reduction:
    # Traffic: 0.23 * 1.0 * 0.85 = 0.1955 (19.55%)
    # Industry: 0.09 * 1.0 * 0.70 = 0.063 (6.3%)
    # Construction: 0.15 * 1.0 * 0.60 = 0.09 (9%)
    # Total: 34.85%
    # New AQI: 400 * (1 - 0.3485) = 260.6
    
    expected_total = (0.23 * 1.0 * 0.85 + 0.09 * 1.0 * 0.70 + 0.15 * 1.0 * 0.60) * 100
    expected_aqi = 400 * (1 - expected_total / 100)
    
    print(f"\nExpected:")
    print(f"  Total Reduction: {expected_total:.2f}%")
    print(f"  Expected AQI: {expected_aqi:.2f}")
    
    assert abs(result.predicted_aqi - expected_aqi) < 1.0, "Maximum intervention calculation mismatch"
    
    print(f"\n✅ TEST 3 PASSED: Maximum intervention works correctly")
    return result


def test_traffic_only():
    """Test 4: Traffic reduction only"""
    print("\n" + "="*60)
    print("TEST 4: Traffic Reduction Only")
    print("="*60)
    
    result = PolicySimulator.simulate(
        current_aqi=350.0,
        traffic_reduction=60.0,
        industrial_reduction=0.0,
        construction_ban=False,
        duration=7
    )
    
    print(f"\nInput:")
    print(f"  Current AQI: 350")
    print(f"  Traffic Reduction: 60%")
    print(f"  Other interventions: None")
    
    print(f"\nOutput:")
    print(f"  Predicted AQI: {result.predicted_aqi}")
    print(f"  AQI Reduction: {result.aqi_reduction}")
    
    # Traffic only: 0.23 * 0.6 * 0.85 = 0.1173 (11.73%)
    expected_reduction = 0.23 * 0.6 * 0.85 * 100
    expected_aqi = 350 * (1 - expected_reduction / 100)
    
    print(f"\nExpected:")
    print(f"  Traffic Impact: {expected_reduction:.2f}%")
    print(f"  Expected AQI: {expected_aqi:.2f}")
    
    assert abs(result.breakdown['transport_impact'] - expected_reduction) < 0.1, "Traffic-only calculation mismatch"
    assert result.breakdown['industrial_impact'] == 0.0, "Industry should be 0"
    assert result.breakdown['construction_impact'] == 0.0, "Construction should be 0"
    
    print(f"\n✅ TEST 4 PASSED: Traffic-only intervention works")
    return result


def test_cost_calculation():
    """Test 5: Cost calculation"""
    print("\n" + "="*60)
    print("TEST 5: Cost Calculation")
    print("="*60)
    
    result = PolicySimulator.simulate(
        current_aqi=350.0,
        traffic_reduction=50.0,
        industrial_reduction=30.0,
        construction_ban=True,
        duration=7
    )
    
    print(f"\nInput:")
    print(f"  Traffic Reduction: 50%")
    print(f"  Industrial Reduction: 30%")
    print(f"  Construction Ban: Yes")
    print(f"  Duration: 7 days")
    
    print(f"\nOutput:")
    print(f"  Estimated Cost: ₹{result.estimated_cost / 100000:.2f} Lakhs")
    print(f"  Health Benefit: {result.health_benefit} lives saved")
    
    # Cost calculation:
    # Traffic: 50 * 50000 * 7 = 17,500,000
    # Industry: 30 * 120000 * 7 = 25,200,000
    # Construction: 200000 * 7 = 1,400,000
    # Total: 44,100,000 (44.1 Lakhs)
    
    expected_traffic_cost = 50 * 50000 * 7
    expected_industry_cost = 30 * 120000 * 7
    expected_construction_cost = 200000 * 7
    expected_total_cost = expected_traffic_cost + expected_industry_cost + expected_construction_cost
    
    print(f"\nExpected Cost Breakdown:")
    print(f"  Traffic: ₹{expected_traffic_cost / 100000:.2f} Lakhs")
    print(f"  Industry: ₹{expected_industry_cost / 100000:.2f} Lakhs")
    print(f"  Construction: ₹{expected_construction_cost / 100000:.2f} Lakhs")
    print(f"  Total: ₹{expected_total_cost / 100000:.2f} Lakhs")
    
    assert abs(result.estimated_cost - expected_total_cost) < 1000, "Cost calculation mismatch"
    
    print(f"\n✅ TEST 5 PASSED: Cost calculation is correct")
    return result


def test_health_benefit():
    """Test 6: Health benefit calculation"""
    print("\n" + "="*60)
    print("TEST 6: Health Benefit Calculation")
    print("="*60)
    
    result = PolicySimulator.simulate(
        current_aqi=400.0,
        traffic_reduction=80.0,
        industrial_reduction=70.0,
        construction_ban=True,
        duration=14
    )
    
    print(f"\nInput:")
    print(f"  Current AQI: 400")
    print(f"  Strong interventions")
    print(f"  Duration: 14 days")
    
    print(f"\nOutput:")
    print(f"  AQI Reduction: {result.aqi_reduction}")
    print(f"  Health Benefit: {result.health_benefit} lives saved")
    
    # Health benefit: aqi_reduction * 1000 * 30 (Delhi NCR population in millions)
    expected_health = int(result.aqi_reduction * 1000 * 30)
    
    print(f"\nExpected Health Benefit: {expected_health} lives")
    
    assert abs(result.health_benefit - expected_health) < 100, "Health benefit calculation mismatch"
    
    print(f"\n✅ TEST 6 PASSED: Health benefit calculation is correct")
    return result


def test_confidence_score():
    """Test 7: Confidence score calculation"""
    print("\n" + "="*60)
    print("TEST 7: Confidence Score")
    print("="*60)
    
    # Test with strong intervention (should have higher confidence)
    result_strong = PolicySimulator.simulate(
        current_aqi=350.0,
        traffic_reduction=80.0,
        industrial_reduction=70.0,
        construction_ban=True,
        duration=7
    )
    
    # Test with weak intervention (should have lower confidence)
    result_weak = PolicySimulator.simulate(
        current_aqi=350.0,
        traffic_reduction=10.0,
        industrial_reduction=5.0,
        construction_ban=False,
        duration=7
    )
    
    print(f"\nStrong Intervention:")
    print(f"  Confidence: {result_strong.confidence * 100:.1f}%")
    
    print(f"\nWeak Intervention:")
    print(f"  Confidence: {result_weak.confidence * 100:.1f}%")
    
    assert result_strong.confidence > result_weak.confidence, "Strong intervention should have higher confidence"
    assert 0.75 <= result_strong.confidence <= 0.95, "Confidence should be in valid range"
    
    print(f"\n✅ TEST 7 PASSED: Confidence scoring works correctly")
    return result_strong, result_weak


def test_edge_cases():
    """Test 8: Edge cases"""
    print("\n" + "="*60)
    print("TEST 8: Edge Cases")
    print("="*60)
    
    # Test with very low AQI
    result_low = PolicySimulator.simulate(
        current_aqi=50.0,
        traffic_reduction=100.0,
        industrial_reduction=100.0,
        construction_ban=True,
        duration=7
    )
    
    print(f"\nLow AQI Test:")
    print(f"  Input AQI: 50")
    print(f"  Predicted AQI: {result_low.predicted_aqi}")
    print(f"  Note: AQI should not go below 20 (background pollution)")
    
    assert result_low.predicted_aqi >= 20.0, "AQI should not go below 20"
    
    # Test with very high AQI
    result_high = PolicySimulator.simulate(
        current_aqi=999.0,
        traffic_reduction=50.0,
        industrial_reduction=30.0,
        construction_ban=True,
        duration=7
    )
    
    print(f"\nHigh AQI Test:")
    print(f"  Input AQI: 999")
    print(f"  Predicted AQI: {result_high.predicted_aqi}")
    
    assert result_high.predicted_aqi < 999.0, "AQI should be reduced"
    
    print(f"\n✅ TEST 8 PASSED: Edge cases handled correctly")
    return result_low, result_high


def run_all_tests():
    """Run all tests"""
    print("\n" + "="*60)
    print("POLICY SIMULATOR CALCULATION TESTS")
    print("="*60)
    print("\nTesting the mathematical model based on CPCB data")
    print("Formula: AQI_new = AQI_base × (1 - Σ(C_i × R_i × E_i))")
    
    try:
        test_basic_calculation()
        test_no_intervention()
        test_maximum_intervention()
        test_traffic_only()
        test_cost_calculation()
        test_health_benefit()
        test_confidence_score()
        test_edge_cases()
        
        print("\n" + "="*60)
        print("ALL TESTS PASSED! ✅")
        print("="*60)
        print("\nThe Policy Simulator calculations are mathematically correct.")
        print("The model uses:")
        print("  - CPCB Source Apportionment data")
        print("  - Sector contribution factors (Transport: 23%, Industry: 9%, Dust: 15%)")
        print("  - Efficiency coefficients (Transport: 85%, Industry: 70%, Dust: 60%)")
        print("  - Cost estimation based on intervention type and duration")
        print("  - Health benefit calculation (lives saved)")
        print("  - Confidence scoring based on intervention strength")
        
        return True
        
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
