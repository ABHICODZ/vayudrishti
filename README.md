<div align="center">

# 🌬️ Vayu Drishti
### Hyper-Local AQI Intelligence Platform for Delhi

[![Platform Status](https://img.shields.io/badge/Platform-Live%20%26%20Operational-brightgreen?style=for-the-badge)](https://github.com/ABHICODZ/Breath-Analyzser)
[![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

*Transforming Delhi's sparse sensor grid into a living, ward-level air quality intelligence map.*

</div>

---

## 📌 The Problem We Solve

Delhi's air quality monitoring infrastructure consists of a **handful of CPCB stations** spread across a city of 32 million people spanning 1,484 km². Entire neighborhoods, residential colonies, schools, and industrial zones exist in blind spots — with no real data on the air residents breathe.

**Vayu Drishti eliminates this blind spot entirely.**

Rather than waiting for physical sensor infrastructure to scale, our platform uses a custom-trained AI model to interpolate and predict precise PM2.5 concentrations for *every coordinate* across all *251 wards of Delhi* — in real-time, continuously, at micro-climate resolution.

---

## 🏛️ Platform Architecture

Vayu Drishti is a full-stack, cloud-ready platform with four integrated layers:

```
┌─────────────────────────────────────────────────────────────┐
│                 VAYU DRISHTI PLATFORM                       │
├────────────────┬────────────────┬──────────────┬────────────┤
│  React         │  FastAPI       │  PyTorch     │  Supabase  │
│  Frontend      │  Backend       │  ML Engine   │  Auth & DB │
│  (Vite +       │  (Python +     │  (Temporal   │  (Role     │
│   Leaflet)     │   CORS)        │   SpatialNet)│   Based)   │
└────────────────┴────────────────┴──────────────┴────────────┘
```

### Core Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React + Vite + TypeScript | Interactive spatial AQI map & user interface |
| **Styling** | Tailwind CSS | Responsive, dark-mode UI |
| **Mapping** | Leaflet.js | Real-time, zoomable Delhi ward overlays |
| **Backend API** | FastAPI (Python) | REST API serving live AQI predictions |
| **ML Engine** | PyTorch (`TemporalSpatialNet`) | Spatial interpolation neural network |
| **Authentication** | Supabase Auth + JWT | Role-based access (user / admin / officer) |
| **Database** | Supabase (PostgreSQL) | User profiles, complaints, tasks, session logs |
| **Satellite Data** | Google Earth Engine (Sentinel-5P) | Live atmospheric telemetry feeds |
| **AI Policy Engine** | Google Vertex AI (Gemini) | Auto-generated municipal action directives |
| **Deployment** | Docker + Google Cloud Run | Containerized production environment |

---

## 🚀 Key Features

### 🗺️ 1. Hyper-Local AQI Map
The centerpiece of Vayu Drishti is a live, interactive Leaflet.js map overlaid on all 251 Delhi municipal wards. Instead of showing only the 20-odd hardware stations, the ML engine interpolates predicted PM2.5 values for every unmonitored location on the map — rendering a continuous, color-coded pollution heatmap across the entire city in real-time.

- **Ward-level granularity** — every one of Delhi's 251 wards has an individual prediction.
- **Dynamic color coding** — Green → Satisfactory → Moderate → Poor → Very Poor → Severe.
- **Live refresh** — the backend autonomously runs the TNN inference loop on startup, continuously updating predictions.

### 🧠 2. The AI Model (`TemporalSpatialNet`)
The platform's prediction engine is a custom PyTorch deep neural network trained on real CPCB/Kaggle Delhi AQI datasets. It processes 7 environment variables per location and outputs an accurate PM2.5 value in µg/m³.

**Feature Inputs (7 total):**
- **Spatial:** Latitude, Longitude, Distance from Delhi Centroid
- **Chemical:** SO2, NO2, PM10, CO (ppb) from nearby stations

**Neural Architecture:**
```
Input (7) → Dense(256) → BatchNorm → SiLU → Dropout(0.25)
          → Dense(128) → BatchNorm → SiLU → Dropout(0.15)
          → Dense(64)  → SiLU
          → Output(1)  [PM2.5 µg/m³]
```

**Why this design?**
- **SiLU (Swish)** activation outperforms ReLU on smooth regression over spatial data.
- **Huber Loss (δ=10)** used instead of MSE — prevents pollution spike anomalies from dominating gradients.
- **StandardScaler** normalization ensures chemical feature ranges don't skew distance-based spatial features.

The trained model artifacts (`vayu_spatial_PRODUCTION.pt` + `vayu_scaler.pkl`) are loaded directly by the FastAPI backend for live inference.

### 🛡️ 3. Admin Command Portal (`/admin`)
The platform includes a fully secured, role-gated Admin Portal accessible at `/admin`. Access is controlled via Supabase Role-Based Access Control — only users with `admin` or `officer` roles in the `profiles` table are granted entry.

**Admin Portal Sections:**

| Section | Route | Description |
| :--- | :--- | :--- |
| **Live Monitoring** | `/admin` | Real-time AQI station feeds, model predictions, alert thresholds |
| **Complaints Panel** | `/admin/complaints` | Manage citizen-submitted air quality complaints across wards |
| **Tasks Board** | `/admin/tasks` | Assign & track enforcement tasks to field officers |
| **Policy Hub** | `/admin/reports` | Generate AI-powered policy directives & export reports |

The admin sidebar displays the authenticated officer's role and avatar, links to all panels, and provides a secure one-click logout.

### 🛰️ 4. Satellite Intelligence (Google Earth Engine)
The backend connects live to **Sentinel-5P TROPOMI** atmospheric sensors via the Google Earth Engine Python API. This provides a second source of atmospheric truth — ground-level CPCB data fused with orbital satellite measurements — enabling the model to detect pollution anomalies invisible to sparse ground-station grids.

### 🤖 5. Gemini AI Policy Engine
When PM2.5 breaches critical thresholds, the backend routes current satellite + ground telemetry payloads to **Google Vertex AI (Gemini)**, which generates specific, context-aware municipal action directives — not generic alerts, but prescriptive enforcement recommendations tailored to the exact ward and pollutant combination being flagged.

### 👤 6. User Profile System
Citizens logging in via Supabase authentication have access to a profile page (`/profile`) showing their registered ward, saved AQI history, submitted complaints, and notification preferences.

---

## 📂 Project Structure

```
vaayudrishti/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app factory + CORS + request logging
│   │   ├── api/                     # All REST endpoints
│   │   ├── ml/                      # TNN model loader & inference engine
│   │   ├── services/                # GEE, Gemini AI, WAQI data services
│   │   ├── db/                      # Supabase DB helpers
│   │   └── core/                    # Config, settings, dependencies
│   ├── train_vayu_v2.py             # 🔬 Core ML training script (this repo)
│   ├── vayu_model_v5_best.pt        # Trained model weights (v5)
│   ├── vayu_scaler_v5.pkl           # Feature scaler for production inference
│   └── requirements.txt             # Python dependencies
├── web-frontend/
│   ├── src/
│   │   ├── App.tsx                  # Main map dashboard & AQI visualization
│   │   ├── AppRouter.tsx            # React Router (/, /admin/*, /profile)
│   │   ├── admin/
│   │   │   ├── AdminGate.tsx        # Auth gating + admin sidebar shell
│   │   │   ├── LiveMonitoring.tsx   # Real-time station feeds
│   │   │   ├── ComplaintsPanel.tsx  # Citizen complaint manager
│   │   │   ├── TasksBoard.tsx       # Officer task assignments
│   │   │   └── ReportingPanel.tsx   # Policy hub & reports
│   │   └── pages/
│   │       └── UserProfilePage.tsx  # Citizen profile & history
│   └── package.json
├── supabase_schema.sql              # DB schema for profiles, complaints, tasks
└── README.md
```

---

## 🛠️ Setup & Running Locally

### Prerequisites
- Python 3.9+
- Node.js 18+
- A Supabase project (free tier works)
- (Optional) Google Cloud project for GEE + Vertex AI

### 1. Backend
```bash
cd backend
pip install -r requirements.txt

# Copy and fill in your environment variables
cp .env.example .env

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Key `.env` variables:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
WAQI_TOKEN=your-waqi-api-token
GCP_PROJECT_ID=your-gcp-project
CORS_ORIGINS=http://localhost:5173
```

### 2. Frontend
```bash
cd web-frontend
npm install
npm run dev
# → http://localhost:5173
```

### 3. Admin Portal Access
Navigate to `http://localhost:5173/admin`. You must be logged in with a Supabase account that has `role = 'admin'` or `role = 'officer'` set in the `profiles` table.

---

## 🔬 Training the ML Model

The model training script lives in `backend/train_vayu_v2.py`. To retrain:

```bash
cd backend
# Place datasets in dataset_extracted/
#   - delhi_aqi.csv
#   - final_dataset.csv
python train_vayu_v2.py
```

**Outputs:**
- `vayu_spatial_PRODUCTION.pt` — model weights (copy to `backend/app/services/`)
- `vayu_scaler.pkl` — feature scaler for live inference

---

## 📊 Model Performance

| Metric | Value |
| :--- | :--- |
| Training split | 85% train / 15% validation |
| Epochs | 150 |
| Optimizer | AdamW (lr=1e-3, wd=1e-4) |
| Scheduler | CosineAnnealingLR |
| Loss Function | HuberLoss (δ=10.0) |
| Best Val Loss | ~4.0 |
| MAE (approx.) | ~4.2 µg/m³ |

---

<div align="center">
  <strong>Built to give every citizen of Delhi the right to breathe transparently.</strong><br/>
  <i>One ward at a time.</i>
</div>
