-- ====================================================================
-- RailPredict AI: Complete PostgreSQL & Supabase Database Migration
-- ====================================================================

-- Enable pgcrypto for UUIDs and secure hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'operator')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PNR QUERIES TABLE
-- Stores masked PNR queries with cryptographic hashes to avoid leaking raw passenger PNRs
CREATE TABLE IF NOT EXISTS pnr_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr_hash VARCHAR(64) NOT NULL,
    masked_pnr VARCHAR(12) NOT NULL,
    train_number VARCHAR(10) NOT NULL,
    journey_date DATE NOT NULL,
    class VARCHAR(5) NOT NULL,
    quota VARCHAR(5) NOT NULL DEFAULT 'GN',
    data_source VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (data_source IN ('LIVE', 'DEMO')),
    searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_pnr_queries_hash ON pnr_queries(pnr_hash);
CREATE INDEX IF NOT EXISTS idx_pnr_queries_train_date ON pnr_queries(train_number, journey_date);

-- 3. PNR SNAPSHOTS TABLE
-- Tracks how waitlist positions evolve over time as chart preparation approaches
CREATE TABLE IF NOT EXISTS pnr_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr_query_id UUID NOT NULL REFERENCES pnr_queries(id) ON DELETE CASCADE,
    snapshot_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    booking_status VARCHAR(50) NOT NULL,
    current_status VARCHAR(50) NOT NULL,
    chart_status VARCHAR(50) NOT NULL DEFAULT 'CHART_NOT_PREPARED'
);

CREATE INDEX IF NOT EXISTS idx_pnr_snapshots_query_id ON pnr_snapshots(pnr_query_id);

-- 4. PREDICTION RESULTS TABLE
-- Stores predictions with model version and calibrated probability
CREATE TABLE IF NOT EXISTS prediction_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr_query_id UUID NOT NULL REFERENCES pnr_queries(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL,
    prediction_probability NUMERIC(5, 2) NOT NULL,
    prediction_category VARCHAR(20) NOT NULL CHECK (prediction_category IN ('HIGH', 'MEDIUM', 'LOW')),
    confidence_level VARCHAR(20) NOT NULL CHECK (confidence_level IN ('HIGH', 'MEDIUM', 'LOW')),
    expected_status VARCHAR(255) NOT NULL,
    features_json JSONB,
    xai_factors_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prediction_results_created ON prediction_results(created_at);

-- 5. TRAIN DATA TABLE
CREATE TABLE IF NOT EXISTS train_data (
    train_number VARCHAR(10) PRIMARY KEY,
    train_name VARCHAR(150) NOT NULL,
    train_type VARCHAR(50) NOT NULL,
    origin_station VARCHAR(10) NOT NULL,
    dest_station VARCHAR(10) NOT NULL,
    distance_km INTEGER NOT NULL,
    historical_confirmation_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.7000,
    total_tracked_bookings INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. STATION DATA TABLE
CREATE TABLE IF NOT EXISTS station_data (
    station_code VARCHAR(10) PRIMARY KEY,
    station_name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zone VARCHAR(10) NOT NULL
);

-- 7. ROUTE STATISTICS TABLE
CREATE TABLE IF NOT EXISTS route_statistics (
    route_key VARCHAR(25) PRIMARY KEY, -- e.g. "NDLS-MMCT"
    origin_code VARCHAR(10) NOT NULL,
    dest_code VARCHAR(10) NOT NULL,
    distance_km INTEGER NOT NULL,
    total_historical_journeys INTEGER NOT NULL DEFAULT 0,
    average_confirmation_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.7000,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. MODEL VERSIONS TABLE
CREATE TABLE IF NOT EXISTS model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(50) UNIQUE NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    accuracy NUMERIC(5, 4) NOT NULL,
    roc_auc NUMERIC(5, 4) NOT NULL,
    brier_score NUMERIC(5, 4) NOT NULL,
    f1_score NUMERIC(5, 4) NOT NULL,
    training_records_count INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    trained_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. HISTORICAL PNR TRAINING DATA (Partitioned or Indexed for ML Training)
CREATE TABLE IF NOT EXISTS historical_pnr_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr_hash VARCHAR(64) NOT NULL,
    train_number VARCHAR(10) NOT NULL,
    journey_date DATE NOT NULL,
    booking_date DATE NOT NULL,
    days_to_journey INTEGER NOT NULL,
    from_station VARCHAR(10) NOT NULL,
    to_station VARCHAR(10) NOT NULL,
    travel_class VARCHAR(5) NOT NULL,
    quota VARCHAR(5) NOT NULL,
    waitlist_type VARCHAR(10) NOT NULL,
    booking_position INTEGER NOT NULL,
    current_position INTEGER NOT NULL,
    confirmed SMALLINT NOT NULL CHECK (confirmed IN (0, 1)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hist_train_date ON historical_pnr_data(train_number, journey_date);
