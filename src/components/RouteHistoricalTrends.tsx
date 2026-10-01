import React from 'react';
import { RouteHistoricalTrend } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Clock,
  Calendar,
  Layers,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface RouteHistoricalTrendsProps {
  routeTrends: RouteHistoricalTrend;
  currentPnrNumber: string;
}

export const RouteHistoricalTrends: React.FC<RouteHistoricalTrendsProps> = ({
  routeTrends,
  currentPnrNumber
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {t('trends.title')}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                ROUTE SPECIFIC
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical confirmation patterns for{' '}
              <strong className="text-slate-700">{routeTrends.fromStationName} ({routeTrends.fromStationCode})</strong>{' '}
              ➔{' '}
              <strong className="text-slate-700">{routeTrends.toStationName} ({routeTrends.toStationCode})</strong>{' '}
              on Train {routeTrends.trainNumber} ({routeTrends.trainName})
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 self-start sm:self-auto shrink-0">
          <span className="text-slate-400">Sample size:</span>{' '}
          <strong className="text-slate-800 font-bold">{routeTrends.totalPastObservations.toLocaleString()}</strong> past PNRs
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 text-left">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            {t('trends.sectorClearance')}
          </span>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {routeTrends.overallRouteConfirmationRate}%
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Historical sector average
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 text-left">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            {t('trends.velocity')}
          </span>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            +{routeTrends.avgVelocityPerDay}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Seats cleared / day in final 72h
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/80 text-left">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {t('trends.peakWindow')}
          </span>
          <div className="text-base sm:text-lg font-bold text-amber-800 truncate">
            {routeTrends.peakChurnWindowHours}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Maximum cancellations occur
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/80 text-left">
          <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            Verified Records
          </span>
          <div className="text-2xl font-black text-purple-700 font-mono">
            {routeTrends.totalPastObservations}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Past journeys analyzed
          </span>
        </div>
      </div>

      {/* Timeline Progression Bar Chart (Days Before Journey vs Odds) */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              Confirmation Probability Progression Over Time (Journey Trajectory)
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              How waitlist tickets historically improve on this route as departure nears
            </p>
          </div>
          <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
            Highlighted = Your Current Stage
          </span>
        </div>

        <div className="space-y-3">
          {routeTrends.timelineTrends.map((t, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl transition-all ${
                t.isCurrentStage
                  ? 'bg-white border-2 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white/60 border border-slate-200/70 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${t.isCurrentStage ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>
                    {t.stage}
                  </span>
                  {t.isCurrentStage && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white animate-pulse">
                      📍 Your PNR Stage
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Activity: <strong className="text-slate-700">{t.cancellationActivity}</strong>
                  </span>
                  <span className="font-mono font-bold text-indigo-700 text-sm">
                    {t.confirmationProbability}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    t.isCurrentStage
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500'
                      : t.confirmationProbability >= 75
                      ? 'bg-emerald-500'
                      : t.confirmationProbability >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-400'
                  }`}
                  style={{ width: `${t.confirmationProbability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Day of Week Trends + Class Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Column 1: Day of Week Route Clearance Rates */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" />
              Day-of-Week Clearance Rates on this Route
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Historical confirmation rate by journey day. Mid-week departures typically have lower demand and higher clearance odds.
          </p>

          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {routeTrends.dayOfWeekTrends.map((d, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl text-center flex flex-col justify-between transition-all ${
                  d.isJourneyDay
                    ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-600/30 shadow-md'
                    : 'bg-slate-50 border border-slate-200 text-slate-700'
                }`}
              >
                <span className={`text-[10px] uppercase font-bold block ${d.isJourneyDay ? 'text-purple-100' : 'text-slate-400'}`}>
                  {d.day}
                </span>
                <span className="font-mono text-xs sm:text-sm font-black my-1 block">
                  {d.rate}%
                </span>
                <span className={`text-[9px] uppercase font-semibold block rounded px-1 py-0.5 ${
                  d.isJourneyDay
                    ? 'bg-white/20 text-white'
                    : d.demandLevel === 'Peak'
                    ? 'bg-rose-100 text-rose-700'
                    : d.demandLevel === 'Low'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {d.isJourneyDay ? t('trends.today') : d.demandLevel}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
            * Highlighted column indicates the day of your scheduled train journey.
          </p>
        </div>

        {/* Column 2: Class-Wise Clearance Ceiling on this Route */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              {t('trends.classBenchmarks')} ({routeTrends.trainNumber})
            </h4>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {routeTrends.classBenchmarks.length} {routeTrends.classBenchmarks.length === 1 ? 'Class' : 'Classes'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Historical maximum waitlist position that cleared across available travel classes on this train.
          </p>

          <div className="space-y-2 pt-1">
            {routeTrends.classBenchmarks && routeTrends.classBenchmarks.length > 0 ? (
              routeTrends.classBenchmarks.map((cls, idx) => (
                <div
                  key={`${cls.classCode}-${idx}`}
                  className={`p-2.5 rounded-xl flex items-center justify-between border text-xs transition-all gap-2 ${
                    cls.isCurrentClass
                      ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300 font-bold text-slate-900 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`font-mono px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
                      cls.isCurrentClass ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {cls.classCode}
                    </span>
                    <span className="text-slate-800 font-medium truncate" title={cls.className}>
                      {cls.className}
                    </span>
                    {cls.isCurrentClass && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                        Your Class
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 font-mono shrink-0 ml-1 text-right">
                    {cls.historicalDataAvailable && cls.clearanceRate !== null && cls.typicalWlThreshold !== null ? (
                      <>
                        <span className="text-slate-500 text-[11px] hidden sm:inline whitespace-nowrap">
                          Max Cleared: <strong className="text-slate-800">WL {cls.typicalWlThreshold}</strong>
                        </span>
                        <span className="text-emerald-700 font-bold whitespace-nowrap">
                          {cls.clearanceRate}% CNF
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 italic text-[11px] whitespace-nowrap">
                        Historical data unavailable
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic text-center">
                Coach class data unavailable for this train
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Insights Cards */}
      <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-left space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          Key Historical Insights for PNR #{currentPnrNumber} on this Route
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {routeTrends.historicalInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-indigo-100/80 shadow-2xs text-xs text-slate-700 leading-relaxed flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
