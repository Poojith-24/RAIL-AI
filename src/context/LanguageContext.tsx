import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'ta';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Header & Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.howItWorks': 'How it Works',
    'brand.subtitle': 'PNR Status Prediction',
    'lang.select': 'Language',
    'lang.english': 'English',
    'lang.hindi': 'हिन्दी',
    'lang.tamil': 'தமிழ்',

    // Page 1 Home
    'hero.badge': 'Indian Railways ML Waitlist Engine',
    'hero.title': 'Indian Railway PNR Confirmation Prediction',
    'hero.subtitle': 'Enter your 10-digit Indian Railways PNR number to get instant probabilistic waitlist confirmation chances, PRS velocity analysis, and station route schedules.',
    'input.label': 'Enter your PNR Number',
    'input.placeholder': 'Enter 10 digit PNR number',
    'input.button': 'Predict Now',
    'input.analyzing': 'Analyzing Historical Data...',
    'home.aiPowered': 'AI Powered',
    'home.aiPoweredSub': 'Smart ML Model',
    'home.historicalData': 'Historical Data',
    'home.historicalDataSub': 'Past Journey Analysis',
    'home.highAccuracy': 'High Accuracy',
    'home.highAccuracySub': 'Better Predictions',

    // Page 2 Header & Journey Card
    'result.back': 'Back',
    'result.headerTitle': 'Prediction Result',
    'result.pnrLabel': 'PNR',
    'result.fromStation': 'From Station',
    'result.toStation': 'To Station',
    'result.boarding': 'Boarding',
    'result.class': 'Class',
    'result.quota': 'Quota',
    'result.departure': 'Dep',
    'result.distanceKm': 'km',

    // Card 1: Overview
    'result.card1Badge': 'CARD 1: AI PREDICTION OVERVIEW',
    'result.cnfProb': 'AI Confirmation Probability',
    'result.cnfOdds': 'CONFIRMATION ODDS',
    'result.high': 'HIGH',
    'result.medium': 'MEDIUM',
    'result.low': 'LOW',
    'result.likelyCnf': 'Likely to be Confirmed',
    'result.modCnf': 'Moderate Chance of Confirmation',
    'result.lowCnf': 'Low Confirmation Probability',
    'result.likelyCnfDesc': 'Based on historical data, tickets with similar waitlist numbers were confirmed.',
    'result.modCnfDesc': 'Based on historical churn, significant cancellations in the last 48 hours are required.',
    'result.lowCnfDesc': 'Based on historical retention and quota pool, waitlist clearance is improbable under normal conditions.',
    'result.currentStatus': 'Current Status',
    'result.prsRecord': 'Official PRS record',
    'result.chartStatus': 'Chart Status',
    'result.chartPrepared': 'Chart Prepared',
    'result.chartNotPrepared': 'Chart Not Prepared',
    'result.chartPending': 'Final chart pending',
    'result.checkAnother': 'Check Another PNR',
    'result.shareWhatsApp': 'Share on WhatsApp',
    'result.copyDetails': 'Copy PNR Details',
    'result.copied': 'Copied to Clipboard!',
    'result.keyFactors': 'Key Prediction Factors',
    'result.routeClearance': 'Historical Route Clearance',
    'result.daysUntilJourney': 'Days Until Journey',
    'result.daysRemaining': 'days remaining',
    'result.travelDemand': 'Sector Travel Demand',
    'result.modelConfidence': 'Model Confidence Level',

    // Card 2: Status Clarification
    'result.card2Badge': 'CARD 2: STATUS CLARIFICATION (PRS vs AI PROJECTION)',
    'result.statusClarTitle': 'Status Clarification: Current vs Projected Outcome',
    'result.statusClarSubtitle': 'Official Railway PRS status versus probabilistic final chart outcome.',
    'result.currentPrsStatus': 'Current PRS Booking Status',
    'result.activeOnPrs': 'Active on official railway server',
    'result.initialBooking': 'Initial booking',
    'result.projectedOutcome': 'Projected Chart Outcome',
    'result.expectedAtChart': 'Expected upon chart preparation',
    'result.projectedCnf': 'Projected: Confirmed (CNF / RAC)',
    'result.projectedRac': 'Projected: RAC / Borderline WL',
    'result.projectedWl': 'Projected: Remains Waitlisted (WL)',
    'result.importantInfo': 'Important Information & Explanation:',
    'result.explanation1': 'Derived from historical churn rates, days until departure, class quotas, and last-minute cancellation surges on train',
    'result.explanation2': 'Disclaimer: This is an informational estimation to assist your travel planning. It is not an official guarantee of berth allocation.',

    // Card 3: Booking Details
    'result.card3Badge': 'CARD 3: BOOKING DETAILS',
    'result.bookingDetailsTitle': 'Booking Details',
    'result.bookingDetailsSubtitle': 'Verified credentials recorded on official railway chart.',
    'result.trainNumberName': 'Train Number & Name',
    'result.journeyDate': 'Journey Date',
    'result.bookingDate': 'Booking Date',
    'result.travelClass': 'Travel Class',
    'result.reservationQuota': 'Reservation Quota',
    'result.chartPrepStatus': 'Chart Preparation Status',
    'result.expectedDepTime': 'Expected Departure Time',
    'result.totalDistance': 'Total Journey Distance',

    // Train Schedule & Route
    'sched.title': 'Train Schedule & Timing and Key Route & Stops',
    'sched.runsOn': 'Runs on:',
    'sched.avgSpeed': 'Avg Speed:',
    'sched.duration': 'Duration:',
    'sched.pantry': 'Pantry:',
    'sched.available': 'Available',
    'sched.notAvailable': 'Not Available',
    'sched.stopsRoute': 'Stops on Route',
    'sched.showing': 'Showing',
    'sched.of': 'of',
    'sched.stops': 'stops',
    'sched.showAll': 'Show all stops',
    'sched.showFewer': 'Show fewer stops',
    'sched.halt': 'Halt',
    'sched.mins': 'mins',
    'sched.source': 'Source',
    'sched.destination': 'Destination',
    'sched.platform': 'Platform',
    'sched.day': 'Day',
    'sched.boardingStation': 'Boarding Station',
    'sched.destStation': 'Destination Station',

    // Historical Route Trends
    'trends.title': 'Historical Confirmation Trends for This Route',
    'trends.observations': 'verified PRS observations on this corridor',
    'trends.sectorClearance': 'Sector Clearance Rate',
    'trends.velocity': 'Cancellation Velocity',
    'trends.peakWindow': 'Peak Cancellation Window',
    'trends.dayTrends': 'Waitlist Clearance by Day of Week',
    'trends.today': 'TODAY',
    'trends.classBenchmarks': 'Class Benchmarks on Train',
    'trends.insights': 'Historical Insights & AI Observations',

    // Card 4: Past Departures
    'result.card4Badge': 'CARD 4: HISTORICAL ANALYSIS (SAME TRAIN)',
    'result.pastAnalysisTitle': 'Historical Analysis (Same Train Past Departures)',
    'result.pastAnalysisSubtitle': 'Outcome of tickets with similar waitlist positions across recent departures on train',
    'result.recentDepartures': 'Recent Journey Departures',
    'result.colDate': 'Journey Date',
    'result.colInitialWl': 'Initial WL',
    'result.colOutcome': 'Chart Outcome',
    'result.colStatus': 'Final Status',
    'result.noteDisclaimer': 'Prediction is based on historical data and AI analysis. Actual confirmation may vary depending on official railway chart preparation.',

    // Alerts
    'alerts.title': 'Real-Time PNR Status Alerts',
    'alerts.subtitle': 'Instant Email or SMS notification whenever your waitlist position advances or confirms.',
    'alerts.on': 'Alerts ON',
    'alerts.off': 'Alerts OFF',
    'alerts.active': 'Active',
    'alerts.paused': 'Paused',
    'alerts.channels': 'Notification Delivery Channels',
    'alerts.email': 'Email Alerts',
    'alerts.sms': 'SMS Alerts',
    'alerts.triggers': 'Trigger Conditions',
    'alerts.trigWl': 'When waitlist advances',
    'alerts.trigCnf': 'When ticket confirms/RAC',
    'alerts.trigChart': 'When chart is prepared',
    'alerts.testBtn': 'Send Test Alert',
    'alerts.sending': 'Sending Alert...',
    'alerts.history': 'Recent Alert Simulation History',
    'alerts.noHistory': 'No alerts triggered yet. Turn alerts ON to monitor this PNR.',

    // WhatsApp Banner
    'wa.title': 'Share this Prediction on WhatsApp',
    'wa.subtitle': 'Send route details, waitlist movement, and confirmation odds to your family or travel group.',
    'wa.button': 'Send via WhatsApp',

    // Modals
    'modal.close': 'Close',
    'modal.aboutTitle': 'About RailAI PNR Prediction',
    'modal.howItWorksTitle': 'How the Prediction Engine Works'
  },

  hi: {
    // Header & Nav
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.howItWorks': 'यह कैसे काम करता है',
    'brand.subtitle': 'पीएनआर स्थिति भविष्यवाणी',
    'lang.select': 'भाषा चुनें',
    'lang.english': 'English',
    'lang.hindi': 'हिन्दी',
    'lang.tamil': 'தமிழ்',

    // Page 1 Home
    'hero.badge': 'भारतीय रेल मशीन लर्निंग वेटलिस्ट इंजन',
    'hero.title': 'भारतीय रेल पीएनआर पुष्टि की सटीक भविष्यवाणी',
    'hero.subtitle': 'अपनी 10-अंकों की पीएनआर संख्या दर्ज करें और ऐतिहासिक डेटा, पीआरएस वेटलिस्ट रुझान और कन्फर्मेशन की संभावना तुरंत देखें।',
    'input.label': 'अपना पीएनआर नंबर दर्ज करें',
    'input.placeholder': '10 अंकों का पीएनआर नंबर दर्ज करें',
    'input.button': 'भविष्यवाणी देखें',
    'input.analyzing': 'ऐतिहासिक डेटा का विश्लेषण हो रहा है...',
    'home.aiPowered': 'एआई संचालित',
    'home.aiPoweredSub': 'स्मार्ट एमएल मॉडल',
    'home.historicalData': 'ऐतिहासिक डेटा',
    'home.historicalDataSub': 'पिछली यात्राओं का विश्लेषण',
    'home.highAccuracy': 'सटीक परिणाम',
    'home.highAccuracySub': 'बेहतर भविष्यवाणी',

    // Page 2 Header & Journey Card
    'result.back': 'वापस जाएं',
    'result.headerTitle': 'भविष्यवाणी परिणाम',
    'result.pnrLabel': 'पीएनआर',
    'result.fromStation': 'प्रारंभिक स्टेशन',
    'result.toStation': 'गंतव्य स्टेशन',
    'result.boarding': 'बोर्डिंग',
    'result.class': 'श्रेणी',
    'result.quota': 'कोटा',
    'result.departure': 'प्रस्थान',
    'result.distanceKm': 'किमी',

    // Card 1: Overview
    'result.card1Badge': 'कार्ड 1: एआई भविष्यवाणी अवलोकन',
    'result.cnfProb': 'एआई कन्फर्मेशन संभावना',
    'result.cnfOdds': 'पुष्टि की संभावना',
    'result.high': 'उच्च (HIGH)',
    'result.medium': 'मध्यम (MEDIUM)',
    'result.low': 'कम (LOW)',
    'result.likelyCnf': 'कन्फर्म होने की प्रबल संभावना',
    'result.modCnf': 'कन्फर्म होने की मध्यम संभावना',
    'result.lowCnf': 'कन्फर्म होने की कम संभावना',
    'result.likelyCnfDesc': 'ऐतिहासिक डेटा के आधार पर, समान वेटलिस्ट नंबर वाले टिकट चार्ट तैयार होने तक कन्फर्म हो गए थे।',
    'result.modCnfDesc': 'ऐतिहासिक पैटर्न के अनुसार, अंतिम 48 घंटों में पर्याप्त रद्दीकरण (कैंसिलेशन) आवश्यक है।',
    'result.lowCnfDesc': 'सीटों की कम उपलब्धता और अधिक मांग के कारण सामान्य परिस्थितियों में वेटलिस्ट क्लियर होना कठिन है।',
    'result.currentStatus': 'वर्तमान स्थिति',
    'result.prsRecord': 'आधिकारिक पीआरएस रिकॉर्ड',
    'result.chartStatus': 'चार्ट स्थिति',
    'result.chartPrepared': 'चार्ट तैयार है',
    'result.chartNotPrepared': 'चार्ट अभी तैयार नहीं हुआ',
    'result.chartPending': 'अंतिम चार्ट प्रतीक्षारत',
    'result.checkAnother': 'अन्य पीएनआर जांचें',
    'result.shareWhatsApp': 'व्हाट्सएप पर साझा करें',
    'result.copyDetails': 'पीएनआर विवरण कॉपी करें',
    'result.copied': 'कॉपी हो गया!',
    'result.keyFactors': 'प्रमुख भविष्यवाणी कारक',
    'result.routeClearance': 'रूट पर ऐतिहासिक क्लीयरेंस दर',
    'result.daysUntilJourney': 'यात्रा के शेष दिन',
    'result.daysRemaining': 'दिन शेष',
    'result.travelDemand': 'मार्ग पर यात्रा की मांग',
    'result.modelConfidence': 'मॉडल विश्वास स्तर',

    // Card 2: Status Clarification
    'result.card2Badge': 'कार्ड 2: स्थिति स्पष्टीकरण (पीआरएस बनाम एआई अनुमान)',
    'result.statusClarTitle': 'स्थिति स्पष्टीकरण: वर्तमान स्थिति बनाम प्रत्याशित परिणाम',
    'result.statusClarSubtitle': 'रेलवे का आधिकारिक पीआरएस रिकॉर्ड बनाम अंतिम चार्ट बनने पर अनुमानित स्थिति।',
    'result.currentPrsStatus': 'वर्तमान पीआरएस बुकिंग स्थिति',
    'result.activeOnPrs': 'आधिकारिक रेलवे सर्वर पर सक्रिय',
    'result.initialBooking': 'प्रारंभिक बुकिंग',
    'result.projectedOutcome': 'अनुमानित चार्ट परिणाम',
    'result.expectedAtChart': 'चार्ट तैयार होने पर अनुमानित',
    'result.projectedCnf': 'अनुमानित: कन्फर्म (CNF / RAC)',
    'result.projectedRac': 'अनुमानित: आरएसी / सीमांत वेटलिस्ट',
    'result.projectedWl': 'अनुमानित: वेटलिस्टेड (WL) रहेगा',
    'result.importantInfo': 'महत्वपूर्ण जानकारी एवं स्पष्टीकरण:',
    'result.explanation1': 'यह ट्रेन में रद्दीकरण दर, प्रस्थान के दिन, श्रेणी कोटा और अंतिम समय के टिकट कैंसिलेशन पर आधारित है:',
    'result.explanation2': 'अस्वीकरण: यह आपकी यात्रा योजना में सहायता के लिए एक सूचनात्मक अनुमान है, आधिकारिक बर्थ आवंटन की गारंटी नहीं।',

    // Card 3: Booking Details
    'result.card3Badge': 'कार्ड 3: बुकिंग विवरण',
    'result.bookingDetailsTitle': 'बुकिंग विवरण',
    'result.bookingDetailsSubtitle': 'आधिकारिक रेलवे चार्ट पर दर्ज सत्यापित विवरण।',
    'result.trainNumberName': 'ट्रेन संख्या एवं नाम',
    'result.journeyDate': 'यात्रा की तिथि',
    'result.bookingDate': 'बुकिंग की तिथि',
    'result.travelClass': 'यात्रा श्रेणी (Class)',
    'result.reservationQuota': 'आरक्षण कोटा (Quota)',
    'result.chartPrepStatus': 'चार्ट तैयारी स्थिति',
    'result.expectedDepTime': 'प्रस्थान का अपेक्षित समय',
    'result.totalDistance': 'कुल यात्रा दूरी',

    // Train Schedule & Route
    'sched.title': 'ट्रेन समय सारिणी और प्रमुख रूट व स्टेशन ठहराव',
    'sched.runsOn': 'चलने के दिन:',
    'sched.avgSpeed': 'औसत गति:',
    'sched.duration': 'कुल समय:',
    'sched.pantry': 'पैंट्री (भोजन):',
    'sched.available': 'उपलब्ध',
    'sched.notAvailable': 'उपलब्ध नहीं',
    'sched.stopsRoute': 'मार्ग के ठहराव',
    'sched.showing': 'दिखाए जा रहे हैं',
    'sched.of': 'में से',
    'sched.stops': 'स्टेशन',
    'sched.showAll': 'सभी ठहराव देखें',
    'sched.showFewer': 'कम ठहराव देखें',
    'sched.halt': 'ठहराव',
    'sched.mins': 'मिनट',
    'sched.source': 'प्रारंभ',
    'sched.destination': 'गंतव्य',
    'sched.platform': 'प्लेटफ़ॉर्म',
    'sched.day': 'दिन',
    'sched.boardingStation': 'बोर्डिंग स्टेशन',
    'sched.destStation': 'गंतव्य स्टेशन',

    // Historical Route Trends
    'trends.title': 'इस रूट के लिए ऐतिहासिक पुष्टि रुझान',
    'trends.observations': 'इस कॉरिडोर पर सत्यापित पीआरएस डेटा',
    'trends.sectorClearance': 'सेक्टर क्लीयरेंस दर',
    'trends.velocity': 'कैंसिलेशन गति',
    'trends.peakWindow': 'उच्चतम कैंसिलेशन समय',
    'trends.dayTrends': 'सप्ताह के दिनों के अनुसार क्लीयरेंस',
    'trends.today': 'आज',
    'trends.classBenchmarks': 'ट्रेन की श्रेणियों के अनुसार बेंचमार्क',
    'trends.insights': 'ऐतिहासिक अंतर्दृष्टि एवं एआई टिप्पणियां',

    // Card 4: Past Departures
    'result.card4Badge': 'कार्ड 4: ऐतिहासिक विश्लेषण (इसी ट्रेन की पिछली यात्राएं)',
    'result.pastAnalysisTitle': 'ऐतिहासिक विश्लेषण (पिछली यात्राएं)',
    'result.pastAnalysisSubtitle': 'समान वेटलिस्ट वाले टिकटों का पिछली यात्राओं में चार्ट बनने पर परिणाम:',
    'result.recentDepartures': 'हाल की पिछली यात्राएं',
    'result.colDate': 'यात्रा तिथि',
    'result.colInitialWl': 'शुरुआती WL',
    'result.colOutcome': 'चार्ट परिणाम',
    'result.colStatus': 'अंतिम स्थिति',
    'result.noteDisclaimer': 'भविष्यवाणी ऐतिहासिक डेटा और मशीन लर्निंग पर आधारित है। वास्तविक पुष्टि आधिकारिक चार्ट बनने पर निर्भर करती है।',

    // Alerts
    'alerts.title': 'रीयल-टाइम पीएनआर स्थिति अलर्ट',
    'alerts.subtitle': 'वेटलिस्ट स्थिति में सुधार या सीट कन्फर्म होते ही तुरंत ईमेल या एसएमएस प्राप्त करें।',
    'alerts.on': 'अलर्ट चालू',
    'alerts.off': 'अलर्ट बंद',
    'alerts.active': 'सक्रिय',
    'alerts.paused': 'रोका गया',
    'alerts.channels': 'अधिसूचना वितरण माध्यम',
    'alerts.email': 'ईमेल अलर्ट',
    'alerts.sms': 'एसएमएस अलर्ट',
    'alerts.triggers': 'अलर्ट ट्रिगर शर्तें',
    'alerts.trigWl': 'जब वेटलिस्ट आगे बढ़े',
    'alerts.trigCnf': 'जब टिकट कन्फर्म / आरएसी हो जाए',
    'alerts.trigChart': 'जब चार्ट तैयार हो जाए',
    'alerts.testBtn': 'टेस्ट अलर्ट भेजें',
    'alerts.sending': 'अलर्ट भेजा जा रहा है...',
    'alerts.history': 'हालिया अलर्ट सिमुलेशन इतिहास',
    'alerts.noHistory': 'अभी तक कोई अलर्ट ट्रिगर नहीं हुआ। निगरानी के लिए अलर्ट चालू करें।',

    // WhatsApp Banner
    'wa.title': 'व्हाट्सएप पर यह भविष्यवाणी साझा करें',
    'wa.subtitle': 'मार्ग का विवरण, वेटलिस्ट गतिविधि और कन्फर्मेशन की संभावना अपने परिवार या मित्रों को भेजें।',
    'wa.button': 'व्हाट्सएप पर भेजें',

    // Modals
    'modal.close': 'बंद करें',
    'modal.aboutTitle': 'RailAI पीएनआर भविष्यवाणी के बारे में',
    'modal.howItWorksTitle': 'भविष्यवाणी इंजन कैसे काम करता है'
  },

  ta: {
    // Header & Nav
    'nav.home': 'முகப்பு',
    'nav.about': 'எங்களை பற்றி',
    'nav.howItWorks': 'செயல்படும் முறை',
    'brand.subtitle': 'PNR நிலை கணிப்பு',
    'lang.select': 'மொழியைத் தேர்ந்தெடுக்கவும்',
    'lang.english': 'English',
    'lang.hindi': 'हिन्दी',
    'lang.tamil': 'தமிழ்',

    // Page 1 Home
    'hero.badge': 'இந்திய ரயில்வே ML காத்திருப்புப் பட்டியல் கணிப்பான்',
    'hero.title': 'இந்திய ரயில்வே PNR உறுதிப்படுத்தல் கணிப்பு',
    'hero.subtitle': 'உங்கள் 10 இலக்க PNR எண்ணை உள்ளிட்டு, முந்தைய தரவுகள் மற்றும் PRS பகுப்பாய்வு மூலம் டிக்கெட் உறுதிப்படுத்தல் வாய்ப்புகளை உடனுக்குடன் பெறுங்கள்.',
    'input.label': 'உங்கள் PNR எண்ணை உள்ளிடவும்',
    'input.placeholder': '10 இலக்க PNR எண்ணை உள்ளிடவும்',
    'input.button': 'இப்போதே கணிக்கவும்',
    'input.analyzing': 'முந்தைய தரவுகள் ஆய்வு செய்யப்படுகின்றன...',
    'home.aiPowered': 'AI இயங்குதளம்',
    'home.aiPoweredSub': 'ஸ்மார்ட் ML மாதிரி',
    'home.historicalData': 'வரலாற்றுத் தரவு',
    'home.historicalDataSub': 'முந்தைய பயணப் பகுப்பாய்வு',
    'home.highAccuracy': 'அதிதுல்லிய கணிப்பு',
    'home.highAccuracySub': 'நம்பகமான கணிப்புகள்',

    // Page 2 Header & Journey Card
    'result.back': 'திரும்பு',
    'result.headerTitle': 'கணிப்பு முடிவு',
    'result.pnrLabel': 'PNR',
    'result.fromStation': 'புறப்படும் நிலையம்',
    'result.toStation': 'சேரும் நிலையம்',
    'result.boarding': 'ஏறும் இடம்',
    'result.class': 'வகுப்பு',
    'result.quota': 'ஒதுக்கீடு',
    'result.departure': 'புறப்படும் நேரம்',
    'result.distanceKm': 'கி.மீ',

    // Card 1: Overview
    'result.card1Badge': 'அட்டை 1: AI கணிப்பு சுருக்கம்',
    'result.cnfProb': 'AI உறுதிப்படுத்தல் நிகழ்தகவு',
    'result.cnfOdds': 'உறுதிப்படுத்தல் வாய்ப்பு',
    'result.high': 'அதிக வாய்ப்பு (HIGH)',
    'result.medium': 'நடுத்தர வாய்ப்பு (MEDIUM)',
    'result.low': 'குறைந்த வாய்ப்பு (LOW)',
    'result.likelyCnf': 'உறுதிப்படுத்தப்பட அதிக வாய்ப்புள்ளது',
    'result.modCnf': 'உறுதிப்படுத்த மிதமான வாய்ப்பு',
    'result.lowCnf': 'உறுதிப்படுத்த குறைந்த வாய்ப்பு',
    'result.likelyCnfDesc': 'முந்தைய தரவுகளின்படி, இதே போன்ற காத்திருப்புப் பட்டியல் எண்கள் சார்ட் தயாரிக்கும் முன் உறுதி செய்யப்பட்டன.',
    'result.modCnfDesc': 'கடந்தகால மாற்றங்களின்படி, கடைசி 48 மணிநேரத்தில் குறிப்பிடத்தக்க டிக்கெட் ரத்துகள் தேவை.',
    'result.lowCnfDesc': 'அதிக தேவை மற்றும் குறைந்த ஒதுக்கீடு காரணமாக, சாதாரண நிலையில் காத்திருப்புப் பட்டியல் முடிவடைவது கடினம்.',
    'result.currentStatus': 'தற்போதைய நிலை',
    'result.prsRecord': 'அதிகாரப்பூர்வ PRS பதிவு',
    'result.chartStatus': 'சார்ட் நிலை',
    'result.chartPrepared': 'சார்ட் தயாராக உள்ளது',
    'result.chartNotPrepared': 'சார்ட் இன்னும் தயாராகவில்லை',
    'result.chartPending': 'இறுதி சார்ட் நிலுவையில் உள்ளது',
    'result.checkAnother': 'மற்றொரு PNR சரிபார்க்க',
    'result.shareWhatsApp': 'WhatsApp-ல் பகிரவும்',
    'result.copyDetails': 'PNR விவரங்களை நகலெடுக்கவும்',
    'result.copied': 'நகலெடுக்கப்பட்டது!',
    'result.keyFactors': 'முக்கிய கணிப்புக் காரணிகள்',
    'result.routeClearance': 'இந்த வழித்தடத்தின் வரலாற்று உறுதி விகிதம்',
    'result.daysUntilJourney': 'பயணத்திற்கு மீதமுள்ள நாட்கள்',
    'result.daysRemaining': 'நாட்கள் மீதம்',
    'result.travelDemand': 'வழித்தடப் பயணத் தேவை',
    'result.modelConfidence': 'மாதிரியின் துல்லிய நிலை',

    // Card 2: Status Clarification
    'result.card2Badge': 'அட்டை 2: நிலை விளக்கம் (PRS vs AI கணிப்பு)',
    'result.statusClarTitle': 'நிலை விளக்கம்: தற்போதைய நிலை vs கணிக்கப்பட்ட முடிவு',
    'result.statusClarSubtitle': 'ரயில்வேயின் அதிகாரப்பூர்வ PRS நிலை மற்றும் சார்ட் தயாரிப்பின் போது எதிர்பார்க்கப்படும் நிலை.',
    'result.currentPrsStatus': 'தற்போதைய PRS முன்பதிவு நிலை',
    'result.activeOnPrs': 'ரயில்வே சர்வரில் செயலில் உள்ளது',
    'result.initialBooking': 'தொடக்க முன்பதிவு',
    'result.projectedOutcome': 'கணிக்கப்பட்ட சார்ட் முடிவு',
    'result.expectedAtChart': 'சார்ட் தயாரிப்பின் போது எதிர்பார்க்கப்படுகிறது',
    'result.projectedCnf': 'கணிக்கப்பட்டது: உறுதி (CNF / RAC)',
    'result.projectedRac': 'கணிக்கப்பட்டது: RAC / விளிம்பு நிலை WL',
    'result.projectedWl': 'கணிக்கப்பட்டது: காத்திருப்பில் இருக்கும் (WL)',
    'result.importantInfo': 'முக்கியத் தகவல் & விளக்கம்:',
    'result.explanation1': 'ரத்து செய்யும் விகிதம், புறப்படுவதற்கு முந்தைய நாட்கள், வகுப்பு ஒதுக்கீடுகள் மற்றும் கடைசி நேர ரத்துகளை அடிப்படையாகக் கொண்டது:',
    'result.explanation2': 'மறுப்பு: இது உங்கள் பயணத் திட்டத்திற்கு உதவக்கூடிய தகவல் மதிப்பீடு மட்டுமே. அதிகாரப்பூர்வ பெர்த் ஒதுக்கீட்டிற்கு உத்தரவாதம் அல்ல.',

    // Card 3: Booking Details
    'result.card3Badge': 'அட்டை 3: முன்பதிவு விவரங்கள்',
    'result.bookingDetailsTitle': 'முன்பதிவு விவரங்கள்',
    'result.bookingDetailsSubtitle': 'அதிகாரப்பூர்வ ரயில்வே சார்ட்டில் பதிவுசெய்யப்பட்ட விவரங்கள்.',
    'result.trainNumberName': 'ரயில் எண் & பெயர்',
    'result.journeyDate': 'பயணத் தேதி',
    'result.bookingDate': 'முன்பதிவு தேதி',
    'result.travelClass': 'பயண வகுப்பு (Class)',
    'result.reservationQuota': 'ஒதுக்கீட்டு வகை (Quota)',
    'result.chartPrepStatus': 'சார்ட் தயாரிப்பு நிலை',
    'result.expectedDepTime': 'புறப்படும் எதிர்பார்க்கப்படும் நேரம்',
    'result.totalDistance': 'மொத்த பயண தூரம்',

    // Train Schedule & Route
    'sched.title': 'ரயில் கால அட்டவணை மற்றும் முக்கிய நிலையங்கள்',
    'sched.runsOn': 'இயங்கும் நாட்கள்:',
    'sched.avgSpeed': 'சராசரி வேகம்:',
    'sched.duration': 'பயண நேரம்:',
    'sched.pantry': 'உணவு வசதி (Pantry):',
    'sched.available': 'உள்ளது',
    'sched.notAvailable': 'இல்லை',
    'sched.stopsRoute': 'வழித்தட நிறுத்தங்கள்',
    'sched.showing': 'காண்பிக்கப்படுகிறது',
    'sched.of': 'மொத்தம்',
    'sched.stops': 'நிலையங்கள்',
    'sched.showAll': 'அனைத்து நிறுத்தங்களையும் காட்டு',
    'sched.showFewer': 'குறைந்த நிறுத்தங்களைக் காட்டு',
    'sched.halt': 'நிறுத்தம்',
    'sched.mins': 'நிமிடங்கள்',
    'sched.source': 'ஆரம்பம்',
    'sched.destination': 'முடிவு',
    'sched.platform': 'பிளாட்பாரம்',
    'sched.day': 'நாள்',
    'sched.boardingStation': 'ஏறும் நிலையம்',
    'sched.destStation': 'இறங்கும் நிலையம்',

    // Historical Route Trends
    'trends.title': 'இந்த வழித்தடத்திற்கான வரலாற்று உறுதிப்படுத்தல் போக்குகள்',
    'trends.observations': 'சரிபார்க்கப்பட்ட முந்தைய PRS பதிவுகள்',
    'trends.sectorClearance': 'பிரிவு உறுதிப்படுத்தல் விகிதம்',
    'trends.velocity': 'ரத்து செய்யும் வேகம்',
    'trends.peakWindow': 'அதிக ரத்து நிகழும் நேரம்',
    'trends.dayTrends': 'வார நாட்களில் உறுதிப்படுத்தல் விகிதம்',
    'trends.today': 'இன்று',
    'trends.classBenchmarks': 'ரயில் வகுப்புகள் வாரியான தரநிலைகள்',
    'trends.insights': 'வரலாற்று அவதானிப்புகள் & AI குறிப்புகள்',

    // Card 4: Past Departures
    'result.card4Badge': 'அட்டை 4: வரலாற்றுப் பகுப்பாய்வு (இதே ரயிலின் முந்தைய பயணங்கள்)',
    'result.pastAnalysisTitle': 'வரலாற்றுப் பகுப்பாய்வு (இதே ரயில்)',
    'result.pastAnalysisSubtitle': 'இதே ரயிலின் முந்தைய பயணங்களில் காத்திருப்புப் பட்டியல் உறுதி செய்யப்பட்ட வரலாறு:',
    'result.recentDepartures': 'சமீபத்திய முந்தைய பயணங்கள்',
    'result.colDate': 'பயணத் தேதி',
    'result.colInitialWl': 'தொடக்க WL',
    'result.colOutcome': 'சார்ட் முடிவு',
    'result.colStatus': 'இறுதி நிலை',
    'result.noteDisclaimer': 'கணிப்பு முந்தைய தரவுகள் மற்றும் AI பகுப்பாய்வை அடிப்படையாகக் கொண்டது. அதிகாரப்பூர்வ ரயில்வே சார்ட் தயாரிப்பைப் பொறுத்து மாறுபடலாம்.',

    // Alerts
    'alerts.title': 'நேரலை PNR நிலை எச்சரிக்கைகள்',
    'alerts.subtitle': 'காத்திருப்புப் பட்டியல் முன்னேறும்போது மின்னஞ்சல் அல்லது SMS மூலம் உடனடி அறிவிப்பு பெறுங்கள்.',
    'alerts.on': 'எச்சரிக்கை ஆன்',
    'alerts.off': 'எச்சரிக்கை ஆஃப்',
    'alerts.active': 'செயலில்',
    'alerts.paused': 'நிறுத்தப்பட்டது',
    'alerts.channels': 'அறிவிப்பு பெறும் வழிகள்',
    'alerts.email': 'மின்னஞ்சல் எச்சரிக்கை',
    'alerts.sms': 'SMS எச்சரிக்கை',
    'alerts.triggers': 'அறிவிப்புத் தூண்டுதல்கள்',
    'alerts.trigWl': 'காத்திருப்புப் பட்டியல் முன்னேறும்போது',
    'alerts.trigCnf': 'டிக்கெட் உறுதியாகும்போது / RAC மாறும்போது',
    'alerts.trigChart': 'சார்ட் தயாராகும்போது',
    'alerts.testBtn': 'சோதனை எச்சரிக்கை அனுப்புக',
    'alerts.sending': 'அனுப்பப்படுகிறது...',
    'alerts.history': 'சமீபத்திய உருவகப்படுத்துதல் வரலாறு',
    'alerts.noHistory': 'எச்சரிக்கைகள் எதுவும் இதுவரை தூண்டப்படவில்லை. எச்சரிக்கையை ஆன் செய்யவும்.',

    // WhatsApp Banner
    'wa.title': 'WhatsApp-ல் இந்தக் கணிப்பைப் பகிரவும்',
    'wa.subtitle': 'வழித்தட விவரங்கள், காத்திருப்புப் பட்டியல் இயக்கம் மற்றும் உறுதி வாய்ப்புகளை உங்கள் குடும்பத்தினருடன் பகிருங்கள்.',
    'wa.button': 'WhatsApp வழியாக அனுப்புக',

    // Modals
    'modal.close': 'மூடு',
    'modal.aboutTitle': 'RailAI PNR கணிப்பு பற்றி',
    'modal.howItWorksTitle': 'கணிப்பு இயந்திரம் எவ்வாறு செயல்படுகிறது'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('railai_preferred_language') as SupportedLanguage;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'ta')) {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage availability errors
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('railai_preferred_language', lang);
    } catch {
      // Ignore localStorage errors
    }
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || translations.en[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
