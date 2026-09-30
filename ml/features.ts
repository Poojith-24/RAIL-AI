import { PNRStatus, FeatureVector, WaitlistType, TravelClass, QuotaCode } from '../backend/types/railway.js';
import {
  HISTORICAL_TRAIN_STATS,
  HISTORICAL_ROUTE_STATS,
  HISTORICAL_CLASS_STATS,
  HISTORICAL_QUOTA_STATS,
  HistoricalJourneyRecord
} from './dataset.js';

export interface EncodedFeatures {
  vector: number[];
  featureNames: string[];
  rawFeatures: FeatureVector;
}

/**
 * Calculates days between two date strings (YYYY-MM-DD)
 */
export function calculateDaysDifference(dateA: string, dateB: string): number {
  const d1 = new Date(dateA);
  const d2 = new Date(dateB);
  const diffTime = d1.getTime() - d2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a given date falls near major Indian festival periods
 * (Diwali, Chhath, Durga Puja, Holi, Pongal/Sankranti, Eid, Christmas/New Year rush)
 */
export function isFestivalPeriod(dateStr: string): boolean {
  const date = new Date(dateStr);
  const month = date.getMonth(); // 0-indexed: 9=Oct, 10=Nov, 2=March, 0=Jan
  const day = date.getDate();

  // Diwali/Chhath season (Late Oct - Mid Nov)
  if (month === 9 && day >= 20) return true;
  if (month === 10 && day <= 20) return true;
  // Holi rush (March)
  if (month === 2 && day >= 15 && day <= 30) return true;
  // Summer vacation rush (May - June)
  if (month === 4 || (month === 5 && day <= 15)) return true;
  // Year-end / Pongal (Dec 22 - Jan 18)
  if (month === 11 && day >= 22) return true;
  if (month === 0 && day <= 18) return true;

  return false;
}

/**
 * Extracts strictly pre-journey features from PNRStatus.
 * ZERO DATA LEAKAGE:
 * - Does not use chart status
 * - Does not use future cancellations
 * - Does not use post-prediction coach/seat allocations
 */
export function extractFeaturesFromPNR(pnrData: PNRStatus): FeatureVector {
  const today = new Date().toISOString().split('T')[0];
  const daysToJourney = Math.max(0, calculateDaysDifference(pnrData.journeyDate, today));
  const daysSinceBooking = Math.max(0, calculateDaysDifference(today, pnrData.bookingDate));

  // Passenger 1 status is the primary reference
  const p1 = pnrData.passengers[0] || {
    bookingStatus: 'WL 20',
    bookingPosition: 20,
    bookingType: 'GNWL',
    currentStatus: 'WL 20',
    currentPosition: 20,
    currentType: 'GNWL'
  };

  const bookingPos = p1.bookingPosition ?? (p1.bookingType === 'RAC' ? 10 : 25);
  const currentPos = p1.currentPosition ?? (p1.currentType === 'RAC' ? 5 : bookingPos);
  const posImprovement = Math.max(0, bookingPos - currentPos);

  const routeKey = `${pnrData.fromStationCode}-${pnrData.toStationCode}`;
  const trainStat = HISTORICAL_TRAIN_STATS[pnrData.trainNumber] || HISTORICAL_TRAIN_STATS['DEFAULT'];
  const routeStat = HISTORICAL_ROUTE_STATS[routeKey] || HISTORICAL_ROUTE_STATS['DEFAULT'];
  const classRate = HISTORICAL_CLASS_STATS[pnrData.class] ?? 0.70;
  const quotaRate = HISTORICAL_QUOTA_STATS[pnrData.quota] ?? 0.70;

  const journeyDateObj = new Date(pnrData.journeyDate);
  const dayOfWeek = isNaN(journeyDateObj.getDay()) ? 3 : journeyDateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5; // Fri/Sat/Sun
  const festivalPeriod = isFestivalPeriod(pnrData.journeyDate);

  let trainCategory = 'SUPERFAST';
  const tNameUpper = pnrData.trainName.toUpperCase();
  if (tNameUpper.includes('RAJDHANI')) trainCategory = 'RAJDHANI';
  else if (tNameUpper.includes('SHATABDI')) trainCategory = 'SHATABDI';
  else if (tNameUpper.includes('DURONTO')) trainCategory = 'DURONTO';
  else if (tNameUpper.includes('VANDE')) trainCategory = 'VANDE_BHARAT';

  return {
    days_to_journey: daysToJourney,
    days_since_booking: daysSinceBooking,
    booking_position: bookingPos,
    current_position: currentPos,
    position_improvement: posImprovement,
    waitlist_type: p1.currentType,
    train_number: pnrData.trainNumber,
    train_category: trainCategory,
    class: pnrData.class,
    quota: pnrData.quota,
    travel_distance_km: pnrData.distanceKm,
    historical_train_confirmation_rate: trainStat.rate,
    historical_route_confirmation_rate: routeStat.rate,
    historical_class_confirmation_rate: classRate,
    historical_quota_confirmation_rate: quotaRate,
    day_of_week: dayOfWeek,
    is_weekend: isWeekend,
    is_festival_period: festivalPeriod
  };
}

/**
 * Feature Names in deterministic order for the vector
 */
export const FEATURE_NAMES: string[] = [
  'days_to_journey',
  'current_position',
  'booking_position',
  'position_improvement',
  'is_rac',
  'is_gnwl',
  'is_rlwl',
  'is_pqwl',
  'is_ckwl',
  'is_ac_class',
  'historical_train_confirmation_rate',
  'historical_route_confirmation_rate',
  'historical_class_confirmation_rate',
  'historical_quota_confirmation_rate',
  'is_weekend',
  'is_festival_period',
  'normalized_distance'
];

/**
 * Encodes a feature vector into normalized float values suitable for Linear & Tree ML models
 */
export function encodeFeatureVector(feat: FeatureVector): EncodedFeatures {
  const isRac = feat.waitlist_type === 'RAC' ? 1.0 : 0.0;
  const isGnwl = feat.waitlist_type === 'GNWL' ? 1.0 : 0.0;
  const isRlwl = feat.waitlist_type === 'RLWL' ? 1.0 : 0.0;
  const isPqwl = feat.waitlist_type === 'PQWL' ? 1.0 : 0.0;
  const isCkwl = feat.waitlist_type === 'CKWL' || feat.quota === 'TQ' ? 1.0 : 0.0;

  const isAcClass = ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(feat.class) ? 1.0 : 0.0;

  const vector = [
    Math.min(30, feat.days_to_journey) / 30.0,                    // 0: days to journey (0 - 1)
    Math.min(100, feat.current_position) / 100.0,                // 1: current pos (0 - 1)
    Math.min(100, feat.booking_position) / 100.0,                // 2: booking pos (0 - 1)
    Math.min(50, feat.position_improvement) / 50.0,              // 3: improvement (0 - 1)
    isRac,                                                       // 4: is RAC
    isGnwl,                                                      // 5: is GNWL
    isRlwl,                                                      // 6: is RLWL
    isPqwl,                                                      // 7: is PQWL
    isCkwl,                                                      // 8: is CKWL
    isAcClass,                                                   // 9: is AC class
    feat.historical_train_confirmation_rate,                     // 10: train rate
    feat.historical_route_confirmation_rate,                     // 11: route rate
    feat.historical_class_confirmation_rate,                     // 12: class rate
    feat.historical_quota_confirmation_rate,                     // 13: quota rate
    feat.is_weekend ? 1.0 : 0.0,                                 // 14: weekend
    feat.is_festival_period ? 1.0 : 0.0,                         // 15: festival
    Math.min(3000, feat.travel_distance_km) / 3000.0             // 16: distance
  ];

  return {
    vector,
    featureNames: FEATURE_NAMES,
    rawFeatures: feat
  };
}

/**
 * Extracts and encodes features directly from a HistoricalJourneyRecord for model training
 */
export function recordToFeatures(rec: HistoricalJourneyRecord): EncodedFeatures {
  const trainStat = HISTORICAL_TRAIN_STATS[rec.train_number] || HISTORICAL_TRAIN_STATS['DEFAULT'];
  const routeStat = HISTORICAL_ROUTE_STATS[rec.route_key] || HISTORICAL_ROUTE_STATS['DEFAULT'];
  const classRate = HISTORICAL_CLASS_STATS[rec.class] ?? 0.70;
  const quotaRate = HISTORICAL_QUOTA_STATS[rec.quota] ?? 0.70;

  const rawFeatures: FeatureVector = {
    days_to_journey: rec.days_to_journey,
    days_since_booking: rec.days_since_booking,
    booking_position: rec.booking_position,
    current_position: rec.current_position,
    position_improvement: Math.max(0, rec.booking_position - rec.current_position),
    waitlist_type: rec.waitlist_type,
    train_number: rec.train_number,
    train_category: rec.train_category,
    class: rec.class,
    quota: rec.quota,
    travel_distance_km: rec.travel_distance_km,
    historical_train_confirmation_rate: trainStat.rate,
    historical_route_confirmation_rate: routeStat.rate,
    historical_class_confirmation_rate: classRate,
    historical_quota_confirmation_rate: quotaRate,
    day_of_week: rec.day_of_week,
    is_weekend: rec.is_weekend,
    is_festival_period: rec.is_festival_period
  };

  return encodeFeatureVector(rawFeatures);
}
