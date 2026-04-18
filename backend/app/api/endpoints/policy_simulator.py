"""
Policy Simulator API Endpoints
Mathematical model-based policy simulation for Digital Twin
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.services.policy_engine import PolicySimulator, PolicySimulationRequest, PolicySimulationResult

router = APIRouter()


@router.post("/simulate", response_model=PolicySimulationResult)
async def simulate_policy(
    request: PolicySimulationRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Run policy simulation using mathematical model
    
    This endpoint uses a scientifically validated sector-weighting formula
    based on CPCB Source Apportionment data instead of LLM predictions.
    
    Formula: AQI_new = AQI_base × (1 - Σ(C_i × R_i × E_i))
    
    Args:
        request: PolicySimulationRequest with simulation parameters
        
    Returns:
        PolicySimulationResult with predicted outcomes
    """
    try:
        # Validate inputs
        if request.current_aqi < 0 or request.current_aqi > 999:
            raise HTTPException(status_code=400, detail="Invalid AQI value (must be 0-999)")
        
        if not (0 <= request.traffic_reduction <= 100):
            raise HTTPException(status_code=400, detail="Traffic reduction must be 0-100%")
        
        if not (0 <= request.industrial_reduction <= 100):
            raise HTTPException(status_code=400, detail="Industrial reduction must be 0-100%")
        
        if request.duration < 1 or request.duration > 365:
            raise HTTPException(status_code=400, detail="Duration must be 1-365 days")
        
        # Run simulation
        result = PolicySimulator.simulate(
            current_aqi=request.current_aqi,
            traffic_reduction=request.traffic_reduction,
            industrial_reduction=request.industrial_reduction,
            construction_ban=request.construction_ban,
            duration=request.duration
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


@router.get("/grap-presets")
async def get_grap_presets(
    current_user: dict = Depends(get_current_user)
) -> Dict[str, Dict]:
    """
    Get GRAP (Graded Response Action Plan) preset scenarios
    
    Returns preset parameters for Delhi's official GRAP stages I-IV
    """
    return {
        "stage_1": PolicySimulator.get_grap_preset("I"),
        "stage_2": PolicySimulator.get_grap_preset("II"),
        "stage_3": PolicySimulator.get_grap_preset("III"),
        "stage_4": PolicySimulator.get_grap_preset("IV")
    }


@router.get("/sector-contributions")
async def get_sector_contributions(
    current_user: dict = Depends(get_current_user)
) -> Dict[str, float]:
    """
    Get source apportionment data (sector contribution factors)
    
    Returns the scientifically validated contribution of each sector
    to total air pollution based on CPCB studies
    """
    return {
        "contributions": PolicySimulator.SECTOR_CONTRIBUTIONS,
        "efficiency_coefficients": PolicySimulator.EFFICIENCY,
        "source": "CPCB/CAQM Delhi Source Apportionment Study 2024-2026",
        "note": "Background pollution (33%) is immutable and represents regional/natural sources"
    }


@router.post("/batch-simulate")
async def batch_simulate_policies(
    scenarios: List[PolicySimulationRequest],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> List[PolicySimulationResult]:
    """
    Run multiple policy simulations in batch
    
    Useful for comparing different policy scenarios side-by-side
    
    Args:
        scenarios: List of PolicySimulationRequest objects
        
    Returns:
        List of PolicySimulationResult objects
    """
    if len(scenarios) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 scenarios per batch")
    
    results = []
    for scenario in scenarios:
        try:
            result = PolicySimulator.simulate(
                current_aqi=scenario.current_aqi,
                traffic_reduction=scenario.traffic_reduction,
                industrial_reduction=scenario.industrial_reduction,
                construction_ban=scenario.construction_ban,
                duration=scenario.duration
            )
            results.append(result)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Batch simulation error: {str(e)}")
    
    return results
