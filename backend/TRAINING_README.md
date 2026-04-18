# Model Training Instructions

## Quick Start (5 minutes)

### Step 1: Run Training Script

```bash
cd backend
python train_model_simple.py
```

**What it does:**
- Loads your existing datasets (city_day.csv, delhi_aqi.csv)
- Preprocesses data automatically
- Trains dual PM2.5/PM10 model
- Saves trained model and scaler
- Shows accuracy metrics

**Expected output:**
```
VayuDrishti Model Training
================================================================================

[STEP 1/6] Loading datasets...
  Loaded city_day.csv: 29531 records
  Filtered Delhi data: 1500+ records

[STEP 2/6] Preprocessing data...
  Date range: 2015-01-01 to 2020-12-31
  Added temporal features

[STEP 3/6] Engineering features...
  Final dataset: 1200+ records
  Features: 12

[STEP 4/6] Preparing training data...
  Train set: 960 samples
  Test set: 240 samples

[STEP 5/6] Training model...
  Using device: cpu
  Training for 50 epochs...
  Epoch 10/50 - Train Loss: 2500.1234, Test Loss: 2600.5678
  Epoch 20/50 - Train Loss: 1800.1234, Test Loss: 1900.5678
  ...
  ✓ Training complete!

[STEP 6/6] Evaluating model...

FINAL RESULTS
================================================================================

PM2.5 Metrics:
  MAE:  15.23 µg/m³
  RMSE: 22.45 µg/m³
  R²:   0.8234

PM10 Metrics:
  MAE:  25.67 µg/m³
  RMSE: 35.89 µg/m³
  R²:   0.7856

Accuracy (within 20%):
  PM2.5: 78.5%
  PM10:  72.3%

✓ TRAINING COMPLETE!
```

### Step 2: Copy Model Files

```bash
# Copy trained model to services folder
cp vayu_model_v2_best.pt app/services/
cp vayu_scaler_v2.pkl app/services/

# Verify files exist
ls -la app/services/vayu_*
```

### Step 3: Test the Model

```bash
# Run validation tests
python test_aqi_validation.py
```

**Expected:** Accuracy should improve from 69.5% to 75-80%

---

## What Gets Created

1. **vayu_model_v2_best.pt** - Trained PyTorch model (~500KB)
2. **vayu_scaler_v2.pkl** - Feature scaler for preprocessing

---

## Troubleshooting

### Problem: "No module named torch"
```bash
pip install torch scikit-learn pandas numpy
```

### Problem: "File not found: city_day.csv"
```bash
# Make sure you're in the backend folder
cd backend
python train_model_simple.py
```

### Problem: Training is slow
- Normal on CPU: 5-10 minutes
- With GPU: 1-2 minutes
- If > 30 minutes, reduce epochs to 20

### Problem: Low accuracy (< 70%)
- Check if you have enough data (need 1000+ records)
- Try training for more epochs (100 instead of 50)
- Check for data quality issues

---

## Advanced: Improve Accuracy

### Get More Data

Download additional data:
```bash
# Install required packages
pip install requests

# Run data collection (optional)
python scripts/collect_training_data.py
```

### Train Longer

Edit `train_model_simple.py`:
```python
epochs = 100  # Change from 50 to 100
```

### Adjust Learning Rate

Edit `train_model_simple.py`:
```python
optimizer = optim.Adam(model.parameters(), lr=0.0005)  # Reduce from 0.001
```

---

## Next Steps After Training

1. ✅ Model trained
2. ✅ Files copied to app/services/
3. ⏭️ Update ml_engine.py (see below)
4. ⏭️ Restart backend
5. ⏭️ Run validation tests

---

## Integration Instructions

After training, update `app/services/ml_engine.py`:

```python
# Change these lines:
model_path = "vayu_spatial_PRODUCTION.pt"  # OLD
scaler_path = "vayu_scaler.pkl"  # OLD

# To:
model_path = "vayu_model_v2_best.pt"  # NEW
scaler_path = "vayu_scaler_v2.pkl"  # NEW
```

Then restart your backend server.

---

## FAQ

**Q: How long does training take?**
A: 5-10 minutes on CPU, 1-2 minutes on GPU

**Q: Do I need GPU?**
A: No, CPU works fine for this dataset size

**Q: Can I use my own data?**
A: Yes! Just add it to dataset_extracted/ folder as CSV

**Q: What if accuracy is low?**
A: Normal for first training. Collect more data and retrain.

**Q: How often should I retrain?**
A: Monthly, or when you have new data

---

**Ready to train? Run:** `python train_model_simple.py`
