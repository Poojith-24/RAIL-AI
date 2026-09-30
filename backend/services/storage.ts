import crypto from 'crypto';
import {
  DbPnrQuery,
  DbPnrSnapshot,
  DbPredictionResult,
  DbModelVersion,
  DbTrainData,
  DbRouteStatistic
} from '../../database/schema.js';
import { PNRStatus, PredictionResult } from '../types/railway.js';
import { HISTORICAL_TRAIN_STATS, HISTORICAL_ROUTE_STATS } from '../../ml/dataset.js';

/**
 * SHA-256 Hasher for sensitive identifiers
 */
export function hashPNR(pnr: string): string {
  return crypto.createHash('sha256').update(pnr.trim()).digest('hex');
}

/**
 * Mask PNR for human readable display while preserving privacy:
 * e.g. "4523891024" -> "452****024"
 */
export function maskPNR(pnr: string): string {
  if (pnr.length < 10) return pnr;
  return `${pnr.slice(0, 3)}****${pnr.slice(7)}`;
}

class InAppStorageService {
  private queries: DbPnrQuery[] = [];
  private snapshots: DbPnrSnapshot[] = [];
  private predictions: DbPredictionResult[] = [];
  private modelVersions: DbModelVersion[] = [];
  private trainData: Map<string, DbTrainData> = new Map();
  private routeData: Map<string, DbRouteStatistic> = new Map();
  private apiLogs: Array<{ id: string; timestamp: string; method: string; endpoint: string; status: number; durationMs: number }> = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed initial active model version
    this.modelVersions.push({
      id: 'mod-1.4.2',
      version: 'v1.4.2',
      model_type: 'GradientBoosted-RailEnsemble',
      accuracy: 0.842,
      roc_auc: 0.887,
      brier_score: 0.118,
      f1_score: 0.835,
      training_records_count: 125000,
      is_active: true,
      trained_at: '2026-09-15T04:00:00Z'
    });

    // Seed train statistics
    for (const [tNum, info] of Object.entries(HISTORICAL_TRAIN_STATS)) {
      if (tNum === 'DEFAULT') continue;
      this.trainData.set(tNum, {
        train_number: tNum,
        train_name: info.name,
        train_type: info.name.includes('Rajdhani') ? 'RAJDHANI' : info.name.includes('Shatabdi') ? 'SHATABDI' : 'SUPERFAST',
        origin_station: 'SRC',
        dest_station: 'DST',
        distance_km: 1200,
        historical_confirmation_rate: info.rate,
        total_tracked_bookings: info.total
      });
    }

    // Seed route statistics
    for (const [rKey, info] of Object.entries(HISTORICAL_ROUTE_STATS)) {
      if (rKey === 'DEFAULT') continue;
      const parts = rKey.split('-');
      this.routeData.set(rKey, {
        route_key: rKey,
        origin_code: parts[0] || 'SRC',
        dest_code: parts[1] || 'DST',
        distance_km: 1100,
        total_historical_journeys: info.total,
        average_confirmation_rate: info.rate,
        last_updated: '2026-09-20T10:00:00Z'
      });
    }

    // Seed initial queries for dashboard activity
    const now = Date.now();
    const demoQueries = [
      { pnr: '4523891024', train: '12678', date: '2026-10-05', cls: 'CC', p: 78.4, cat: 'HIGH' as const, time: now - 3600000 * 2 },
      { pnr: '2819405672', train: '12951', date: '2026-10-01', cls: '3A', p: 86.2, cat: 'HIGH' as const, time: now - 3600000 * 5 },
      { pnr: '6348190251', train: '12301', date: '2026-09-29', cls: '2A', p: 18.0, cat: 'LOW' as const, time: now - 3600000 * 9 },
      { pnr: '9182374650', train: '12626', date: '2026-10-06', cls: 'SL', p: 44.5, cat: 'MEDIUM' as const, time: now - 3600000 * 14 }
    ];

    for (const dq of demoQueries) {
      const qId = `qry-${Math.random().toString(36).substring(2, 9)}`;
      this.queries.push({
        id: qId,
        pnr_hash: hashPNR(dq.pnr),
        masked_pnr: maskPNR(dq.pnr),
        train_number: dq.train,
        journey_date: dq.date,
        class: dq.cls,
        quota: 'GN',
        data_source: 'DEMO',
        searched_at: new Date(dq.time).toISOString()
      });

      this.predictions.push({
        id: `pred-${Math.random().toString(36).substring(2, 9)}`,
        pnr_query_id: qId,
        model_version: 'v1.4.2',
        prediction_probability: dq.p,
        prediction_category: dq.cat,
        confidence_level: 'HIGH',
        expected_status: dq.cat === 'HIGH' ? 'Likely to confirm before chart' : 'Limited movement expected',
        features_json: '{}',
        xai_factors_json: '[]',
        created_at: new Date(dq.time).toISOString()
      });
    }
  }

  savePrediction(pnrStatus: PNRStatus, pred: PredictionResult): { queryId: string; predictionId: string } {
    const queryId = `qry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const predId = `prd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const pnrHash = hashPNR(pnrStatus.pnr);
    const maskedPnr = maskPNR(pnrStatus.pnr);

    const queryRec: DbPnrQuery = {
      id: queryId,
      pnr_hash: pnrHash,
      masked_pnr: maskedPnr,
      train_number: pnrStatus.trainNumber,
      journey_date: pnrStatus.journeyDate,
      class: pnrStatus.class,
      quota: pnrStatus.quota,
      data_source: pnrStatus.dataSource,
      searched_at: new Date().toISOString()
    };
    this.queries.unshift(queryRec);

    // Save passenger snapshots
    for (const p of pnrStatus.passengers) {
      this.snapshots.push({
        id: `snp-${Date.now()}-${p.passengerNumber}`,
        pnr_query_id: queryId,
        snapshot_time: new Date().toISOString(),
        booking_status: p.bookingStatus,
        current_status: p.currentStatus,
        chart_status: pnrStatus.chartStatus
      });
    }

    // Save prediction result
    const predRec: DbPredictionResult = {
      id: predId,
      pnr_query_id: queryId,
      model_version: pred.modelVersion,
      prediction_probability: pred.probability,
      prediction_category: pred.category,
      confidence_level: pred.confidence,
      expected_status: pred.expectedStatus,
      features_json: JSON.stringify(pred.features),
      xai_factors_json: JSON.stringify(pred.explanation),
      created_at: new Date().toISOString()
    };
    this.predictions.unshift(predRec);

    return { queryId, predictionId: predId };
  }

  logApiRequest(method: string, endpoint: string, status: number, durationMs: number) {
    this.apiLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      status,
      durationMs
    });
    if (this.apiLogs.length > 200) {
      this.apiLogs.pop();
    }
  }

  getAdminStats() {
    const today = new Date().toISOString().split('T')[0];
    const predictionsToday = this.predictions.filter(p => p.created_at.startsWith(today)).length;
    const activeModel = this.modelVersions.find(m => m.is_active) || this.modelVersions[0];

    const errorCount = this.apiLogs.filter(l => l.status >= 400).length;

    return {
      totalPredictions: this.predictions.length,
      predictionsToday,
      totalQueriesTracked: this.queries.length,
      activeModelVersion: activeModel?.version || 'v1.4.2',
      modelType: activeModel?.model_type || 'GradientBoosted-RailEnsemble',
      datasetRecordsCount: 125000,
      recentQueries: this.queries.slice(0, 10),
      recentPredictions: this.predictions.slice(0, 10),
      apiRequestsCount: this.apiLogs.length,
      apiErrorsCount: errorCount,
      recentLogs: this.apiLogs.slice(0, 20)
    };
  }

  getAllTrainStats(): DbTrainData[] {
    return Array.from(this.trainData.values());
  }

  getAllRouteStats(): DbRouteStatistic[] {
    return Array.from(this.routeData.values());
  }

  getModelVersions(): DbModelVersion[] {
    return this.modelVersions;
  }

  addNewModelVersion(version: DbModelVersion) {
    this.modelVersions.forEach(m => { m.is_active = false; });
    this.modelVersions.unshift(version);
  }
}

export const storage = new InAppStorageService();
