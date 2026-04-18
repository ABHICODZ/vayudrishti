<div align="center">

# 🌬️ Breath-Analyzer (Vayu Drishti)
**Hyper-Local AQI Interpolation & Micro-Climate Prediction Platform**

[![Vayu Drishti Banner](https://img.shields.io/badge/Vayu%20Drishti-AI%20Spatial%20AQI%20Interpolation-brightgreen?style=for-the-badge)](https://github.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)](https://pytorch.org/) 
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

*Transforming sparse pollution data into highly accurate, ward-level PM2.5 visualizations across Delhi.*

</div>

---

## 📌 Executive Summary

**Vayu Drishti** is an advanced AI-powered platform designed to provide accurate, hyper-local Air Quality Index (AQI) intelligence. Delhi's vast geographical expanse comprises numerous distinct wards, and traditional monitoring systems rely on a limited number of physical hardware stations. This physical limitation makes it impossible to know the true, localized air quality for the vast majority of citizens.

Vayu Drishti solves this critical gap. Our platform leverages a custom Deep Neural Network (`TemporalSpatialNet`) built in PyTorch to continuously interpolate and extrapolate precise PM2.5 metrics for any geographical coordinate. By analyzing the complex, non-linear relationships between location (wards) and localized chemical data, Vayu Drishti accurately predicts micro-climate pollution levels, empowering individuals with absolute transparency regarding the air they breathe.

## 🚀 Key Features

- **📍 Hyper-Local Delhi Ward Mapping:** Dynamically predicts customized PM2.5 concentrations across every municipal ward and neighborhood in Delhi.
- **🧠 Advanced Deep Learning Engine:** Utilizes an optimized, fully-connected Temporal-Spatial network utilizing Batch Normalization, Dropout, and SiLU (Swish) activations for superior regression mapping.
- **🧬 Multivariate Intelligence Space:** Processes 7 independent meteorological and chemical variables per location:
  - **Spatial Data:** Precise Latitude, Longitude, and proximity distance from Delhi's central base.
  - **Chemical Identifiers:** Real-time localized measurements of SO2, NO2, PM10, and CO (ppb).
- **📈 Seamless Spatial Interpolation:** Connects discrete datasets from sparse monitoring stations to generate a unified, fluid geographical air quality map.
- **🎯 Highly Tuned Environmental Metrics:** Utilizes Huber Loss modeling optimally designed to adapt to the highly dynamic distributions characteristic of urban air pollution.

## 📂 Project Architecture

```text
Breath-Analyzser/
├── backend/
│   ├── train_vayu_v2.py                 # Core Neural Network Definition & Model Training routines
│   └── dataset_extracted/               # Active datasets used for model training
│       ├── delhi_aqi.csv                # Delhi AQI mapping datasets
│       └── final_dataset.csv            # Multi-station historical atmospheric data
└── README.md                            # Comprehensive project documentation
```

## 🧠 Behind the Model (`TemporalSpatialNet`)

Vayu Drishti operates upon a highly specialized Neural Network mapping chemical behaviors to physical distances. Here is a breakdown of the deep learning architecture implemented within the system:

- **Input Layer:** 7 Nodes interpreting spatial and chemical parameters.
- **Hidden Layer 1:** 256 Nodes → `BatchNorm1d` → `SiLU` → `Dropout(0.25)`
- **Hidden Layer 2:** 128 Nodes → `BatchNorm1d` → `SiLU` → `Dropout(0.15)`
- **Hidden Layer 3:** 64 Nodes → `SiLU`
- **Output Layer:** 1 Regression Node delivering the predicted micro-climate PM2.5 target variable in µg/m³.

The architecture successfully maps non-linear atmospheric degradation paths and geographical dispersion over urban environments.

## 🛠️ Environment Setup & Execution

Ensure you have **Python 3.8+** installed before proceeding with the training pipeline.

**1. Install Core Dependencies:**
```bash
pip install torch numpy pandas scikit-learn
```

**2. Provision the Datasets:**
Place the comprehensive spatial datasets directly into the core execution environment at `backend/dataset_extracted/`:
- `delhi_aqi.csv`
- `final_dataset.csv`

**3. Execute Model Training:**
Enter the backend directory and launch the hyper-local prediction engine:
```bash
cd backend
python train_vayu_v2.py
```

### 📦 Resultant System Artifacts
Running the pipeline generates two highly-tuned artifacts for real-time production inference:
- `vayu_spatial_PRODUCTION.pt`: The compiled, production-ready PyTorch model weights state dictionary.
- `vayu_scaler.pkl`: The feature standard scaler required to actively map inputs in the live real-time mapping environment.

## 🤝 Validation & Benchmarking

The system automatically performs an `85/15` Training-to-Validation continuous split during runtime environments. Real versus Predicted PM2.5 scores are actively output during compilation, allowing data engineers to immediately validate regression paths and ensure hyper-local accuracy prior to map generation.

<div align="center">
  <i>Empowering absolute transparency for every breath, in every ward.</i>
</div>
