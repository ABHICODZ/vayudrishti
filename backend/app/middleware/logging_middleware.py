"""
Production-grade logging middleware with request/response tracking.
"""
import time
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import json

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger("vayudrishti")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Logs every request with:
    - Request start/end
    - Processing time
    - Status code
    - Error details (if any)
    """
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next):
        # Generate request ID
        request_id = f"req_{int(time.time() * 1000) % 100000}"
        
        # Log request start
        start_time = time.time()
        logger.info(f"[{request_id}] START {request.method} {request.url.path}")
        
        # Add request ID to state for access in endpoints
        request.state.request_id = request_id
        request.state.start_time = start_time
        
        try:
            response = await call_next(request)
            
            # Calculate processing time
            process_time = int((time.time() - start_time) * 1000)
            
            # Log request completion
            status_emoji = "✓" if response.status_code < 400 else "✗"
            slow_marker = " ⚠ SLOW" if process_time > 5000 else ""
            
            logger.info(
                f"[{request_id}] {status_emoji} {request.method} {request.url.path} "
                f"→ {response.status_code} ({process_time}ms){slow_marker}"
            )
            
            # Add timing headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time-Ms"] = str(process_time)
            
            return response
            
        except Exception as e:
            process_time = int((time.time() - start_time) * 1000)
            logger.error(
                f"[{request_id}] ✗ {request.method} {request.url.path} "
                f"→ ERROR ({process_time}ms): {str(e)}"
            )
            raise


class DataSourceTracker:
    """
    Tracks data sources for transparency.
    """
    
    @staticmethod
    def create_metadata(sources: list, start_time: float, extra: dict = None) -> dict:
        """
        Create standardized metadata for API responses.
        
        Args:
            sources: List of data sources used (e.g., ["waqi", "ml_inference", "supabase"])
            start_time: Request start time (from time.time())
            extra: Additional metadata fields
        
        Returns:
            Metadata dict with timestamp, sources, and processing time
        """
        from datetime import datetime
        
        metadata = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "sources": sources,
            "query_time_ms": int((time.time() - start_time) * 1000)
        }
        
        if extra:
            metadata.update(extra)
        
        return metadata
    
    @staticmethod
    def log_data_fetch(source: str, success: bool, details: str = ""):
        """Log data fetch attempts for debugging."""
        status = "✓" if success else "✗"
        logger.info(f"[DATA] {status} {source} | {details}")
