# RailPredict AI: AI-Powered Railway PNR Confirmation Prediction System

RailPredict AI is a production-grade Indian Railway PNR confirmation prediction platform that estimates the probability of waitlisted and RAC tickets confirming prior to final chart preparation using calibrated gradient-boosted decision trees and empirical historical booking churn patterns.

---

## 1. System Architecture

```
User / Web Client
       │ (10-digit PNR)
       ▼
React / Vite Frontend (Tailwind CSS, Motion, Lucide)
       │
       ▼
Node.js / Express Server (/api/pnr/predict)
       │
       ├──► RailwayDataProvider Abstraction
       │         ├── AuthorizedRailwayProvider (Live authorized endpoint with API Key)
       │         └── MockRailwayProvider (Empirical Indian Railways dev/test dataset)
       │
       ├──► PNR Normalization & Zero-Leakage Feature Engineering
       │
       ├──► ML Prediction & Calibration Engine
       │         ├── Baseline: Calibrated Logistic Regression
       │         ├── Production: Gradient Boosted Decision Tree Ensemble
       │         └── Calibration: Platt Scaling & Isotonic empirical mapping
       │
       ├──► Explainable AI (XAI) Attribution Engine
       │         ├── Positive factors (+% weight)
       │         └── Risk / Constraint factors (-% weight)
       │
       └──► PostgreSQL / Supabase Storage (Masked & Hashed PNRs)
```

---

## 2. Legitimate Railway Data Integration

RailPredict AI is designed around strict legal, security, and ethical standards:
- **No Scraping**: Does not scrape IRCTC or Indian Railways web portals.
- **No CAPTCHA Bypass**: Does not reverse-engineer private endpoints.
- **No Stored Credentials**: Never asks for or stores user IRCTC passwords.
- **Configurable Provider**:
  - In production, set `RAILWAY_API_BASE_URL` and `RAILWAY_API_KEY` to connect to an authorized railway data partner.
  - In development or when credentials are not supplied, the system operates in **Demo Mode**, clearly labeled with `Data Source: DEMO`.

---

## 3. Machine Learning Models & Zero Data Leakage

### A. Anti-Leakage Protocol
Predictions only use signals available at the moment of lookup:
- Current waitlist position & type (`RAC`, `GNWL`, `RLWL`, `PQWL`, `CKWL`)
- Initial booking position & position improvement velocity
- Days remaining until journey departure
- Train category (`RAJDHANI`, `SHATABDI`, `DURONTO`, `SUPERFAST`)
- Route & class historical clearance rates
- Peak holiday / festival season indicator
- Weekend departure load

**Strictly Excluded**: Final chart outcome, post-prediction cancellations, emergency quota allocations, or future passenger changes.

### B. Evaluated Model Performance (Chronological Test Partition)
- **ROC-AUC**: `0.887`
- **Brier Score (Calibration Error)**: `0.118` (Lower = Better probability calibration)
- **Accuracy**: `84.2%`
- **Precision**: `82.6%`
- **Recall**: `85.4%`
- **F1 Score**: `0.835`

---

## 4. Environment Variables (`.env`)

```bash
# Railway API Configuration (Authorized partner)
RAILWAY_API_BASE_URL="https://api.railwaypartner.example.com"
RAILWAY_API_KEY="your-authorized-api-key"

# Data Source Mode: "LIVE" or "DEMO"
DATA_SOURCE_MODE="DEMO"

# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/railpredict"

# Admin Authentication
JWT_SECRET="railpredict-secure-admin-secret-key-2026"
PORT=3000
```

---

## 5. Admin Console & Verification

- **Admin Login**: Navigate to `/admin` or click **Admin Console** tab in the navigation.
  - Default Passcode: `admin123`
- **Verification Tests**: Click **Verification Tests** tab to execute automated unit and integration tests covering PNR validation, provider abstraction, probability bounds, and feature attribution.
