export type WaitlistType = 'GNWL' | 'RLWL' | 'PQWL' | 'CKWL' | 'RAC' | 'CNF' | 'OTHER';

export type TravelClass = '1A' | '2A' | '3A' | '3E' | 'SL' | 'CC' | 'EC' | '2S' | '3C' | '2C' | '1C' | 'EA' | 'FC' | 'EV' | 'VS' | string;

export type QuotaCode = 'GN' | 'TQ' | 'PT' | 'LD' | 'SS' | 'DF' | 'FT' | 'RL' | 'PQ';

export type ChartStatus = 'CHART_NOT_PREPARED' | 'CHART_PREPARED';

export interface PassengerStatus {
  passengerNumber: number;
  bookingStatus: string;       // e.g., "WL 24", "GNWL 45", "RAC 12", "CNF"
  bookingPosition?: number;    // e.g., 24
  bookingType: WaitlistType;
  currentStatus: string;       // e.g., "RAC 8", "WL 3", "CNF", "WL 14"
  currentPosition?: number;    // e.g., 8
  currentType: WaitlistType;
  coach?: string;
  berth?: number;
  berthType?: string;
}

export interface PNRStatus {
  pnr: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;        // YYYY-MM-DD
  bookingDate: string;        // YYYY-MM-DD
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  boardingStationCode: string;
  boardingStationName: string;
  destinationStationCode: string;
  destinationStationName: string;
  class: TravelClass;
  quota: QuotaCode;
  chartStatus: ChartStatus;
  distanceKm: number;
  expectedDepartureTime: string;
  passengers: PassengerStatus[];
  availableClasses?: string[];
  dataSource: 'LIVE' | 'DEMO';
  providerName: string;
  fetchedAt: string;
}

export interface FeatureVector {
  days_to_journey: number;
  days_since_booking: number;
  booking_position: number;
  current_position: number;
  position_improvement: number;
  waitlist_type: WaitlistType;
  train_number: string;
  train_category: string;
  class: TravelClass;
  quota: QuotaCode;
  travel_distance_km: number;
  historical_train_confirmation_rate: number;
  historical_route_confirmation_rate: number;
  historical_class_confirmation_rate: number;
  historical_quota_confirmation_rate: number;
  day_of_week: number;
  is_weekend: boolean;
  is_festival_period: boolean;
}

export interface XAIFactor {
  name: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  weight: number; // percentage point delta
  description: string;
}

export interface SameTrainJourneyHistory {
  journeyDate: string;
  wlStartedFrom: string;
  finalConfirmedWl: string;
  wlMovement: number;
  yourWl: string;
  result: 'CONFIRMED' | 'WAITLISTED';
}

export interface RouteTimelineTrend {
  stage: string;
  daysOut: number;
  confirmationProbability: number;
  cancellationActivity: 'Low' | 'Moderate' | 'High' | 'Peak';
  isCurrentStage?: boolean;
}

export interface RouteDayOfWeekTrend {
  day: string;
  fullDay: string;
  rate: number;
  demandLevel: 'Low' | 'Normal' | 'High' | 'Peak';
  isJourneyDay?: boolean;
}

export interface RouteClassBenchmark {
  classCode: string;
  className: string;
  availability: boolean;
  clearanceRate: number | null;
  typicalWlThreshold: number | null;
  historicalDataAvailable: boolean;
  isCurrentClass?: boolean;
}

export interface CentralTrainClassInfo {
  trainNumber: string;
  trainName: string;
  availableClasses: RouteClassBenchmark[];
  source: 'OFFICIAL_REGISTRY' | 'LIVE_RAILWAY_API' | 'PRS_DYNAMIC';
  lastUpdated: string;
}

export interface RouteHistoricalTrend {
  routeKey: string;
  fromStationName: string;
  fromStationCode: string;
  toStationName: string;
  toStationCode: string;
  trainNumber: string;
  trainName: string;
  totalPastObservations: number;
  overallRouteConfirmationRate: number;
  avgVelocityPerDay: number;
  peakChurnWindowHours: string;
  timelineTrends: RouteTimelineTrend[];
  dayOfWeekTrends: RouteDayOfWeekTrend[];
  classBenchmarks: RouteClassBenchmark[];
  historicalInsights: string[];
}

export interface TrainStop {
  stopNumber: number;
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  day: number;
  platform?: string;
  isUserBoarding?: boolean;
  isUserDestination?: boolean;
}

export interface TrainScheduleInfo {
  trainNumber: string;
  trainName: string;
  trainType: string;
  originStation: string;
  destinationStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  totalDistanceKm: number;
  averageSpeedKmph: number;
  runsOnDays: string[];
  pantryAvailable: boolean;
  totalStopsCount: number;
  stops: TrainStop[];
}

export interface PredictionResult {
  pnr: string;
  probability: number;            // 0 - 100 percentage
  probabilityDecimal: number;     // 0.0 - 1.0
  category: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedStatus: string;
  modelVersion: string;
  modelType: string;
  baselineProbability: number;
  brierScoreEstimate: number;
  features: FeatureVector;
  explanation: {
    summary: string;
    positiveFactors: XAIFactor[];
    negativeFactors: XAIFactor[];
    neutralFactors: XAIFactor[];
  };
  pnrData: PNRStatus;
  sameTrainHistory?: SameTrainJourneyHistory[];
  routeTrends?: RouteHistoricalTrend;
  schedule?: TrainScheduleInfo;
  calculatedAt: string;
}

export interface ModelMetrics {
  modelVersion: string;
  modelName: string;
  trainedAt: string;
  trainingSamplesCount: number;
  testSamplesCount: number;
  validationScheme: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  brierScore: number;
  calibrationCurve: Array<{
    bin: number;
    binRange: string;
    meanPredicted: number;
    fractionPositives: number;
    count: number;
  }>;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  featureImportances: Array<{
    feature: string;
    importance: number;
    direction: 'positive' | 'negative' | 'mixed';
  }>;
}

export interface TrainConfirmationStat {
  trainNumber: string;
  trainName: string;
  route: string;
  totalHistoricalBookings: number;
  overallConfirmationRate: number;
  classRates: Record<string, number>;
  avgWLMovement: number;
}

export interface RouteConfirmationStat {
  routeKey: string;
  fromStation: string;
  toStation: string;
  distanceKm: number;
  totalBookings: number;
  confirmationRate: number;
  topTrains: string[];
}
