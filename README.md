<div align="center">

# 🌬️ Breath-Analyzer (Vayu Drishti)
**AI-Powered Spatial AQI Interpolation for Micro-climate Prediction**

[![Vayu Drishti Banner](https://img.shields.io/badge/Vayu%20Drishti-AI%20Spatial%20AQI%20Interpolation-brightgreen?style=for-the-badge)](https://github.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)](https://pytorch.org/) 
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

*Accurately predict PM2.5 concentrations across Delhi using a custom PyTorch Deep Neural Network.*

</div>

---

## 📌 Executive Summary

**Vayu Drishti** is an advanced AI intelligence layer that brings spatial interpolation to Air Quality measurements. Rather than relying solely on sparsely distributed hardware sensors, it utilizes a custom PyTorch Deep Neural Network (`TemporalSpatialNet`) to extrapolate pollutant metrics precisely for unmonitored locations. By analyzing the non-linear relationship between geographic coordinates and chemical data sourced from nearby Central Pollution Control Board (CPCB) stations, Vayu Drishti accurately predicts PM2.5 levels down to the micro-climate scale.

## 🚀 Key Features

- **🧠 Deep Learning Engine:** Employs a fully-connected Neural Net utilizing Batch Normalization, Dropout, and SiLU (Swish) activations for robust non-linear regression.
- **📍 Micro-climate Interpolation:** Predicts localized PM2.5 concentrations in urban dead zones accurately.
- **🧬 Multivariate Analytics:** Processes 7 independent variables:
  - **Spatial Data:** Latitude, Longitude, Distance from Base Center.
  - **Chemical Data:** SO2, NO2, PM10, and CO (ppb) measurements.
- **⚙️ Automated Data Pipeline:** Automatically cleanses datasets by handling missing values, scaling anomalies, and rejecting hardware failure artifacts (>500 µg/m³ PM2.5).
- **🎯 Highly Tuned Loss Metric:** Utilizes Huber Loss (delta=10.0) mapping to address heavily skewed real-world air pollution distributions gracefully.

## 📂 Project Architecture

```text
Breath-Analyzser/
├── backend/
│   ├── train_vayu_v2.py                 # Core Neural Network Definition & Model Training routines
│   └── dataset_extracted/               # (Expected) Directory for training Datasets
│       ├── delhi_aqi.csv                # Kaggle/CPCB Delhi AQI target dataset 
│       └── final_dataset.csv            # Multi-station historical data
└── README.md                            # Comprehensive project documentation
```

> **Note:** Due to GitHub size constraints, `.csv` datasets and cached build artifacts have been purposefully excluded from this repository.

## 🛠️ Environment Setup

Ensure you have **Python 3.8+** installed before proceeding.

1. **Install Dependencies:**
   ```bash
   pip install torch numpy pandas scikit-learn
   ```
2. *(Optional)* **GPU Acceleration:** `train_vayu_v2.py` automatically detects hardware and routes tensor operations to CUDA/GPU architectures if available (ideal for Google Colab/RTX instances).

## 📊 Dataset Ingestion

To train the model natively, provision the dataset files inside `backend/dataset_extracted/`:

1. `delhi_aqi.csv`
2. `final_dataset.csv`

The data ingestion pipeline provides fallbacks, gracefully handling common dataset variations.

## ⚙️ Model Training & Execution

Initiate model training through the backend working directory:

```bash
cd backend
python train_vayu_v2.py
```

### 📦 Artifacts Generated:
- `vayu_spatial_PRODUCTION.pt`: The compiled and tuned PyTorch model weights state dictionary.
- `vayu_scaler.pkl`: The feature standard scaler required during the real-time inference pipeline to match standardized inputs.

## 🧠 Neural Architecture Details

**TemporalSpatialNet Topology:**
- **Input Layer:** 7 Source Nodes 
- **Hidden Layer 1:** 256 Nodes → `BatchNorm1d` → `SiLU` → `Dropout(0.25)`
- **Hidden Layer 2:** 128 Nodes → `BatchNorm1d` → `SiLU` → `Dropout(0.15)`
- **Hidden Layer 3:** 64 Nodes → `SiLU`
- **Output Layer:** 1 Regression Node (Predicted PM2.5 in µg/m³)

## 🤝 Validation & Benchmarking

The system automatically extracts an `85/15` Training-to-Validation split dynamic subset during pipeline execution. Real vs. Predicted PM2.5 scores are actively visualized in terminal output post-training for rapid regression validation. 

<div align="center">
  <i>Built to democratize clean air transparency.</i>
</div>
