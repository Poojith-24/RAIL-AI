import { PNRStatus, TrainScheduleInfo, TrainStop } from '../types/railway.js';

// Pre-defined detailed station routes for major trains
const DETAILED_TRAIN_SCHEDULES: Record<string, {
  trainType: string;
  duration: string;
  averageSpeedKmph: number;
  runsOnDays: string[];
  pantryAvailable: boolean;
  stops: Array<{
    code: string;
    name: string;
    arr: string;
    dep: string;
    halt: number;
    dist: number;
    day: number;
    platform?: string;
  }>;
}> = {
  // 12637: Pandian Superfast Express (Chennai Egmore -> Madurai Junction)
  '12637': {
    trainType: 'Superfast Express',
    duration: '7h 45m',
    averageSpeedKmph: 64,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: false,
    stops: [
      { code: 'MS', name: 'Chennai Egmore', arr: 'Source', dep: '21:40', halt: 0, dist: 0, day: 1, platform: '4' },
      { code: 'TBM', name: 'Tambaram', arr: '22:08', dep: '22:10', halt: 2, dist: 25, day: 1, platform: '7' },
      { code: 'CGL', name: 'Chengalpattu Junction', arr: '22:38', dep: '22:40', halt: 2, dist: 56, day: 1, platform: '6' },
      { code: 'VM', name: 'Villupuram Junction', arr: '00:05', dep: '00:10', halt: 5, dist: 159, day: 2, platform: '1' },
      { code: 'VRI', name: 'Vriddhachalam Junction', arr: '00:50', dep: '00:52', halt: 2, dist: 213, day: 2, platform: '3' },
      { code: 'TPJ', name: 'Tiruchchirappalli Junction', arr: '02:40', dep: '02:45', halt: 5, dist: 337, day: 2, platform: '2' },
      { code: 'DG', name: 'Dindigul Junction', arr: '03:58', dep: '04:00', halt: 2, dist: 431, day: 2, platform: '1' },
      { code: 'KQN', name: 'Kodaikanal Road', arr: '04:18', dep: '04:20', halt: 2, dist: 453, day: 2, platform: '1' },
      { code: 'MDU', name: 'Madurai Junction', arr: '05:25', dep: 'Destination', halt: 0, dist: 497, day: 2, platform: '1' }
    ]
  },

  // 12638: Pandian Superfast Express (Madurai Junction -> Chennai Egmore)
  '12638': {
    trainType: 'Superfast Express',
    duration: '7h 50m',
    averageSpeedKmph: 63,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: false,
    stops: [
      { code: 'MDU', name: 'Madurai Junction', arr: 'Source', dep: '21:35', halt: 0, dist: 0, day: 1, platform: '1' },
      { code: 'KQN', name: 'Kodaikanal Road', arr: '22:08', dep: '22:10', halt: 2, dist: 41, day: 1, platform: '1' },
      { code: 'DG', name: 'Dindigul Junction', arr: '22:33', dep: '22:35', halt: 2, dist: 66, day: 1, platform: '2' },
      { code: 'TPJ', name: 'Tiruchchirappalli Junction', arr: '23:45', dep: '23:50', halt: 5, dist: 160, day: 1, platform: '1' },
      { code: 'VRI', name: 'Vriddhachalam Junction', arr: '01:25', dep: '01:27', halt: 2, dist: 284, day: 2, platform: '3' },
      { code: 'VM', name: 'Villupuram Junction', arr: '02:30', dep: '02:35', halt: 5, dist: 338, day: 2, platform: '1' },
      { code: 'CGL', name: 'Chengalpattu Junction', arr: '03:58', dep: '04:00', halt: 2, dist: 441, day: 2, platform: '5' },
      { code: 'TBM', name: 'Tambaram', arr: '04:28', dep: '04:30', halt: 2, dist: 472, day: 2, platform: '6' },
      { code: 'MS', name: 'Chennai Egmore', arr: '05:25', dep: 'Destination', halt: 0, dist: 497, day: 2, platform: '4' }
    ]
  },

  // 12608: Lalbagh Superfast Express (KSR Bengaluru -> MGR Chennai Central)
  '12608': {
    trainType: 'Superfast Express',
    duration: '6h 10m',
    averageSpeedKmph: 58,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: true,
    stops: [
      { code: 'SBC', name: 'KSR Bengaluru City', arr: 'Source', dep: '06:20', halt: 0, dist: 0, day: 1, platform: '4' },
      { code: 'BNC', name: 'Bengaluru Cant', arr: '06:30', dep: '06:32', halt: 2, dist: 4, day: 1, platform: '2' },
      { code: 'KJM', name: 'Krishnarajapuram', arr: '06:44', dep: '06:45', halt: 1, dist: 14, day: 1, platform: '2' },
      { code: 'BWT', name: 'Bangarapet Junction', arr: '07:34', dep: '07:35', halt: 1, dist: 70, day: 1, platform: '4' },
      { code: 'KPN', name: 'Kuppam', arr: '08:04', dep: '08:05', halt: 1, dist: 105, day: 1, platform: '1' },
      { code: 'JTJ', name: 'Jolarpettai Junction', arr: '08:58', dep: '09:00', halt: 2, dist: 145, day: 1, platform: '5' },
      { code: 'KPD', name: 'Katpadi Junction', arr: '10:08', dep: '10:10', halt: 2, dist: 229, day: 1, platform: '2' },
      { code: 'WJR', name: 'Walajah Road Junction', arr: '10:28', dep: '10:30', halt: 2, dist: 254, day: 1, platform: '2' },
      { code: 'SHU', name: 'Sholinghur', arr: '10:43', dep: '10:45', halt: 2, dist: 269, day: 1, platform: '2' },
      { code: 'AJJ', name: 'Arakkonam Junction', arr: '11:08', dep: '11:10', halt: 2, dist: 290, day: 1, platform: '2' },
      { code: 'PER', name: 'Perambur', arr: '11:58', dep: '12:00', halt: 2, dist: 354, day: 1, platform: '1' },
      { code: 'MAS', name: 'MGR Chennai Central', arr: '12:30', dep: 'Destination', halt: 0, dist: 359, day: 1, platform: '7' }
    ]
  },

  // 12028: Bengaluru - Chennai Shatabdi Express
  '12028': {
    trainType: 'Shatabdi Express',
    duration: '5h 00m',
    averageSpeedKmph: 72,
    runsOnDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    pantryAvailable: true,
    stops: [
      { code: 'SBC', name: 'KSR Bengaluru City', arr: 'Source', dep: '06:00', halt: 0, dist: 0, day: 1, platform: '7' },
      { code: 'BNC', name: 'Bengaluru Cant', arr: '06:10', dep: '06:12', halt: 2, dist: 4, day: 1, platform: '2' },
      { code: 'KPD', name: 'Katpadi Junction', arr: '09:03', dep: '09:05', halt: 2, dist: 229, day: 1, platform: '2' },
      { code: 'MAS', name: 'MGR Chennai Central', arr: '11:00', dep: 'Destination', halt: 0, dist: 359, day: 1, platform: '2' }
    ]
  },

  // 12673: Cheran Superfast Express (Chennai Central -> Coimbatore)
  '12673': {
    trainType: 'Superfast Express',
    duration: '8h 00m',
    averageSpeedKmph: 62,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: false,
    stops: [
      { code: 'MAS', name: 'MGR Chennai Central', arr: 'Source', dep: '22:00', halt: 0, dist: 0, day: 1, platform: '10' },
      { code: 'AJJ', name: 'Arakkonam Junction', arr: '22:53', dep: '22:55', halt: 2, dist: 69, day: 1, platform: '1' },
      { code: 'KPD', name: 'Katpadi Junction', arr: '23:43', dep: '23:45', halt: 2, dist: 130, day: 1, platform: '1' },
      { code: 'JTJ', name: 'Jolarpettai Junction', arr: '00:58', dep: '01:00', halt: 2, dist: 214, day: 2, platform: '2' },
      { code: 'SA', name: 'Salem Junction', arr: '02:42', dep: '02:45', halt: 3, dist: 335, day: 2, platform: '1' },
      { code: 'ED', name: 'Erode Junction', arr: '03:45', dep: '03:50', halt: 5, dist: 395, day: 2, platform: '2' },
      { code: 'TUP', name: 'Tiruppur', arr: '04:33', dep: '04:35', halt: 2, dist: 445, day: 2, platform: '1' },
      { code: 'CBF', name: 'Coimbatore North', arr: '05:18', dep: '05:20', halt: 2, dist: 492, day: 2, platform: '1' },
      { code: 'CBE', name: 'Coimbatore Main Junction', arr: '06:00', dep: 'Destination', halt: 0, dist: 495, day: 2, platform: '2' }
    ]
  },

  // 12076: Calicut - Trivandrum Jan Shatabdi Express
  '12076': {
    trainType: 'Jan Shatabdi Express',
    duration: '7h 00m',
    averageSpeedKmph: 57,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: false,
    stops: [
      { code: 'CLT', name: 'Kozhikode Main', arr: 'Source', dep: '05:45', halt: 0, dist: 0, day: 1, platform: '1' },
      { code: 'TIR', name: 'Tirur', arr: '06:19', dep: '06:20', halt: 1, dist: 41, day: 1, platform: '3' },
      { code: 'SRR', name: 'Shoranur Junction', arr: '07:12', dep: '07:15', halt: 3, dist: 86, day: 1, platform: '6' },
      { code: 'TCR', name: 'Thrissur', arr: '07:49', dep: '07:51', halt: 2, dist: 119, day: 1, platform: '1' },
      { code: 'AWY', name: 'Aluva', arr: '08:44', dep: '08:45', halt: 1, dist: 174, day: 1, platform: '1' },
      { code: 'ERN', name: 'Ernakulam Town', arr: '09:12', dep: '09:14', halt: 2, dist: 191, day: 1, platform: '2' },
      { code: 'ALLP', name: 'Alappuzha', arr: '10:07', dep: '10:10', halt: 3, dist: 248, day: 1, platform: '1' },
      { code: 'KYJ', name: 'Kayamkulam Junction', arr: '10:50', dep: '10:52', halt: 2, dist: 291, day: 1, platform: '2' },
      { code: 'QLN', name: 'Kollam Junction', arr: '11:28', dep: '11:30', halt: 2, dist: 332, day: 1, platform: '1' },
      { code: 'VAK', name: 'Varkala Sivagiri', arr: '11:51', dep: '11:52', halt: 1, dist: 356, day: 1, platform: '2' },
      { code: 'TVC', name: 'Thiruvananthapuram Central', arr: '12:45', dep: 'Destination', halt: 0, dist: 400, day: 1, platform: '1' }
    ]
  },

  // 12711: Pinakini Superfast Express (Vijayawada -> Chennai Central)
  '12711': {
    trainType: 'Superfast Express',
    duration: '6h 50m',
    averageSpeedKmph: 63,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: false,
    stops: [
      { code: 'BZA', name: 'Vijayawada Junction', arr: 'Source', dep: '06:10', halt: 0, dist: 0, day: 1, platform: '1' },
      { code: 'TEL', name: 'Tenali Junction', arr: '06:38', dep: '06:40', halt: 2, dist: 31, day: 1, platform: '3' },
      { code: 'NDO', name: 'Nidubrolu', arr: '06:58', dep: '07:00', halt: 2, dist: 53, day: 1, platform: '1' },
      { code: 'BPP', name: 'Bapatla', arr: '07:13', dep: '07:15', halt: 2, dist: 74, day: 1, platform: '2' },
      { code: 'CLX', name: 'Chirala', arr: '07:28', dep: '07:30', halt: 2, dist: 89, day: 1, platform: '2' },
      { code: 'OGL', name: 'Ongole', arr: '08:08', dep: '08:10', halt: 2, dist: 138, day: 1, platform: '3' },
      { code: 'SKM', name: 'Singarayakonda', arr: '08:28', dep: '08:30', halt: 2, dist: 166, day: 1, platform: '2' },
      { code: 'KVZ', name: 'Kavali', arr: '08:58', dep: '09:00', halt: 2, dist: 204, day: 1, platform: '2' },
      { code: 'NLR', name: 'Nellore', arr: '09:43', dep: '09:45', halt: 2, dist: 255, day: 1, platform: '3' },
      { code: 'GDR', name: 'Gudur Junction', arr: '10:38', dep: '10:40', halt: 2, dist: 293, day: 1, platform: '1' },
      { code: 'NYP', name: 'Nayudupeta', arr: '11:03', dep: '11:05', halt: 2, dist: 321, day: 1, platform: '2' },
      { code: 'SPE', name: 'Sullurupeta', arr: '11:28', dep: '11:30', halt: 2, dist: 348, day: 1, platform: '2' },
      { code: 'MAS', name: 'MGR Chennai Central', arr: '13:00', dep: 'Destination', halt: 0, dist: 431, day: 1, platform: '5' }
    ]
  },

  // 12805: Janmabhoomi Superfast Express (Visakhapatnam -> Vijayawada)
  '12805': {
    trainType: 'Superfast Express',
    duration: '5h 55m',
    averageSpeedKmph: 59,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: true,
    stops: [
      { code: 'VSKP', name: 'Visakhapatnam Junction', arr: 'Source', dep: '06:20', halt: 0, dist: 0, day: 1, platform: '1' },
      { code: 'DVD', name: 'Duvvada', arr: '06:47', dep: '06:49', halt: 2, dist: 17, day: 1, platform: '1' },
      { code: 'AKP', name: 'Anakapalle', arr: '07:03', dep: '07:05', halt: 2, dist: 33, day: 1, platform: '2' },
      { code: 'YLM', name: 'Elamanchili', arr: '07:23', dep: '07:25', halt: 2, dist: 57, day: 1, platform: '1' },
      { code: 'TUNI', name: 'Tuni', arr: '07:53', dep: '07:55', halt: 2, dist: 97, day: 1, platform: '1' },
      { code: 'ANV', name: 'Annavaram', arr: '08:08', dep: '08:10', halt: 2, dist: 114, day: 1, platform: '1' },
      { code: 'SLO', name: 'Samalkot Junction', arr: '08:38', dep: '08:40', halt: 2, dist: 151, day: 1, platform: '3' },
      { code: 'RJY', name: 'Rajahmundry', arr: '09:28', dep: '09:30', halt: 2, dist: 201, day: 1, platform: '1' },
      { code: 'TDD', name: 'Tadepalligudem', arr: '10:18', dep: '10:20', halt: 2, dist: 242, day: 1, platform: '3' },
      { code: 'EE', name: 'Eluru', arr: '10:58', dep: '11:00', halt: 2, dist: 290, day: 1, platform: '3' },
      { code: 'BZA', name: 'Vijayawada Junction', arr: '12:15', dep: 'Destination', halt: 0, dist: 350, day: 1, platform: '1' }
    ]
  },

  // 20608: Mysuru - MGR Chennai Central Vande Bharat Express
  '20608': {
    trainType: 'Vande Bharat Express',
    duration: '6h 15m',
    averageSpeedKmph: 79,
    runsOnDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: true,
    stops: [
      { code: 'MYS', name: 'Mysuru Junction', arr: 'Source', dep: '13:05', halt: 0, dist: 0, day: 1, platform: '1' },
      { code: 'MYA', name: 'Mandya', arr: '13:40', dep: '13:42', halt: 2, dist: 45, day: 1, platform: '2' },
      { code: 'SBC', name: 'KSR Bengaluru City', arr: '14:45', dep: '14:50', halt: 5, dist: 138, day: 1, platform: '7' },
      { code: 'KPD', name: 'Katpadi Junction', arr: '17:33', dep: '17:35', halt: 2, dist: 367, day: 1, platform: '2' },
      { code: 'MAS', name: 'MGR Chennai Central', arr: '19:20', dep: 'Destination', halt: 0, dist: 497, day: 1, platform: '2' }
    ]
  },

  // 20643: MGR Chennai Central - Coimbatore Vande Bharat Express
  '20643': {
    trainType: 'Vande Bharat Express',
    duration: '5h 50m',
    averageSpeedKmph: 85,
    runsOnDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: true,
    stops: [
      { code: 'MAS', name: 'MGR Chennai Central', arr: 'Source', dep: '14:15', halt: 0, dist: 0, day: 1, platform: '2' },
      { code: 'KPD', name: 'Katpadi Junction', arr: '15:58', dep: '16:00', halt: 2, dist: 130, day: 1, platform: '1' },
      { code: 'SA', name: 'Salem Junction', arr: '18:03', dep: '18:05', halt: 2, dist: 335, day: 1, platform: '4' },
      { code: 'ED', name: 'Erode Junction', arr: '18:55', dep: '19:00', halt: 5, dist: 395, day: 1, platform: '2' },
      { code: 'TUP', name: 'Tiruppur', arr: '19:40', dep: '19:42', halt: 2, dist: 445, day: 1, platform: '1' },
      { code: 'CBE', name: 'Coimbatore Junction', arr: '20:05', dep: 'Destination', halt: 0, dist: 495, day: 1, platform: '1' }
    ]
  },

  // 12951: Mumbai Tejas Rajdhani Express (Mumbai Central -> New Delhi)
  '12951': {
    trainType: 'Tejas Rajdhani Express',
    duration: '15h 32m',
    averageSpeedKmph: 89,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: true,
    stops: [
      { code: 'MMCT', name: 'Mumbai Central', arr: 'Source', dep: '17:00', halt: 0, dist: 0, day: 1, platform: '1' },
      { code: 'BVI', name: 'Borivali', arr: '17:22', dep: '17:24', halt: 2, dist: 30, day: 1, platform: '6' },
      { code: 'ST', name: 'Surat', arr: '19:43', dep: '19:48', halt: 5, dist: 263, day: 1, platform: '1' },
      { code: 'BRC', name: 'Vadodara Junction', arr: '21:06', dep: '21:16', halt: 10, dist: 393, day: 1, platform: '2' },
      { code: 'RTM', name: 'Ratlam Junction', arr: '00:25', dep: '00:28', halt: 3, dist: 654, day: 2, platform: '5' },
      { code: 'KOTA', name: 'Kota Junction', arr: '03:15', dep: '03:20', halt: 5, dist: 920, day: 2, platform: '1' },
      { code: 'NDLS', name: 'New Delhi', arr: '08:32', dep: 'Destination', halt: 0, dist: 1386, day: 2, platform: '1' }
    ]
  }
};

/**
 * Builds schedule and key route stops for the train associated with the PNR
 */
export function getTrainScheduleAndStops(pnrData: PNRStatus): TrainScheduleInfo {
  const custom = DETAILED_TRAIN_SCHEDULES[pnrData.trainNumber];

  if (custom) {
    const stops: TrainStop[] = custom.stops.map((s, idx) => ({
      stopNumber: idx + 1,
      stationCode: s.code,
      stationName: s.name,
      arrivalTime: s.arr,
      departureTime: s.dep,
      haltMinutes: s.halt,
      distanceKm: s.dist,
      day: s.day,
      platform: s.platform,
      isUserBoarding: s.code === (pnrData.boardingStationCode || pnrData.fromStationCode),
      isUserDestination: s.code === (pnrData.destinationStationCode || pnrData.toStationCode)
    }));

    return {
      trainNumber: pnrData.trainNumber,
      trainName: pnrData.trainName,
      trainType: custom.trainType,
      originStation: stops[0]?.stationName || pnrData.fromStationName,
      destinationStation: stops[stops.length - 1]?.stationName || pnrData.toStationName,
      departureTime: stops[0]?.departureTime || pnrData.expectedDepartureTime,
      arrivalTime: stops[stops.length - 1]?.arrivalTime || 'Next Day',
      duration: custom.duration,
      totalDistanceKm: pnrData.distanceKm,
      averageSpeedKmph: custom.averageSpeedKmph,
      runsOnDays: custom.runsOnDays,
      pantryAvailable: custom.pantryAvailable,
      totalStopsCount: stops.length,
      stops
    };
  }

  // Dynamic deterministic schedule generator for any other train
  const numStops = 6 + (parseInt(pnrData.trainNumber, 10) % 5);
  const totalDist = pnrData.distanceKm || 600;
  const depTime = pnrData.expectedDepartureTime || '14:30';

  const [depH, depM] = depTime.replace(/[^\d:]/g, '').split(':').map(Number);
  const startMinute = (depH || 14) * 60 + (depM || 30);
  const avgSpeed = 62 + (parseInt(pnrData.trainNumber, 10) % 15);
  const totalTravelMins = Math.round((totalDist / avgSpeed) * 60);

  const stops: TrainStop[] = [];

  // Origin stop
  stops.push({
    stopNumber: 1,
    stationCode: pnrData.fromStationCode,
    stationName: pnrData.fromStationName,
    arrivalTime: 'Source',
    departureTime: formatTime(startMinute),
    haltMinutes: 0,
    distanceKm: 0,
    day: 1,
    platform: String(1 + (parseInt(pnrData.trainNumber, 10) % 4)),
    isUserBoarding: true
  });

  // Intermediate stops
  const intermediateStationNames = [
    { code: 'TBM', name: 'Tambaram' },
    { code: 'CGL', name: 'Chengalpattu Junction' },
    { code: 'VM', name: 'Villupuram Junction' },
    { code: 'TPJ', name: 'Tiruchchirappalli Junction' },
    { code: 'DG', name: 'Dindigul Junction' },
    { code: 'ED', name: 'Erode Junction' },
    { code: 'SA', name: 'Salem Junction' },
    { code: 'KPD', name: 'Katpadi Junction' },
    { code: 'BWT', name: 'Bangarapet Junction' }
  ];

  for (let i = 1; i < numStops - 1; i++) {
    const fraction = i / (numStops - 1);
    const currDist = Math.round(totalDist * fraction);
    const arrivalMin = startMinute + Math.round(totalTravelMins * fraction);
    const halt = 2 + (i % 3);
    const depMin = arrivalMin + halt;
    const day = Math.floor(arrivalMin / 1440) + 1;
    const sampleStn = intermediateStationNames[i % intermediateStationNames.length];

    stops.push({
      stopNumber: i + 1,
      stationCode: sampleStn.code,
      stationName: sampleStn.name,
      arrivalTime: formatTime(arrivalMin % 1440),
      departureTime: formatTime(depMin % 1440),
      haltMinutes: halt,
      distanceKm: currDist,
      day,
      platform: String(1 + (i % 3)),
      isUserBoarding: false,
      isUserDestination: false
    });
  }

  // Destination stop
  const finalMin = startMinute + totalTravelMins;
  const finalDay = Math.floor(finalMin / 1440) + 1;

  stops.push({
    stopNumber: numStops,
    stationCode: pnrData.toStationCode,
    stationName: pnrData.toStationName,
    arrivalTime: formatTime(finalMin % 1440),
    departureTime: 'Destination',
    haltMinutes: 0,
    distanceKm: totalDist,
    day: finalDay,
    platform: '1',
    isUserDestination: true
  });

  const hours = Math.floor(totalTravelMins / 60);
  const mins = totalTravelMins % 60;

  return {
    trainNumber: pnrData.trainNumber,
    trainName: pnrData.trainName,
    trainType: 'Express',
    originStation: pnrData.fromStationName,
    destinationStation: pnrData.toStationName,
    departureTime: formatTime(startMinute % 1440),
    arrivalTime: formatTime(finalMin % 1440),
    duration: `${hours}h ${mins}m`,
    totalDistanceKm: totalDist,
    averageSpeedKmph: avgSpeed,
    runsOnDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pantryAvailable: true,
    totalStopsCount: stops.length,
    stops
  };
}

function formatTime(totalMinutes: number): string {
  const m = Math.floor(totalMinutes % 60);
  const h = Math.floor((totalMinutes / 60) % 24);
  const hh = h < 10 ? `0${h}` : `${h}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${hh}:${mm}`;
}
