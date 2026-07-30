# MediScope 🫀
### Intelligent Hybrid Model for Heart Disease Prediction

MediScope is a **hybrid multimodal AI system** for cardiovascular risk assessment. Unlike traditional online risk calculators that rely solely on structured clinical data, MediScope fuses **Machine Learning** (tabular clinical analysis) with **Deep Learning Computer Vision** (echocardiogram video analysis) to deliver a precise, quantifiable risk percentage backed by objective physical evidence — moving prediction from statistical guesswork to justified, evidence-driven diagnosis.

---

## 📌 Table of Contents
- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Objectives](#key-objectives)
- [Scope](#scope)
- [System Architecture](#system-architecture)
- [Datasets](#datasets)
- [AI Models](#ai-models)
  - [CVD Risk Model](#cvd-risk-model-lifestyle-model)
  - [Echo Model](#echo-model-ejection-fraction-prediction)
  - [Multimodal Fusion Formula](#multimodal-fusion-formula)
- [Technology Stack](#technology-stack)
- [Database Design](#database-design)
- [User Interface](#user-interface)
- [Testing](#testing)
- [Results Summary](#results-summary)
- [Future Work](#future-work)
- [Team](#team)
- [References](#references)

---

## Overview

Heart disease remains the **leading cause of global mortality**. Existing digital risk-prediction tools are uni-modal — they depend exclusively on structured clinical/lifestyle data and completely ignore anatomical evidence such as structural heart abnormalities (e.g., Cardiomegaly) or Ejection Fraction (EF), which can only be captured through medical imaging.

**MediScope** solves this by combining two independent AI pipelines into a single, transparent decision system:

1. **Machine Learning Engine** — analyzes structured patient data (age, blood pressure, smoking status, etc.) to produce a baseline **CVD Risk Score**.
2. **Deep Learning Computer Vision Engine** — analyzes echocardiogram videos to detect structural abnormalities and predict **Ejection Fraction (EF)**.

The two outputs are merged through a **clinically-inspired dynamic fusion formula** into a single, interpretable **Global Risk Score (GRS)**, displayed on an interactive web dashboard.

---

## Problem Statement

Current online CVD risk tools:
- Rely only on structured clinical data (uni-modal).
- Fail to capture real-time anatomical/structural evidence (e.g., Cardiomegaly, low EF).
- Cannot justify their risk score with physical/imaging evidence.

MediScope addresses this diagnostic blind spot by fusing **tabular data analysis (ML)** with **computer vision (DL)** via a unified **Integration and Visualization Dashboard**.

---

## Key Objectives

1. **Model Development & Validation**
   - Build an ML model for a continuous Baseline Risk Score, validated via ROC-AUC.
   - Build a DL/CV model to analyze medical imaging (echocardiograms) for objective evidence.
2. **Multimedia Integration & Reporting**
   - Combine both models' outputs into a single, transparent dashboard.
3. **System Deployment & Delivery**
   - Deliver a secure, user-friendly, publicly accessible web platform for patients and doctors.

---

## Scope

**In Scope:**
- Full system architecture (DB, backend, frontend).
- ML model for tabular clinical risk scoring.
- DL/CV model for echocardiogram-based structural analysis (EF prediction).
- Integration & Visualization Dashboard combining both outputs.
- Public web platform with secure data entry and video upload.
- Final output: a quantifiable percentage risk of heart disease.

**Out of Scope / Constraints:**
- Not a replacement for formal clinical diagnosis (disclaimer required).
- Prototype-scale deployment, not production-scale traffic.
- Limited by availability of large, synchronized clinical + imaging datasets.

---

## System Architecture

MediScope follows a **layered, multi-tier architecture**:

```
User → Frontend (React.js) → Backend API (FastAPI) → AI Models (ML + DL) → Database (SQL Server) → Dashboard Results
```

| Layer | Responsibility |
|---|---|
| **Frontend** | Registration/login, clinical data entry, echo video upload, dashboard visualization |
| **Backend** | REST APIs, validation, orchestration between models and DB |
| **AI Layer** | CVD Risk Model, EF Prediction Model, Global Score fusion module |
| **Database** | Stores patients, medical records, echo videos, and model results |

### Core Entities (ERD)
- **Patient** — id, name, email, password, created_at
- **Medical Record** — clinical/lifestyle features linked to a patient
- **Echo Videos** — uploaded echocardiogram files with metadata
- **Model Results** — CVD risk score, heart failure chance, model metadata

---

## Datasets

### 1. Framingham (Augmented) Dataset — Tabular
- **Source:** Derived from the original Framingham Heart Study.
- **Size:** 4,240 real patient records, 17 clinical columns (no synthetic data).
- **Target:** A continuous **CVD Risk Score** (calculated via the Framingham primary care formula), used alongside the original binary 10-year CHD outcome for benchmarking.
- **Features:** age, gender, education, smoking status, cigarettes/day, BP medication, prevalent stroke/hypertension, diabetes, total cholesterol, systolic/diastolic BP, BMI, heart rate, glucose.

### 2. EchoNet-Dynamic Dataset — Computer Vision
- **Source:** Stanford Health Care (2016–2018), publicly available.
- **Size:** 10,030 apical-4-chamber (A4C) echocardiogram videos, one per patient.
- **Format:** Standardized AVI, resized to 112×112 px.
- **Labels:** Ejection Fraction (EF %), LV tracings at End-Systole/End-Diastole, ESV/EDV volumes, FPS & frame count.

---

## AI Models

### CVD Risk Model (Lifestyle Model)

- **Feature Engineering:** Reduced from 15 → 8 core features (male, age, currentSmoker, BPMeds, prevalentHyp, diabetes, sysBP, diaBP). Removed cholesterol (negligible impact, avoids requiring a blood draw). Engineered **Pulse Pressure = sysBP − diaBP**.
- **Pipeline:** Feature normalization → **ADASYN** oversampling (synthetic high-risk cases) → **Tomek Links** cleaning → **Support Vector Classifier (linear kernel)** → **Sigmoid calibration** for reliable probability outputs.
- **Performance:**
  | Metric | MediScope Model | Traditional Framingham Formula |
  |---|---|---|
  | ROC-AUC | **0.7403** | 0.7100 |

  Consistently improves accuracy by 1–3% while using fewer features.

### Echo Model (Ejection Fraction Prediction)

- **LV Segmentation:** YOLOv8-nano segmentation model detects a binary mask of the left ventricle frame-by-frame. Data split strictly by patient (70/15/15 train/val/test) to prevent leakage. **F1 Score ≈ 0.98** for LV detection.
- **EF Calculation:** Pixel-based area tracking across the cardiac cycle (with temporal smoothing) → 5 statistical features → fed into an **ensemble** of Random Forest, XGBoost, Gradient Boosting, and an LSTM network.
- **Performance:**
  | Metric | Value |
  |---|---|
  | MAE | **4.50%** |
  | R² | **0.98** |
  | Confidence Interval | 95% (validated via Bland-Altman plots) |

### Multimodal Fusion Formula

A **late-stage, decision-level fusion** mimics how cardiologists balance chronic risk factors against acute imaging evidence.

**Step A — EF Risk Penalty (non-linear):**

| EF Range | Clinical Status | Risk Penalty |
|---|---|---|
| ≥ 60% | Normal / Optimal | 0.00 |
| 55–59% | Good | 0.15 |
| 50–54% | Mildly Reduced | 0.30 |
| 45–49% | Warning Zone | 0.50 |
| 40–44% | Abnormal | 0.70 |
| 35–39% | Severe | 0.90 |
| < 35% | Critical Failure | 1.00 |

**Step B — Dynamic Trust Weighting:** As EF worsens, trust shifts from clinical/lifestyle data toward imaging evidence.

| EF Context | Weight: Clinical | Weight: Imaging |
|---|---|---|
| Normal (EF ≥ 55%) | 0.75 | 0.25 |
| Mild (EF 45–54%) | 0.65 | 0.35 |
| Severe (EF 35–44%) | 0.55 | 0.45 |
| Critical (EF < 35%) | 0.45 | 0.55 |

**Global Risk Score (GRS):**

```
GRS = W1 × CVD_Risk_Score + W2 × EF_Risk_Penalty
```

**Risk Interpretation:**
| GRS Range | Category | Recommendation |
|---|---|---|
| < 0.30 | 🟢 Low Risk | Maintain healthy lifestyle, routine checkups |
| 0.30 – 0.59 | 🟡 Moderate Risk | Lifestyle intervention required |
| ≥ 0.60 | 🔴 High Risk | Immediate cardiologist consultation |

> **Note:** The fusion parameters (thresholds, weights, penalties) are expert-informed prototype values intended as a transparent, interpretable starting point — meant to be refined through physician feedback and clinical validation, not treated as established medical standards.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | FastAPI |
| Database | SQL Server |
| Machine Learning | Python, Scikit-learn |
| Deep Learning | TensorFlow / PyTorch, YOLOv8 |
| Video Storage | Cloudinary |
| API Testing | Postman |
| Deployment | Hugging Face |
| Version Control | Git & GitHub |

---

## Database Design

Relational schema with 4 core tables:
- **Patient** (`id`, `name`, `email`, `password`, `created_at`)
- **Medical Record** (`id`, `patient_id`, clinical/lifestyle fields, `bmi`, `blood_pressure_category`, etc.)
- **Echo Videos** (`id`, `patient_id`, `view_angle`, `upload_date`, `video_format`, `file_url`)
- **Model Results** (`id`, `patient_id`, `medical_record_id`, `echo_video_id`, `cvd_risk_score`, `heart_failure_chance`, `model_metadata`)

Relationships enforced via primary/foreign keys to maintain data integrity across patient history and prediction results.

---

## User Interface

The web platform ("MediScope") includes:
- 🔐 **Login / Signup** — secure authentication
- 🏠 **Home Screen** — heart health overview and quick stats
- 👨‍⚕️ **Suggested Doctors** — specialist recommendations
- 💬 **Feedback/Reviews** — patient testimonials & platform stats
- 📋 **Medical Record (Lifestyle Score)** — clinical data entry form
- 🎥 **Echo Video Upload** — AI-powered echocardiogram analysis
- 📊 **Dashboard Profile** — combined CVD Risk Score, EF, and Global Prediction with a "Digital Twin" visualization

---

## Testing

### Unit Testing — 10/10 Passed
Covered: Login, Registration, Analysis modules, Dashboard, Profile, Doctor Suggestions, Navigation.

### Integration Testing — 8/8 Passed
Covered: Auth ↔ Dashboard, Registration ↔ DB, Analysis ↔ DB, Dashboard ↔ Analysis History, Profile ↔ DB, Doctor Suggestions ↔ Results, Navigation ↔ Pages.

---

## Results Summary

- ✅ Successfully generates CVD Risk Score, EF Score, and Global Risk Score.
- ✅ Fast prediction generation and smooth video processing.
- ✅ Doctor recommendations based on combined AI outputs.
- ✅ Demonstrates that combining ML + DL improves reliability over uni-modal tools.

---

## Future Work

- Integrate more advanced AI/ML models for higher accuracy.
- Expand database to cover more conditions and providers.
- Native mobile app (Android/iOS).
- Real-time doctor-patient communication.
- Multilingual support.
- Stronger authentication & encryption.
- Wearable device / EHR integration.
- Smarter, personalized doctor-recommendation engine.
---

## References

1. Kumar, S., Rani, S., Sharma, S., & Min, H. (2024). *Multimodality fusion aspects of medical diagnosis: A comprehensive review.* Bioengineering, 11(12), 1233.
2. D'Agostino, R. B., et al. (2008). *General cardiovascular risk profile for use in primary care: The Framingham Heart Study.* Circulation, 117(6), 743–753.
3. Ouyang, D., et al. (2020). *Video-based AI for beat-to-beat assessment of cardiac function.* Nature, 580(7802), 252–256.
4. American Heart Association. *Ejection Fraction Heart Failure Measurement.*
5. UCI Machine Learning Repository. (1988). *Heart Disease Dataset (Cleveland).*
6. Rajpurkar, P., et al. (2017). *CheXNet: Radiologist-level pneumonia detection on chest x-rays with deep learning.* arXiv preprint.
7. Jocher, G., Chaurasia, A., & Qiu, J. (2023). *YOLO by Ultralytics (YOLOv8).* Ultralytics.

---

> ⚠️ **Disclaimer:** MediScope is a research prototype. It provides a risk assessment and supporting evidence, **not a formal clinical diagnosis**. Always consult a qualified healthcare professional for medical decisions.
>
> This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
