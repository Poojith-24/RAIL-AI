import React, { useState } from 'react';
import { PredictionResult } from '../types';
import { RouteHistoricalTrends } from './RouteHistoricalTrends';
import { TrainScheduleAndRoute } from './TrainScheduleAndRoute';
import { RealTimeNotificationToggle } from './RealTimeNotificationToggle';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  Share2,
  Ticket,
  BarChart2,
  Info,
  Check,
  Train,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  HelpCircle,
  MapPin,
  Copy
} from 'lucide-react';

interface Page2ResultProps {
  prediction: PredictionResult;
  onBack: () => void;
  onCheckAnother: () => void;
}

export const Page2Result: React.FC<Page2ResultProps> = ({
  prediction,
  onBack,
  onCheckAnother
}) => {
  const { t } = useLanguage();
  const { pnrData, probability, category, expectedStatus, sameTrainHistory } = prediction;
  const [copied, setCopied] = useState(false);

  // SVG Gauge Math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (Math.min(100, Math.max(0, probability)) / 100) * circumference;

  const isConfirmed = category === 'HIGH';
  const isMedium = category === 'MEDIUM';

  const gaugeColor = isConfirmed ? '#10B981' : isMedium ? '#F59E0B' : '#EF4444';
  const statusTitle = isConfirmed
    ? t('result.likelyCnf')
    : isMedium
    ? t('result.modCnf')
    : t('result.lowCnf');

  const statusDesc = isConfirmed
    ? t('result.likelyCnfDesc')
    : isMedium
    ? t('result.modCnfDesc')
    : t('result.lowCnfDesc');

  const p1 = pnrData.passengers[0];
  const bookingStatusDisplay = p1 ? p1.bookingStatus : 'WL';
  const currentStatusDisplay = p1 ? p1.currentStatus : 'WL';
  const chartStatusDisplay = pnrData.chartStatus === 'CHART_PREPARED' ? t('result.chartPrepared') : t('result.chartNotPrepared');

  // Projected Berth Outcome based on category
  const expectedOutcomeTitle = isConfirmed
    ? t('result.projectedCnf')
    : isMedium
    ? t('result.projectedRac')
    : t('result.projectedWl');

  const shareMessage = `🚆 *RailAI PNR Status & Prediction* 🚆
━━━━━━━━━━━━━━━━━━━━
🎫 *PNR Number:* ${pnrData.pnr}
🚂 *Train:* ${pnrData.trainNumber} - ${pnrData.trainName}
📍 *Route:* ${pnrData.fromStationName} (${pnrData.fromStationCode}) ➔ ${pnrData.toStationName} (${pnrData.toStationCode})
📅 *Date:* ${pnrData.journeyDate} | *Class:* ${pnrData.class} | *Quota:* ${pnrData.quota}

📊 *Current Status:* ${currentStatusDisplay}
🔮 *AI Confirmation Chance:* *${probability}%* (${isConfirmed ? 'High Possibility' : isMedium ? 'Medium Possibility' : 'Low Possibility'})
🎯 *Expected Outcome:* ${expectedStatus}
━━━━━━━━━━━━━━━━━━━━
Check live on RailAI`;

  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] text-slate-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link & Header Title */}
        <div className="relative pt-2 pb-1 text-center">
          <button
            onClick={onBack}
            className="absolute left-0 top-3 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('result.back')}</span>
          </button>

          {/* Decorative Confetti Bits */}
          <div className="hidden sm:block absolute right-8 top-1 w-2.5 h-2.5 bg-purple-400 rotate-45 rounded-xs opacity-75" />
          <div className="hidden sm:block absolute left-24 top-6 w-2 h-2 bg-amber-400 rotate-12 rounded-xs opacity-75" />
          <div className="hidden sm:block absolute right-24 top-7 w-2 h-2 bg-blue-400 rotate-45 rounded-xs opacity-75" />

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('result.headerTitle')}
          </h1>
          <div className="text-sm font-mono font-bold text-blue-600 mt-1">
            {t('result.pnrLabel')}: {pnrData.pnr}
          </div>
        </div>

        {/* Journey Route Card: From Station → To Station */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* From Station */}
            <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md inline-block mb-1">
                  {t('result.fromStation')}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {pnrData.fromStationCode}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-700">
                    {pnrData.fromStationName}
                  </span>
                </div>
                <span className="text-xs text-slate-500 block mt-0.5">
                  {t('result.boarding')}: <strong className="text-slate-700">{pnrData.boardingStationName || pnrData.fromStationName}</strong> ({pnrData.boardingStationCode || pnrData.fromStationCode})
                </span>
              </div>
            </div>

            {/* Connecting Route Graphic & Train Info */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 w-full md:w-auto my-2 md:my-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-2">
                <Train className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-mono font-bold text-indigo-900">{pnrData.trainNumber}</span>
                <span className="text-slate-300">•</span>
                <span className="truncate max-w-[180px] sm:max-w-[240px] text-slate-800">{pnrData.trainName}</span>
              </div>

              {/* Graphical Route Track */}
              <div className="w-full flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0" />
                <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 bg-white text-[10px] font-mono font-bold text-slate-600 border border-slate-200 rounded-full shadow-xs whitespace-nowrap">
                    {pnrData.distanceKm} {t('result.distanceKm')}
                  </span>
                </div>
                <span className="w-3 h-3 rounded-full bg-purple-600 ring-4 ring-purple-100 shrink-0" />
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                <span>{t('result.class')}: <strong className="text-slate-800 font-mono font-bold">{pnrData.class}</strong></span>
                <span className="text-slate-300">•</span>
                <span>{t('result.quota')}: <strong className="text-slate-800 font-semibold">{pnrData.quota}</strong></span>
                <span className="text-slate-300">•</span>
                <span>{t('result.departure')}: <strong className="text-slate-800 font-mono font-semibold">{pnrData.expectedDepartureTime}</strong></span>
              </div>
            </div>

            {/* To Station */}
            <div className="flex items-center gap-3.5 text-left md:text-right w-full md:w-auto md:flex-row-reverse">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md inline-block mb-1">
                  {t('result.toStation')}
                </span>
                <div className="flex items-baseline gap-2 md:justify-end">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {pnrData.toStationCode}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-700">
                    {pnrData.toStationName}
                  </span>
                </div>
                <span className="text-xs text-slate-500 block mt-0.5">
                  {t('result.toStation')}: <strong className="text-slate-700">{pnrData.destinationStationName || pnrData.toStationName}</strong> ({pnrData.destinationStationCode || pnrData.toStationCode})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 1: Prediction Probability & Quick Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Circular Progress Gauge */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="stroke-slate-100"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={gaugeColor}
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Gauge Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                  <span
                    className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono tabular-nums"
                    style={{ color: gaugeColor }}
                  >
                    {Math.round(probability)}%
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 mt-1 max-w-[120px] leading-tight">
                    {t('result.cnfProb')}
                  </span>
                  {/* Subtle Wave Graphic */}
                  <svg className="w-8 h-2 mt-1.5" viewBox="0 0 40 8" fill="none">
                    <path
                      d="M2 4C6 1 10 7 14 4C18 1 22 7 26 4C30 1 34 7 38 4"
                      stroke={gaugeColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column: Status Banner, Primary Metrics & Buttons */}
            <div className="md:col-span-7 space-y-4">
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isConfirmed
                  ? 'bg-emerald-50/80 border-emerald-200/90 text-emerald-900'
                  : isMedium
                  ? 'bg-amber-50/80 border-amber-200/90 text-amber-900'
                  : 'bg-rose-50/80 border-rose-200/90 text-rose-900'
              }`}>
                {isConfirmed ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {statusTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {statusDesc}
                  </p>
                </div>
              </div>

              {/* Status Mini Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/80">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      {t('result.currentStatus')}
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-amber-700 font-mono block">
                    {currentStatusDisplay}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {t('result.prsRecord')}
                  </span>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/80">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">
                      {t('result.chartStatus')}
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-slate-800 block">
                    {chartStatusDisplay}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {t('result.chartPending')}
                  </span>
                </div>
              </div>

              {/* Actions Row: Check Another, Share to WhatsApp, Copy Details */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={onCheckAnother}
                  className="w-full sm:w-auto px-4 h-11 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('result.checkAnother')}</span>
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 h-11 px-4 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>{t('result.shareWhatsApp')}</span>
                </a>

                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-4 h-11 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  title="Copy formatted message"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? t('result.copied') : t('result.copyDetails')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ENHANCEMENT: Explicit Distinction Card Between 'Current Booking Status' & 'Expected Status' */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('result.statusClarTitle')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('result.statusClarSubtitle')}
                </p>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
              Model: GradientBoosted-RailEnsemble v1.4
            </div>
          </div>

          {/* Visual Progression Step Bar */}
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-3">
              {t('result.card2Badge')}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              {/* Step 1: Initial Booking */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  1. {t('result.initialBooking')}
                </span>
                <span className="text-base font-bold text-slate-700 font-mono mt-0.5 block">
                  {bookingStatusDisplay}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {t('result.prsRecord')}
                </span>
              </div>

              {/* Step 2: Current Status */}
              <div className="bg-amber-50/80 p-3 rounded-xl border-2 border-amber-300 shadow-2xs relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  2. {t('result.currentPrsStatus')}
                </span>
                <span className="text-base font-bold text-amber-700 font-mono mt-0.5 block">
                  {currentStatusDisplay}
                </span>
                <span className="text-[11px] text-amber-900/80 block mt-0.5 font-medium">
                  {t('result.activeOnPrs')}
                </span>
              </div>

              {/* Step 3: Expected Status */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-xl border-2 border-indigo-300 shadow-2xs relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  3. {t('result.projectedOutcome')}
                </span>
                <span className={`text-base font-bold font-mono mt-0.5 block ${
                  isConfirmed ? 'text-emerald-700' : isMedium ? 'text-indigo-700' : 'text-rose-700'
                }`}>
                  {expectedOutcomeTitle}
                </span>
                <span className="text-[11px] text-indigo-950/80 block mt-0.5 font-medium">
                  {t('result.expectedAtChart')} (~{Math.round(probability)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Two-Column Deep Transparency Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column A: Current Booking Status */}
            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    PRS
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {t('result.currentPrsStatus')}
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                  {t('result.prsRecord')}
                </span>
              </div>

              <div className="pt-1">
                <div className="text-xl font-bold font-mono text-amber-700">
                  {currentStatusDisplay}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {t('result.initialBooking')}: <span className="font-semibold text-slate-700">{bookingStatusDisplay}</span>
                  {p1 && p1.bookingPosition && p1.currentPosition && p1.bookingPosition > p1.currentPosition && (
                    <span className="ml-1.5 text-emerald-600 font-semibold inline-flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      Moved {p1.bookingPosition - p1.currentPosition} spots
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-t border-amber-200/60 pt-3">
                <p>
                  <strong>{t('result.importantInfo')}</strong> {t('result.activeOnPrs')}
                </p>
              </div>
            </div>

            {/* Column B: Expected Status (AI Model) */}
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    AI
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {t('result.projectedOutcome')}
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md border border-indigo-200">
                  {t('result.expectedAtChart')}
                </span>
              </div>

              <div className="pt-1">
                <div className={`text-xl font-bold font-mono ${
                  isConfirmed ? 'text-emerald-700' : isMedium ? 'text-indigo-700' : 'text-rose-700'
                }`}>
                  {expectedOutcomeTitle}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  {expectedStatus}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-t border-indigo-200/60 pt-3">
                <p className="text-[11px] text-slate-500">
                  • {t('result.explanation1')} {pnrData.trainNumber}.
                  <br />
                  • <em>{t('result.explanation2')}</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Booking Details */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t('result.bookingDetailsTitle')}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-xs relative z-10">
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.fromStation')}</span>
              <span className="font-bold text-slate-900 block truncate">
                {pnrData.fromStationName} <span className="font-mono text-blue-600 font-bold">({pnrData.fromStationCode})</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.toStation')}</span>
              <span className="font-bold text-slate-900 block truncate">
                {pnrData.toStationName} <span className="font-mono text-purple-600 font-bold">({pnrData.toStationCode})</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.trainNumberName')}</span>
              <span className="font-bold text-slate-900 block truncate">
                <span className="font-mono text-indigo-700">{pnrData.trainNumber}</span> - {pnrData.trainName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.quota')}</span>
              <span className="font-bold text-slate-900 uppercase">
                {pnrData.quota === 'GN' ? 'GENERAL (GN)' : pnrData.quota === 'TQ' ? 'TATKAL (TQ)' : pnrData.quota}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">{t('sched.boardingStation')}</span>
              <span className="font-bold text-slate-900 block truncate">
                {pnrData.boardingStationName || pnrData.fromStationName} <span className="font-mono text-slate-500">({pnrData.boardingStationCode || pnrData.fromStationCode})</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('sched.destStation')}</span>
              <span className="font-bold text-slate-900 block truncate">
                {pnrData.destinationStationName || pnrData.toStationName} <span className="font-mono text-slate-500">({pnrData.destinationStationCode || pnrData.toStationCode})</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.travelClass')}</span>
              <span className="font-bold text-slate-900 font-mono">{pnrData.class}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.totalDistance')}</span>
              <span className="font-bold text-slate-900 font-mono">{pnrData.distanceKm} {t('result.distanceKm')}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.bookingDate')}</span>
              <span className="font-bold text-slate-900 font-mono">
                {new Date(pnrData.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.journeyDate')}</span>
              <span className="font-bold text-slate-900 font-mono">
                {new Date(pnrData.journeyDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.expectedDepTime')}</span>
              <span className="font-bold text-slate-900 font-mono">{pnrData.expectedDepartureTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t('result.chartPrepStatus')}</span>
              <span className="font-bold text-slate-900">{chartStatusDisplay}</span>
            </div>
          </div>

          {/* Train Illustration Watermark on Bottom Right */}
          <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none hidden sm:block">
            <Train className="w-28 h-28 text-indigo-900" />
          </div>
        </div>

        {/* Train Schedule & Timing and Key Route & Stops */}
        {prediction.schedule && (
          <TrainScheduleAndRoute
            schedule={prediction.schedule}
            boardingStationCode={pnrData.boardingStationCode || pnrData.fromStationCode}
            destinationStationCode={pnrData.destinationStationCode || pnrData.toStationCode}
          />
        )}

        {/* NEW SECTION: Historical Confirmation Probability Trends for this Specific Train Route */}
        {prediction.routeTrends && (
          <RouteHistoricalTrends
            routeTrends={prediction.routeTrends}
            currentPnrNumber={pnrData.pnr}
          />
        )}

        {/* Card 4: Historical Analysis (Same Train) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t('result.pastAnalysisTitle')}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-medium text-[11px]">
                  <th className="py-2.5 px-3">{t('result.colDate')}</th>
                  <th className="py-2.5 px-3">{t('result.colInitialWl')}</th>
                  <th className="py-2.5 px-3">{t('result.colOutcome')}</th>
                  <th className="py-2.5 px-3">WL Movement</th>
                  <th className="py-2.5 px-3">{t('result.currentStatus')}</th>
                  <th className="py-2.5 px-3 text-right">{t('result.colStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(sameTrainHistory && sameTrainHistory.length > 0 ? sameTrainHistory : [
                  { journeyDate: '21 May 2025', wlStartedFrom: 'WL120', finalConfirmedWl: 'WL68', wlMovement: 52, yourWl: currentStatusDisplay, result: 'CONFIRMED' as const },
                  { journeyDate: '14 May 2025', wlStartedFrom: 'WL95', finalConfirmedWl: 'WL60', wlMovement: 35, yourWl: currentStatusDisplay, result: 'CONFIRMED' as const },
                  { journeyDate: '07 May 2025', wlStartedFrom: 'WL110', finalConfirmedWl: 'WL72', wlMovement: 38, yourWl: currentStatusDisplay, result: 'CONFIRMED' as const },
                  { journeyDate: '30 Apr 2025', wlStartedFrom: 'WL130', finalConfirmedWl: 'WL75', wlMovement: 55, yourWl: currentStatusDisplay, result: 'CONFIRMED' as const },
                  { journeyDate: '23 Apr 2025', wlStartedFrom: 'WL105', finalConfirmedWl: 'WL65', wlMovement: 40, yourWl: currentStatusDisplay, result: 'CONFIRMED' as const }
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {row.journeyDate}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {row.wlStartedFrom}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {row.finalConfirmedWl}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                      ↓ {row.wlMovement}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {row.yourWl}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.result === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.result === 'CONFIRMED' && <Check className="w-3 h-3 stroke-[3]" />}
                        {row.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Disclaimer Notice */}
          <div className="mt-5 p-3 rounded-xl bg-purple-50/80 border border-purple-100 text-xs text-purple-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              <strong>Note:</strong> {t('result.noteDisclaimer')}
            </span>
          </div>
        </div>

        {/* Real-Time Notification Alerts Toggle & Preferences (Last section of Page 2) */}
        <RealTimeNotificationToggle
          pnr={pnrData.pnr}
          trainName={pnrData.trainName}
          currentStatus={currentStatusDisplay}
        />

        {/* WhatsApp Sharing Banner Card */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-3xl p-5 sm:p-6 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {t('wa.title')}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {t('wa.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 h-11 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>{t('wa.button')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="text-center pt-4 pb-8">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold block mb-2">
            PAGE 2 OF 2
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/50" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
