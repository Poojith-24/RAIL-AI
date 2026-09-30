import React, { useState } from 'react';
import { TrainScheduleInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Train,
  Clock,
  MapPin,
  Calendar,
  Gauge,
  Utensils,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Navigation,
  ArrowRight
} from 'lucide-react';

interface TrainScheduleAndRouteProps {
  schedule: TrainScheduleInfo;
  boardingStationCode?: string;
  destinationStationCode?: string;
}

export const TrainScheduleAndRoute: React.FC<TrainScheduleAndRouteProps> = ({
  schedule,
  boardingStationCode,
  destinationStationCode
}) => {
  const [showAllStops, setShowAllStops] = useState(false);
  const { t } = useLanguage();

  // If there are more than 8 stops, show first 4 + boarding + destination + last 2 by default, or all when expanded
  const stopsToDisplay = showAllStops ? schedule.stops : schedule.stops.slice(0, 10);
  const hasMoreStops = schedule.stops.length > 10;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {t('sched.title')}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                {schedule.trainType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              <strong className="text-slate-800 font-mono">{schedule.trainNumber}</strong> - {schedule.trainName}
              <span className="text-slate-300 mx-1.5">•</span>
              {schedule.originStation} <span className="text-slate-400">➔</span> {schedule.destinationStation}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 self-start sm:self-auto shrink-0">
          <span className="text-slate-400">{t('result.totalDistance')}:</span>{' '}
          <strong className="text-slate-800 font-bold">{schedule.totalDistanceKm} km</strong> ({schedule.totalStopsCount} {t('sched.stops')})
        </div>
      </div>

      {/* Feature 1: Train Schedule & Timing Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          {t('sched.title')}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Departure */}
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-left">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-0.5">
              {t('result.departure')}
            </span>
            <div className="text-lg sm:text-xl font-black text-blue-700 font-mono">
              {schedule.departureTime}
            </div>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5" title={schedule.originStation}>
              {schedule.originStation}
            </span>
          </div>

          {/* Arrival */}
          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-left">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block mb-0.5">
              {t('sched.destination')}
            </span>
            <div className="text-lg sm:text-xl font-black text-purple-700 font-mono">
              {schedule.arrivalTime}
            </div>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5" title={schedule.destinationStation}>
              {schedule.destinationStation}
            </span>
          </div>

          {/* Total Duration */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-0.5">
              {t('sched.duration')}
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-800 font-mono">
              {schedule.duration}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {schedule.totalDistanceKm} km
            </span>
          </div>

          {/* Average Speed */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-500" />
              {t('sched.avgSpeed')}
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-800 font-mono">
              {schedule.averageSpeedKmph} <span className="text-xs font-normal text-slate-500">km/h</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Operating Velocity
            </span>
          </div>

          {/* Runs On */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              {t('sched.runsOn')}
            </span>
            <div className="text-sm font-bold text-emerald-700 mt-1">
              {schedule.runsOnDays.includes('Daily') ? 'Daily Service' : 'Selected Days'}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {schedule.runsOnDays.filter(d => d !== 'Daily').slice(0, 4).join(', ')}
            </span>
          </div>

          {/* Pantry / Catering */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-slate-500" />
              {t('sched.pantry')}
            </span>
            <div className="text-sm font-bold text-slate-800 mt-1">
              {schedule.pantryAvailable ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('sched.available')}
                </span>
              ) : (
                <span className="text-amber-700">{t('sched.notAvailable')}</span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {schedule.pantryAvailable ? 'Pantry Car Attached' : 'Order via IRCTC'}
            </span>
          </div>
        </div>
      </div>

      {/* Feature 2: Key Route & Intermediate Stops */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-purple-600" />
            {t('sched.stopsRoute')} ({schedule.totalStopsCount} {t('sched.stops')})
          </h4>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-blue-700 font-semibold text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-200" />
              {t('sched.boardingStation')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-purple-700 font-semibold text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-purple-200" />
              {t('sched.destStation')}
            </span>
          </div>
        </div>

        {/* Stops Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                <th className="py-3 px-3.5">#</th>
                <th className="py-3 px-3.5">Station Name & Code</th>
                <th className="py-3 px-3.5">Arrival</th>
                <th className="py-3 px-3.5">Departure</th>
                <th className="py-3 px-3.5">Halt</th>
                <th className="py-3 px-3.5">Distance</th>
                <th className="py-3 px-3.5">Day</th>
                <th className="py-3 px-3.5 text-right">Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stopsToDisplay.map((stop) => {
                const isBoarding = stop.isUserBoarding || stop.stationCode === boardingStationCode;
                const isDestination = stop.isUserDestination || stop.stationCode === destinationStationCode;

                return (
                  <tr
                    key={stop.stopNumber}
                    className={`transition-colors ${
                      isBoarding
                        ? 'bg-blue-50/70 font-semibold text-blue-950'
                        : isDestination
                        ? 'bg-purple-50/70 font-semibold text-purple-950'
                        : 'hover:bg-slate-50/60 text-slate-800'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-mono text-slate-400 font-medium">
                      {stop.stopNumber}
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2">
                        {isBoarding && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                        {isDestination && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                        )}
                        <span className="font-bold font-mono text-slate-900">
                          {stop.stationCode}
                        </span>
                        <span className="text-slate-700">
                          {stop.stationName}
                        </span>
                        {isBoarding && (
                          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white font-mono uppercase">
                            Boarding
                          </span>
                        )}
                        {isDestination && (
                          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white font-mono uppercase">
                            Destination
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 font-mono">
                      {stop.arrivalTime === 'Source' ? (
                        <span className="text-slate-400 italic">Origin</span>
                      ) : (
                        <span className="font-bold text-slate-800">{stop.arrivalTime}</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 font-mono">
                      {stop.departureTime === 'Destination' ? (
                        <span className="text-slate-400 italic">Destination</span>
                      ) : (
                        <span className="font-bold text-slate-800">{stop.departureTime}</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 font-mono text-slate-600">
                      {stop.haltMinutes > 0 ? `${stop.haltMinutes} min` : '—'}
                    </td>

                    <td className="py-2.5 px-3.5 font-mono text-slate-600">
                      {stop.distanceKm} km
                    </td>

                    <td className="py-2.5 px-3.5 font-mono text-slate-500">
                      Day {stop.day}
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-700">
                      PF {stop.platform || '1'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* View All / Collapse Button */}
        {hasMoreStops && (
          <div className="pt-3 text-center">
            <button
              onClick={() => setShowAllStops(!showAllStops)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            >
              {showAllStops ? (
                <>
                  <span>Show Fewer Stops</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Show All {schedule.stops.length} Route Stops</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
