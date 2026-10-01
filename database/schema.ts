/**
 * Database Schema Definitions for PostgreSQL / Supabase
 * Tables:
 * - users
 * - pnr_queries
 * - pnr_snapshots
 * - historical_pnr_data
 * - train_data
 * - station_data
 * - route_statistics
 * - prediction_results
 * - model_versions
 */

export interface DbUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  password_hash: string;
  created_at: string;
}

export interface DbPnrQuery {
  id: string;
  pnr_hash: string;           // SHA-256 hash of PNR to protect passenger privacy
  masked_pnr: string;         // e.g. "452****024"
  train_number: string;
  journey_date: string;
  class: string;
  quota: string;
  searched_at: string;
  ip_hash?: string;
  data_source: 'LIVE' | 'DEMO';
}

export interface DbPnrSnapshot {
  id: string;
  pnr_query_id: string;
  snapshot_time: string;
  booking_status: string;
  current_status: string;
  chart_status: string;
}

export interface DbPredictionResult {
  id: string;
  pnr_query_id: string;
  model_version: string;
  prediction_probability: number;
  prediction_category: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  expected_status: string;
  features_json: string;
  xai_factors_json: string;
  created_at: string;
}

export interface DbTrainData {
  train_number: string;
  train_name: string;
  train_type: string;
  origin_station: string;
  dest_station: string;
  distance_km: number;
  historical_confirmation_rate: number;
  total_tracked_bookings: number;
  classes?: string[];
}

export interface DbStationData {
  station_code: string;
  station_name: string;
  city: string;
  state: string;
  zone: string;
}

export interface DbRouteStatistic {
  route_key: string; // e.g. "NDLS-MMCT"
  origin_code: string;
  dest_code: string;
  distance_km: number;
  total_historical_journeys: number;
  average_confirmation_rate: number;
  last_updated: string;
}

export interface DbModelVersion {
  id: string;
  version: string;
  model_type: string;
  accuracy: number;
  roc_auc: number;
  brier_score: number;
  f1_score: number;
  training_records_count: number;
  is_active: boolean;
  trained_at: string;
}
