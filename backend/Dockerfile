# VayuDrishti Backend — Cloud Run Optimized Dockerfile
# Uses a slim requirements file without PyTorch (ml_engine falls back to physics IDW)
# Full torch support can be enabled by mounting a GPU instance separately.

# Stage 1: Builder
FROM python:3.11-slim as builder

# Install system dependencies for geospatial libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    curl \
    libgdal-dev \
    gdal-bin \
    libgeos-dev \
    libproj-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements and install — skip torch (too large for Cloud Run default tier)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    grep -v "^torch" requirements.txt | \
    grep -v "^torchvision" | \
    grep -v "^torchaudio" | \
    grep -v "^torch-geometric" | \
    pip install --no-cache-dir -r /dev/stdin

# Stage 2: Runtime
FROM python:3.11-slim

# Install only runtime system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libgdal32 \
    libgeos-c1v5 \
    libproj25 \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Set environment variables
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app \
    PORT=8080

# Set working directory
WORKDIR /app

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Run FastAPI with Uvicorn (single worker for Cloud Run)
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1
