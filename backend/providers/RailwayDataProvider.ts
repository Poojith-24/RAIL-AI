import { PNRStatus, PassengerStatus, WaitlistType, TravelClass, QuotaCode } from '../types/railway.js';

export interface RailwayDataProvider {
  readonly providerName: string;
  readonly dataSourceType: 'LIVE' | 'DEMO';
  getPNRStatus(pnr: string): Promise<PNRStatus>;
  checkHealth(): Promise<{ status: 'healthy' | 'degraded' | 'unavailable'; message: string }>;
}

export class PNRNotFoundError extends Error {
  constructor() {
    super('Incorrect PNR.');
    this.name = 'PNRNotFoundError';
  }
}

/**
 * Validates Indian Railways 10-digit PNR format.
 * Format: 10 numeric digits, starting with 1-9 (first 3 digits indicate railway reservation system zone).
 */
export function validatePNRFormat(pnr: string): { isValid: boolean; error?: string } {
  if (!pnr) {
    return { isValid: false, error: 'PNR number is required' };
  }
  const cleanPNR = pnr.trim();
  if (cleanPNR.length !== 10) {
    return { isValid: false, error: 'PNR must be exactly 10 digits in length' };
  }
  if (!/^\d{10}$/.test(cleanPNR)) {
    return { isValid: false, error: 'PNR must contain only numerical digits (0-9)' };
  }
  const firstDigit = cleanPNR.charAt(0);
  if (firstDigit === '0') {
    return { isValid: false, error: 'Invalid Indian Railways PNR: First digit cannot be 0' };
  }
  return { isValid: true };
}

/**
 * Parses raw status strings like "WL 24", "GNWL 45", "RAC 8", "CNF", "B4, 23"
 */
export function parseStatusString(raw: string): { type: WaitlistType; position?: number } {
  const s = raw.trim().toUpperCase();
  if (s.includes('CNF') || s.includes('CONFIRM') || /^[A-Z]\d+/.test(s)) {
    return { type: 'CNF' };
  }
  if (s.startsWith('RAC')) {
    const num = parseInt(s.replace('RAC', '').trim(), 10);
    return { type: 'RAC', position: isNaN(num) ? undefined : num };
  }
  if (s.startsWith('GNWL') || s.startsWith('WL')) {
    const num = parseInt(s.replace(/GNWL|WL/, '').trim(), 10);
    return { type: 'GNWL', position: isNaN(num) ? undefined : num };
  }
  if (s.startsWith('RLWL')) {
    const num = parseInt(s.replace('RLWL', '').trim(), 10);
    return { type: 'RLWL', position: isNaN(num) ? undefined : num };
  }
  if (s.startsWith('PQWL')) {
    const num = parseInt(s.replace('PQWL', '').trim(), 10);
    return { type: 'PQWL', position: isNaN(num) ? undefined : num };
  }
  if (s.startsWith('CKWL') || s.startsWith('TQWL')) {
    const num = parseInt(s.replace(/CKWL|TQWL/, '').trim(), 10);
    return { type: 'CKWL', position: isNaN(num) ? undefined : num };
  }
  return { type: 'OTHER' };
}

/**
 * Standard realistic Indian Railways curated demo dataset for development & offline testing.
 */
export const SAMPLE_PNR_DATABASE: Record<string, Omit<PNRStatus, 'dataSource' | 'providerName' | 'fetchedAt'>> = {
  // ============================================================================
  // TAMIL NADU ROUTES (5 PNRs)
  // ============================================================================

  // 1. Chennai Egmore to Madurai - Pandian Superfast Express (High Possibility ~84%)
  '4218765430': {
    pnr: '4218765430',
    trainNumber: '12637',
    trainName: 'Pandian Superfast Express',
    journeyDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'MDU',
    toStationName: 'Madurai Junction',
    boardingStationCode: 'MS',
    boardingStationName: 'Chennai Egmore',
    destinationStationCode: 'MDU',
    destinationStationName: 'Madurai Junction',
    class: '3A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 497,
    expectedDepartureTime: '21:40 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 18',
        bookingPosition: 18,
        bookingType: 'GNWL',
        currentStatus: 'RAC 4',
        currentPosition: 4,
        currentType: 'RAC'
      }
    ]
  },

  // 2. Chennai to Coimbatore - Vande Bharat Express (High Possibility ~89%)
  '4329871265': {
    pnr: '4329871265',
    trainNumber: '20643',
    trainName: 'Coimbatore Vande Bharat Express',
    journeyDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MAS',
    fromStationName: 'MGR Chennai Central',
    toStationCode: 'CBE',
    toStationName: 'Coimbatore Junction',
    boardingStationCode: 'MAS',
    boardingStationName: 'MGR Chennai Central',
    destinationStationCode: 'CBE',
    destinationStationName: 'Coimbatore Junction',
    class: 'CC',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 495,
    expectedDepartureTime: '14:25 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 12',
        bookingPosition: 12,
        bookingType: 'GNWL',
        currentStatus: 'RAC 2',
        currentPosition: 2,
        currentType: 'RAC'
      }
    ]
  },

  // 3. Chennai Egmore to Kanyakumari - Kanyakumari Superfast Express (Medium Possibility ~54%)
  '4451239870': {
    pnr: '4451239870',
    trainNumber: '12633',
    trainName: 'Kanyakumari Superfast Express',
    journeyDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'CAPE',
    toStationName: 'Kanyakumari',
    boardingStationCode: 'MS',
    boardingStationName: 'Chennai Egmore',
    destinationStationCode: 'CAPE',
    destinationStationName: 'Kanyakumari',
    class: 'SL',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 742,
    expectedDepartureTime: '17:20 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'GNWL 68',
        bookingPosition: 68,
        bookingType: 'GNWL',
        currentStatus: 'WL 26',
        currentPosition: 26,
        currentType: 'GNWL'
      }
    ]
  },

  // 4. Chennai Egmore to Madurai - Vaigai Superfast Express (High Possibility ~81%)
  '4567890123': {
    pnr: '4567890123',
    trainNumber: '12635',
    trainName: 'Vaigai Superfast Express (via Trichy)',
    journeyDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'MDU',
    toStationName: 'Madurai Junction',
    boardingStationCode: 'MS',
    boardingStationName: 'Chennai Egmore',
    destinationStationCode: 'MDU',
    destinationStationName: 'Madurai Junction',
    class: '2S',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 497,
    expectedDepartureTime: '13:50 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 35',
        bookingPosition: 35,
        bookingType: 'GNWL',
        currentStatus: 'RAC 6',
        currentPosition: 6,
        currentType: 'RAC'
      }
    ]
  },

  // 5. Chennai to Mettupalayam (Ooty Hill Gateway) - Nilgiri Express (Low Possibility ~22%)
  '4678901234': {
    pnr: '4678901234',
    trainNumber: '12671',
    trainName: 'Nilgiri (Blue Mountain) Express',
    journeyDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MAS',
    fromStationName: 'MGR Chennai Central',
    toStationCode: 'MTP',
    toStationName: 'Mettupalayam',
    boardingStationCode: 'MAS',
    boardingStationName: 'MGR Chennai Central',
    destinationStationCode: 'MTP',
    destinationStationName: 'Mettupalayam',
    class: '2A',
    quota: 'PQ',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 532,
    expectedDepartureTime: '21:05 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'PQWL 19',
        bookingPosition: 19,
        bookingType: 'PQWL',
        currentStatus: 'PQWL 16',
        currentPosition: 16,
        currentType: 'PQWL'
      }
    ]
  },

  // ============================================================================
  // IMPORTANT LANDMARK INDIA ROUTES (5 PNRs)
  // ============================================================================

  // 6. Mumbai Central to New Delhi - Mumbai Tejas Rajdhani Express (High Possibility ~88%)
  '2819405672': {
    pnr: '2819405672',
    trainNumber: '12951',
    trainName: 'Mumbai Tejas Rajdhani Express',
    journeyDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 21 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MMCT',
    fromStationName: 'Mumbai Central',
    toStationCode: 'NDLS',
    toStationName: 'New Delhi',
    boardingStationCode: 'MMCT',
    boardingStationName: 'Mumbai Central',
    destinationStationCode: 'NDLS',
    destinationStationName: 'New Delhi',
    class: '3A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 1386,
    expectedDepartureTime: '17:00 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 45',
        bookingPosition: 45,
        bookingType: 'GNWL',
        currentStatus: 'WL 3',
        currentPosition: 3,
        currentType: 'GNWL'
      }
    ]
  },

  // 7. Howrah (Kolkata) to New Delhi - Howrah Rajdhani Tatkal (Low Possibility ~18%)
  '6348190251': {
    pnr: '6348190251',
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani Express (via Gaya)',
    journeyDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'HWH',
    fromStationName: 'Howrah Junction',
    toStationCode: 'NDLS',
    toStationName: 'New Delhi',
    boardingStationCode: 'HWH',
    boardingStationName: 'Howrah Junction',
    destinationStationCode: 'NDLS',
    destinationStationName: 'New Delhi',
    class: '2A',
    quota: 'TQ',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 1451,
    expectedDepartureTime: '16:50 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'CKWL 12',
        bookingPosition: 12,
        bookingType: 'CKWL',
        currentStatus: 'CKWL 9',
        currentPosition: 9,
        currentType: 'CKWL'
      }
    ]
  },

  // 8. New Delhi to Varanasi Junction - Vande Bharat Express (High Possibility ~82%)
  '2243618905': {
    pnr: '2243618905',
    trainNumber: '22436',
    trainName: 'New Delhi - Varanasi Vande Bharat Express',
    journeyDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'NDLS',
    fromStationName: 'New Delhi',
    toStationCode: 'BSB',
    toStationName: 'Varanasi Junction',
    boardingStationCode: 'NDLS',
    boardingStationName: 'New Delhi',
    destinationStationCode: 'BSB',
    destinationStationName: 'Varanasi Junction',
    class: 'CC',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 759,
    expectedDepartureTime: '06:00 AM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 22',
        bookingPosition: 22,
        bookingType: 'GNWL',
        currentStatus: 'RAC 5',
        currentPosition: 5,
        currentType: 'RAC'
      }
    ]
  },

  // 9. New Delhi to Kerala (Thiruvananthapuram) - Kerala Express (Medium Possibility ~46%)
  '9182374650': {
    pnr: '9182374650',
    trainNumber: '12626',
    trainName: 'Kerala SF Express',
    journeyDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'NDLS',
    fromStationName: 'New Delhi',
    toStationCode: 'TVC',
    toStationName: 'Thiruvananthapuram Central',
    boardingStationCode: 'NDLS',
    boardingStationName: 'New Delhi',
    destinationStationCode: 'TVC',
    destinationStationName: 'Thiruvananthapuram Central',
    class: 'SL',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 3036,
    expectedDepartureTime: '20:10 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'GNWL 120',
        bookingPosition: 120,
        bookingType: 'GNWL',
        currentStatus: 'WL 54',
        currentPosition: 54,
        currentType: 'GNWL'
      }
    ]
  },

  // 10. KSR Bengaluru to MGR Chennai Central - Shatabdi Express (Confirmed 100%)
  '1029384756': {
    pnr: '1029384756',
    trainNumber: '12028',
    trainName: 'Bengaluru - Chennai Shatabdi Express',
    journeyDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 40 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'SBC',
    fromStationName: 'KSR Bengaluru City',
    toStationCode: 'MAS',
    toStationName: 'MGR Chennai Central',
    boardingStationCode: 'SBC',
    boardingStationName: 'KSR Bengaluru City',
    destinationStationCode: 'MAS',
    destinationStationName: 'MGR Chennai Central',
    class: 'CC',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 359,
    expectedDepartureTime: '06:00 AM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'CNF',
        bookingType: 'CNF',
        currentStatus: 'CNF',
        currentType: 'CNF',
        coach: 'C2',
        berth: 42,
        berthType: 'WINDOW'
      }
    ]
  },

  // ============================================================================
  // SOUTHERN RAILWAYS - TAMIL NADU, KARNATAKA, KERALA, ANDHRA PRADESH (10 PNRs)
  // ============================================================================

  // 11. Bengaluru (Karnataka) to Chennai (Tamil Nadu) - Lalbagh Superfast Express (High ~86%)
  '4781290354': {
    pnr: '4781290354',
    trainNumber: '12608',
    trainName: 'Lalbagh Superfast Express',
    journeyDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'SBC',
    fromStationName: 'KSR Bengaluru City',
    toStationCode: 'MAS',
    toStationName: 'MGR Chennai Central',
    boardingStationCode: 'SBC',
    boardingStationName: 'KSR Bengaluru City',
    destinationStationCode: 'MAS',
    destinationStationName: 'MGR Chennai Central',
    class: 'CC',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 359,
    expectedDepartureTime: '06:20 AM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 16',
        bookingPosition: 16,
        bookingType: 'GNWL',
        currentStatus: 'RAC 3',
        currentPosition: 3,
        currentType: 'RAC'
      }
    ]
  },

  // 12. Bengaluru (Karnataka) to Ernakulam / Cochin (Kerala) - Island Express (High ~79%)
  '4892301465': {
    pnr: '4892301465',
    trainNumber: '16526',
    trainName: 'Kanyakumari Express (Island Express)',
    journeyDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'SBC',
    fromStationName: 'KSR Bengaluru City',
    toStationCode: 'ERN',
    toStationName: 'Ernakulam Town',
    boardingStationCode: 'SBC',
    boardingStationName: 'KSR Bengaluru City',
    destinationStationCode: 'ERN',
    destinationStationName: 'Ernakulam Town',
    class: '3A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 588,
    expectedDepartureTime: '20:10 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 28',
        bookingPosition: 28,
        bookingType: 'GNWL',
        currentStatus: 'WL 7',
        currentPosition: 7,
        currentType: 'GNWL'
      }
    ]
  },

  // 13. Kozhikode to Thiruvananthapuram (Kerala Trunk Corridor) - Jan Shatabdi Express (High ~83%)
  '4903412576': {
    pnr: '4903412576',
    trainNumber: '12076',
    trainName: 'Calicut - Trivandrum Jan Shatabdi Express',
    journeyDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'CLT',
    fromStationName: 'Kozhikode Main',
    toStationCode: 'TVC',
    toStationName: 'Thiruvananthapuram Central',
    boardingStationCode: 'CLT',
    boardingStationName: 'Kozhikode Main',
    destinationStationCode: 'TVC',
    destinationStationName: 'Thiruvananthapuram Central',
    class: 'CC',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 400,
    expectedDepartureTime: '05:45 AM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 20',
        bookingPosition: 20,
        bookingType: 'GNWL',
        currentStatus: 'RAC 5',
        currentPosition: 5,
        currentType: 'RAC'
      }
    ]
  },

  // 14. Chennai Egmore (Tamil Nadu) to Ernakulam (Kerala) - Guruvayur Express (Medium ~58%)
  '5014523687': {
    pnr: '5014523687',
    trainNumber: '16127',
    trainName: 'Chennai Egmore - Guruvayur Express',
    journeyDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 22 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'ERS',
    toStationName: 'Ernakulam Junction',
    boardingStationCode: 'MS',
    boardingStationName: 'Chennai Egmore',
    destinationStationCode: 'ERS',
    destinationStationName: 'Ernakulam Junction',
    class: 'SL',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 890,
    expectedDepartureTime: '09:45 AM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'GNWL 85',
        bookingPosition: 85,
        bookingType: 'GNWL',
        currentStatus: 'WL 34',
        currentPosition: 34,
        currentType: 'GNWL'
      }
    ]
  },

  // 15. Vijayawada (Andhra Pradesh) to Chennai (Tamil Nadu) - Pinakini Superfast (High ~85%)
  '5125634798': {
    pnr: '5125634798',
    trainNumber: '12711',
    trainName: 'Pinakini Superfast Express',
    journeyDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'BZA',
    fromStationName: 'Vijayawada Junction',
    toStationCode: 'MAS',
    toStationName: 'MGR Chennai Central',
    boardingStationCode: 'BZA',
    boardingStationName: 'Vijayawada Junction',
    destinationStationCode: 'MAS',
    destinationStationName: 'MGR Chennai Central',
    class: 'CC',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 431,
    expectedDepartureTime: '06:10 AM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 24',
        bookingPosition: 24,
        bookingType: 'GNWL',
        currentStatus: 'RAC 4',
        currentPosition: 4,
        currentType: 'RAC'
      }
    ]
  },

  // 16. Tirupati (Andhra Pradesh) to Mysuru (Karnataka) - Kacheguda Express (High ~90%)
  '5236745809': {
    pnr: '5236745809',
    trainNumber: '12785',
    trainName: 'Kacheguda - Mysuru SF Express (via Tirupati)',
    journeyDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'TPTY',
    fromStationName: 'Tirupati Main',
    toStationCode: 'MYS',
    toStationName: 'Mysuru Junction',
    boardingStationCode: 'TPTY',
    boardingStationName: 'Tirupati Main',
    destinationStationCode: 'MYS',
    destinationStationName: 'Mysuru Junction',
    class: '2A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 380,
    expectedDepartureTime: '22:15 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 9',
        bookingPosition: 9,
        bookingType: 'GNWL',
        currentStatus: 'RAC 1',
        currentPosition: 1,
        currentType: 'RAC'
      }
    ]
  },

  // 17. Visakhapatnam to Vijayawada (Andhra Pradesh Coastal Trunk) - Janmabhoomi SF (High ~87%)
  '5347856910': {
    pnr: '5347856910',
    trainNumber: '12805',
    trainName: 'Janmabhoomi Superfast Express',
    journeyDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'VSKP',
    fromStationName: 'Visakhapatnam Junction',
    toStationCode: 'BZA',
    toStationName: 'Vijayawada Junction',
    boardingStationCode: 'VSKP',
    boardingStationName: 'Visakhapatnam Junction',
    destinationStationCode: 'BZA',
    destinationStationName: 'Vijayawada Junction',
    class: 'CC',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 350,
    expectedDepartureTime: '06:20 AM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 18',
        bookingPosition: 18,
        bookingType: 'GNWL',
        currentStatus: 'RAC 2',
        currentPosition: 2,
        currentType: 'RAC'
      }
    ]
  },

  // 18. Mysuru (Karnataka) to Chennai (Tamil Nadu) - Vande Bharat Express (Medium ~68%)
  '5458967021': {
    pnr: '5458967021',
    trainNumber: '20608',
    trainName: 'Mysuru - MGR Chennai Central Vande Bharat',
    journeyDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MYS',
    fromStationName: 'Mysuru Junction',
    toStationCode: 'MAS',
    toStationName: 'MGR Chennai Central',
    boardingStationCode: 'MYS',
    boardingStationName: 'Mysuru Junction',
    destinationStationCode: 'MAS',
    destinationStationName: 'MGR Chennai Central',
    class: 'EC',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 497,
    expectedDepartureTime: '13:05 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'WL 6',
        bookingPosition: 6,
        bookingType: 'GNWL',
        currentStatus: 'WL 2',
        currentPosition: 2,
        currentType: 'GNWL'
      }
    ]
  },

  // 19. Mangaluru Central (Karnataka) to Thiruvananthapuram (Kerala) - Maveli Express (Medium ~51%)
  '5569078132': {
    pnr: '5569078132',
    trainNumber: '16604',
    trainName: 'Maveli Express',
    journeyDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MAQ',
    fromStationName: 'Mangaluru Central',
    toStationCode: 'TVC',
    toStationName: 'Thiruvananthapuram Central',
    boardingStationCode: 'MAQ',
    boardingStationName: 'Mangaluru Central',
    destinationStationCode: 'TVC',
    destinationStationName: 'Thiruvananthapuram Central',
    class: 'SL',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 620,
    expectedDepartureTime: '17:30 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'GNWL 94',
        bookingPosition: 94,
        bookingType: 'GNWL',
        currentStatus: 'WL 42',
        currentPosition: 42,
        currentType: 'GNWL'
      }
    ]
  },

  // 20. Guntur (Andhra Pradesh) to Thiruvananthapuram (Kerala) - Sabari Express (Low ~25%)
  '5670189243': {
    pnr: '5670189243',
    trainNumber: '17230',
    trainName: 'Sabari Express (via Tirupati & Ernakulam)',
    journeyDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'GNT',
    fromStationName: 'Guntur Junction',
    toStationCode: 'TVC',
    toStationName: 'Thiruvananthapuram Central',
    boardingStationCode: 'GNT',
    boardingStationName: 'Guntur Junction',
    destinationStationCode: 'TVC',
    destinationStationName: 'Thiruvananthapuram Central',
    class: '3A',
    quota: 'PQ',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 1256,
    expectedDepartureTime: '13:00 PM',
    passengers: [
      {
        passengerNumber: 1,
        bookingStatus: 'PQWL 22',
        bookingPosition: 22,
        bookingType: 'PQWL',
        currentStatus: 'PQWL 17',
        currentPosition: 17,
        currentType: 'PQWL'
      }
    ]
  },

  // ============================================================================
  // ADDITIONAL TAMIL NADU ROUTES WITH DISTINCT BOARDING / ALIGHTING STATIONS
  // ============================================================================

  // Chennai -> Salem -> Erode -> Coimbatore (Kovai Express)
  '6012345789': {
    pnr: '6012345789',
    trainNumber: '12675',
    trainName: 'Kovai Superfast Express',
    journeyDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 13 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MAS',
    fromStationName: 'MGR Chennai Central',
    toStationCode: 'CBE',
    toStationName: 'Coimbatore Junction',
    boardingStationCode: 'SA',
    boardingStationName: 'Salem Junction',
    destinationStationCode: 'ED',
    destinationStationName: 'Erode Junction',
    class: '3A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 495,
    expectedDepartureTime: '06:10 AM',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 32',
      bookingPosition: 32,
      bookingType: 'GNWL',
      currentStatus: 'WL 11',
      currentPosition: 11,
      currentType: 'GNWL'
    }]
  },

  // Chennai -> Tambaram -> Villupuram -> Tiruchchirappalli (Pallavan Express)
  '6123456790': {
    pnr: '6123456790',
    trainNumber: '12605',
    trainName: 'Pallavan Superfast Express',
    journeyDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'TPJ',
    toStationName: 'Tiruchchirappalli Junction',
    boardingStationCode: 'TBM',
    boardingStationName: 'Tambaram',
    destinationStationCode: 'VM',
    destinationStationName: 'Villupuram Junction',
    class: '2S',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 401,
    expectedDepartureTime: '15:45',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 21',
      bookingPosition: 21,
      bookingType: 'GNWL',
      currentStatus: 'RAC 5',
      currentPosition: 5,
      currentType: 'RAC'
    }]
  },

  // Chennai -> Villupuram -> Tiruchchirappalli -> Madurai (Vaigai Express)
  '6234567801': {
    pnr: '6234567801',
    trainNumber: '12635',
    trainName: 'Vaigai Superfast Express',
    journeyDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'MDU',
    toStationName: 'Madurai Junction',
    boardingStationCode: 'VM',
    boardingStationName: 'Villupuram Junction',
    destinationStationCode: 'TPJ',
    destinationStationName: 'Tiruchchirappalli Junction',
    class: '3A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 497,
    expectedDepartureTime: '13:50',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 48',
      bookingPosition: 48,
      bookingType: 'GNWL',
      currentStatus: 'WL 39',
      currentPosition: 39,
      currentType: 'GNWL'
    }]
  },

  // Chennai -> Tiruchchirappalli -> Dindigul -> Madurai (Pandian Express)
  '6345678912': {
    pnr: '6345678912',
    trainNumber: '12637',
    trainName: 'Pandian Superfast Express',
    journeyDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 24 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'MDU',
    toStationName: 'Madurai Junction',
    boardingStationCode: 'TPJ',
    boardingStationName: 'Tiruchchirappalli Junction',
    destinationStationCode: 'DG',
    destinationStationName: 'Dindigul Junction',
    class: '2A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 497,
    expectedDepartureTime: '21:40',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 14',
      bookingPosition: 14,
      bookingType: 'GNWL',
      currentStatus: 'RAC 2',
      currentPosition: 2,
      currentType: 'RAC'
    }]
  },

  // Chennai -> Salem -> Erode -> Mettupalayam (Nilgiri Express)
  '6456789123': {
    pnr: '6456789123',
    trainNumber: '12671',
    trainName: 'Nilgiri Superfast Express',
    journeyDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MAS',
    fromStationName: 'MGR Chennai Central',
    toStationCode: 'MTP',
    toStationName: 'Mettupalayam',
    boardingStationCode: 'SA',
    boardingStationName: 'Salem Junction',
    destinationStationCode: 'ED',
    destinationStationName: 'Erode Junction',
    class: 'SL',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 532,
    expectedDepartureTime: '21:05',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 67',
      bookingPosition: 67,
      bookingType: 'GNWL',
      currentStatus: 'WL 58',
      currentPosition: 58,
      currentType: 'GNWL'
    }]
  },

  // Chennai -> Villupuram -> Tiruchchirappalli -> Tirunelveli (Nellai Express)
  '6567891234': {
    pnr: '6567891234',
    trainNumber: '12631',
    trainName: 'Nellai Superfast Express',
    journeyDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 16 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'TEN',
    toStationName: 'Tirunelveli Junction',
    boardingStationCode: 'VM',
    boardingStationName: 'Villupuram Junction',
    destinationStationCode: 'TPJ',
    destinationStationName: 'Tiruchchirappalli Junction',
    class: '3A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 650,
    expectedDepartureTime: '20:40',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 39',
      bookingPosition: 39,
      bookingType: 'GNWL',
      currentStatus: 'WL 18',
      currentPosition: 18,
      currentType: 'GNWL'
    }]
  },

  // Chennai -> Tiruchchirappalli -> Madurai -> Thoothukudi (Pearl City Express)
  '6678912345': {
    pnr: '6678912345',
    trainNumber: '12693',
    trainName: 'Pearl City Superfast Express',
    journeyDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 19 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'TN',
    toStationName: 'Thoothukudi',
    boardingStationCode: 'MDU',
    boardingStationName: 'Madurai Junction',
    destinationStationCode: 'CVP',
    destinationStationName: 'Kovilpatti',
    class: 'SL',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 650,
    expectedDepartureTime: '19:30',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 76',
      bookingPosition: 76,
      bookingType: 'GNWL',
      currentStatus: 'WL 51',
      currentPosition: 51,
      currentType: 'GNWL'
    }]
  },

  // Tambaram -> Villupuram -> Tiruchchirappalli -> Thanjavur (Uzhavan Express)
  '6789123456': {
    pnr: '6789123456',
    trainNumber: '16865',
    trainName: 'Uzhavan Express',
    journeyDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'TBM',
    fromStationName: 'Tambaram',
    toStationCode: 'TJ',
    toStationName: 'Thanjavur Junction',
    boardingStationCode: 'VM',
    boardingStationName: 'Villupuram Junction',
    destinationStationCode: 'TPJ',
    destinationStationName: 'Tiruchchirappalli Junction',
    class: '3A',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 350,
    expectedDepartureTime: '22:30',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 26',
      bookingPosition: 26,
      bookingType: 'GNWL',
      currentStatus: 'RAC 8',
      currentPosition: 8,
      currentType: 'RAC'
    }]
  },

  // Chennai -> Chengalpattu -> Villupuram -> Tiruchchirappalli (Rockfort Express)
  '6891234567': {
    pnr: '6891234567',
    trainNumber: '12653',
    trainName: 'Rockfort Superfast Express',
    journeyDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'TPJ',
    toStationName: 'Tiruchchirappalli Junction',
    boardingStationCode: 'CGL',
    boardingStationName: 'Chengalpattu Junction',
    destinationStationCode: 'VM',
    destinationStationName: 'Villupuram Junction',
    class: '2S',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 401,
    expectedDepartureTime: '22:15',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 58',
      bookingPosition: 58,
      bookingType: 'GNWL',
      currentStatus: 'WL 55',
      currentPosition: 55,
      currentType: 'GNWL'
    }]
  },

  // Chennai -> Madurai -> Tirunelveli -> Kanyakumari (Kanyakumari Express)
  '6912345678': {
    pnr: '6912345678',
    trainNumber: '12633',
    trainName: 'Kanyakumari Superfast Express',
    journeyDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    bookingDate: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0],
    fromStationCode: 'MS',
    fromStationName: 'Chennai Egmore',
    toStationCode: 'CAPE',
    toStationName: 'Kanniyakumari',
    boardingStationCode: 'MDU',
    boardingStationName: 'Madurai Junction',
    destinationStationCode: 'TEN',
    destinationStationName: 'Tirunelveli Junction',
    class: 'SL',
    quota: 'GN',
    chartStatus: 'CHART_NOT_PREPARED',
    distanceKm: 740,
    expectedDepartureTime: '17:20',
    passengers: [{
      passengerNumber: 1,
      bookingStatus: 'GNWL 103',
      bookingPosition: 103,
      bookingType: 'GNWL',
      currentStatus: 'WL 79',
      currentPosition: 79,
      currentType: 'GNWL'
    }]
  }
};

/**
 * Mock / Demo Railway Provider.
 * Adheres strictly to the rule: clearly identified mock/demo dataset during development
 * instead of pretending that the data is live.
 */
export class MockRailwayProvider implements RailwayDataProvider {
  readonly providerName = 'RailPredict Demo Engine';
  readonly dataSourceType = 'DEMO';

  async getPNRStatus(pnr: string): Promise<PNRStatus> {
    const validation = validatePNRFormat(pnr);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const cleanPNR = pnr.trim();
    // Simulate realistic railway data retrieval latency (180ms - 320ms)
    await new Promise((r) => setTimeout(r, 220));

    const baseRecord = SAMPLE_PNR_DATABASE[cleanPNR];
    if (!baseRecord) {
      throw new PNRNotFoundError();
    }

    return {
      ...baseRecord,
      dataSource: 'DEMO',
      providerName: this.providerName,
      fetchedAt: new Date().toISOString()
    };
  }

  async checkHealth(): Promise<{ status: 'healthy'; message: string }> {
    return {
      status: 'healthy',
      message: 'Demo railway data provider ready with 30 curated PNR records.'
    };
  }
}

/**
 * Authorized Railway Provider.
 * Connects to a verified, authorized Railway API endpoint when credentials are supplied.
 * Does NOT scrape or bypass IRCTC security.
 */
export class AuthorizedRailwayProvider implements RailwayDataProvider {
  readonly providerName: string;
  readonly dataSourceType = 'LIVE';
  private baseUrl: string;
  private apiKey: string;
  private apiHost: string;

  constructor(baseUrl?: string, apiKey?: string, apiHost?: string) {
    this.apiKey = (apiKey || process.env.RAILWAY_API_KEY || '').trim();
    this.baseUrl = (baseUrl || process.env.RAILWAY_API_BASE_URL || (this.apiKey ? 'https://irctc1.p.rapidapi.com' : '')).trim();
    this.apiHost = (apiHost || process.env.RAILWAY_API_HOST || (this.baseUrl.includes('rapidapi.com') ? 'irctc1.p.rapidapi.com' : '')).trim();
    this.providerName = 'Authorized Railway Partner API';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async getPNRStatus(pnr: string): Promise<PNRStatus> {
    const validation = validatePNRFormat(pnr);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    if (!this.isConfigured()) {
      throw new Error(
        'Real Railway/IRCTC API credentials are not configured in your environment. Please set RAILWAY_API_BASE_URL and RAILWAY_API_KEY in your server environment.'
      );
    }

    // Support both endpoints: if base URL includes {pnr} placeholder or path
    let endpoint = this.baseUrl.trim();
    if (endpoint.includes('{pnr}')) {
      endpoint = endpoint.replace('{pnr}', encodeURIComponent(pnr));
    } else if (endpoint.endsWith('/')) {
      endpoint = `${endpoint}pnr-status/${encodeURIComponent(pnr)}`;
    } else if (!endpoint.includes('pnr')) {
      endpoint = `${endpoint}/api/v3/getPNRStatus?pnrNumber=${encodeURIComponent(pnr)}`;
    } else {
      endpoint = `${endpoint}/${encodeURIComponent(pnr)}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-API-Key': this.apiKey,
        'x-rapidapi-key': this.apiKey,
        'Accept': 'application/json',
        'User-Agent': 'RailAI-PNR-Predictor/2.0'
      };

      if (this.apiHost) {
        headers['x-rapidapi-host'] = this.apiHost;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`PNR ${pnr} was not found on the railway reservation system. Please check the 10-digit number.`);
        }
        if (response.status === 429) {
          throw new Error('Railway API rate limit exceeded. Please try again in a few moments.');
        }
        if (response.status === 401 || response.status === 403) {
          throw new Error('Railway API authentication failed. Please verify that your RAILWAY_API_KEY is active and valid.');
        }
        throw new Error(`Railway API responded with HTTP status ${response.status}`);
      }

      const rawJson = await response.json();
      return this.normalizeApiResponse(pnr, rawJson);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network failure';
      throw new Error(`Failed to fetch live PNR: ${message}`);
    }
  }

  /**
   * Normalizes third-party authorized railway response into standard PNRStatus
   */
  private normalizeApiResponse(pnr: string, data: any): PNRStatus {
    // Unnest if response has wrapper like { data: { ... } } or { response: { ... } }
    const root = data.data || data.response || data.body || data;

    const rawPassengers = root.passengers || root.passenger_info || root.PassengerStatus || [];
    const passengers: PassengerStatus[] = (rawPassengers.length > 0 ? rawPassengers : [{
      bookingStatus: root.bookingStatus || root.booking_status || 'WL',
      currentStatus: root.currentStatus || root.current_status || 'WL'
    }]).map((p: any, idx: number) => {
      const bookingStr = p.bookingStatus || p.booking_status || p.BookingStatus || 'WL';
      const currentStr = p.currentStatus || p.current_status || p.CurrentStatus || bookingStr;
      const parsedBooking = parseStatusString(bookingStr);
      const parsedCurrent = parseStatusString(currentStr);

      return {
        passengerNumber: p.passengerSerialNumber || p.passengerNumber || idx + 1,
        bookingStatus: bookingStr,
        bookingPosition: parsedBooking.position,
        bookingType: parsedBooking.type,
        currentStatus: currentStr,
        currentPosition: parsedCurrent.position,
        currentType: parsedCurrent.type,
        coach: p.coach || p.Coach || p.currentCoachId,
        berth: p.berth || p.Berth || p.currentBerthNo,
        berthType: p.berthType || p.BerthCode
      };
    });

    return {
      pnr,
      trainNumber: String(root.trainNumber || root.train_number || root.TrainNo || 'UNKNOWN'),
      trainName: root.trainName || root.train_name || root.TrainName || 'Express Train',
      journeyDate: root.journeyDate || root.journey_date || root.Doj || new Date().toISOString().split('T')[0],
      bookingDate: root.bookingDate || root.booking_date || new Date().toISOString().split('T')[0],
      fromStationCode: root.fromStation || root.from_station || root.From || root.BoardingPoint || 'SRC',
      fromStationName: root.fromStationName || root.from_station_name || root.fromStation || 'Source Station',
      toStationCode: root.toStation || root.to_station || root.To || root.ReservationUpto || 'DST',
      toStationName: root.toStationName || root.to_station_name || root.toStation || 'Destination Station',
      boardingStationCode: root.boardingStation || root.boarding_station || root.BoardingPoint || root.fromStation || 'SRC',
      boardingStationName: root.boardingStationName || root.fromStationName || 'Boarding Station',
      destinationStationCode: root.toStation || root.ReservationUpto || 'DST',
      destinationStationName: root.toStationName || 'Destination Station',
      class: (root.class || root.journeyClass || root.Class || '3A') as TravelClass,
      quota: (root.quota || root.Quota || 'GN') as QuotaCode,
      chartStatus: (root.chartPrepared || root.chartStatus === 'CHART_PREPARED' || root.ChartPrepared === true)
        ? 'CHART_PREPARED'
        : 'CHART_NOT_PREPARED',
      distanceKm: Number(root.distance || root.distanceKm || root.Distance || 850),
      expectedDepartureTime: root.departureTime || root.expectedDepartureTime || root.DepartureTime || '12:00',
      passengers,
      dataSource: 'LIVE',
      providerName: this.providerName,
      fetchedAt: new Date().toISOString()
    };
  }

  async checkHealth(): Promise<{ status: 'healthy' | 'degraded' | 'unavailable'; message: string }> {
    if (!this.isConfigured()) {
      return {
        status: 'unavailable',
        message: 'Real Railway API key is not configured in server environment (.env). Set RAILWAY_API_BASE_URL and RAILWAY_API_KEY.'
      };
    }
    return {
      status: 'healthy',
      message: 'Real Authorized Railway API key configured and active.'
    };
  }
}

/**
 * Provider Resolver / Factory
 */
export function getRailwayDataProvider(forceDemo = false): RailwayDataProvider {
  const mode = process.env.DATA_SOURCE_MODE || (process.env.RAILWAY_API_KEY ? 'LIVE' : 'DEMO');
  const hasLiveCreds = Boolean(process.env.RAILWAY_API_KEY);

  if (!forceDemo && mode.toUpperCase() === 'LIVE' && hasLiveCreds) {
    return new AuthorizedRailwayProvider();
  }
  return new MockRailwayProvider();
}
