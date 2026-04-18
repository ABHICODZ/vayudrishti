# Breath-Analyzer (Vayu Drishti)

![Vayu Drishti Banner](https://img.shields.io/badge/Vayu%20Drishti-AI%20Spatial%20AQI%20Interpolation-brightgreen?style=for-the-badge) ![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white) 

Vayu Drishti is an AI-powered spatial interpolation system designed to accurately predict PM2.5 concentrations (the core metric for the Air Quality Index) across Delhi, India. Using a custom PyTorch Deep Neural Network architecture (`TemporalSpatialNet`), it learns complex, non-linear relationships between geographic locations and chemical pollutant levels.

## 🚀 Features

- **Deep Learning Architecture:** Utilizes a highly optimized, fully connected Neural Network with Batch Normalization, Dropout, and SiLU (Swish) activations for robust regression.
- **Micro-climate Prediction:** Extrapolates PM2.5 levels for unmonitored locations using data from nearby Central Pollution Control Board (CPCB) monitoring stations.
- **Multivariate Input Space:** Analyzes 7 key features:
  - **Spatial:** Latitude, Longitude, Distance from Delhi Base Center.
  - **Chemical:** Exact measurements of SO2, NO2, PM10, and CO (ppb).
- **Automated Data Pipeline:** Cleanses uncalibrated datasets by replacing missing values, standardizing variations, and removing hardware anomalies (such as PM2.5 > 500 µg/m³).
- **Robust Loss Metric:** Tuned with Huber Loss (delta=10.0) mapping closely to skewed PM2.5 distributions, surpassing standard MSE performance.

## 📂 Project Structure

```text
Breath-Analyzser/
├── backend/
│   ├── train_vayu_v2.py                 # Core Neural Network Definition & Model Training routines
│   └── dataset_extracted/               # (Expected) Directory for training Datasets
│       ├── delhi_aqi.csv                # Kaggle/CPCB Delhi AQI target dataset 
│       └── final_dataset.csv            # Multi-station historical data
└── README.md                            # Comprehensive project documentation
```

> **Note:** Due to size constraints, the `.csv` datasets and cached folders have been excluded from the submission repository.

## 🛠️ Requirements & Setup

Ensure you have Python 3.8+ installed. You can install the required dependencies using pip.

```bash
pip install torch numpy pandas scikit-learn
```

If utilizing Google Colab, you can upload `train_vayu_v2.py` in your environment — the script automatically detects and utilizes GPU/CUDA resources if available.

## 📊 Dataset Requirement

To launch the model training locally, create a `dataset_extracted` directory inside `backend/` and place the required real-world data inside:

1. `delhi_aqi.csv`
2. `final_dataset.csv`

*(If certain columns aren't found, the pipeline gracefully handles them or attempts fallback mappings).*

## ⚙️ Running the Model

Navigate to the `backend` folder and run the script:

```bash
cd backend
python train_vayu_v2.py
```

### Outputs generated:
1. **`vayu_spatial_PRODUCTION.pt`**: The trained PyTorch model weights state dictionary. 
2. **`vayu_scaler.pkl`**: The standard feature scaler mapping feature scales (needed during real-time inference in production).

## 🧠 Model Architecture

The `TemporalSpatialNet` is defined as follows:

- **Input Layer:** 7 Nodes 
- **Hidden Layer 1:** 256 Nodes → BatchNorm1d → SiLU → Dropout (0.25)
- **Hidden Layer 2:** 128 Nodes → BatchNorm1d → SiLU → Dropout (0.15)
- **Hidden Layer 3:** 64 Nodes → SiLU
- **Output Layer:** 1 Node (Predicted PM2.5 in µg/m³)

## 🤝 Validation

During training, the application dynamically breaks the dataset down into an active `85/15` Training-to-Validation split. Real vs Predicted PM2.5 checks will be automatically visualized on terminal output post-training for immediate validation checks.
