import React from 'react';
import { PredictionResult } from '../types';
import { ProbabilityGauge } from './ProbabilityGauge';
import { ExplainabilityCard } from './ExplainabilityCard';
import { DisclaimerBanner } from './DisclaimerBanner';
import { Train, Calendar, MapPin, Users, Info, ShieldCheck, ArrowRight } from 'lucide-react';

interface PNRResultDashboardProps {
  prediction: PredictionResult;
  onCheckAnother: () => void;
}

export const PNRResultDashboard: React.FC<PNRResultDashboardProps> = ({
  prediction,
  onCheckAnother
}) => {
  const { pnrData, explanation, modelVersion } = prediction;
  const isDemo = pnrData.dataSource === 'DEMO';

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onCheckAnother}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1"
          >
            ← Check Another PNR
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-mono">
            PNR: <strong className="text-slate-900">{pnrData.pnr}</strong>
          </span>
        </div>

        {/* Data Source Indicator */}
        <div className="text-[11px] font-mono flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">
          <span className={`w-2 h-2 rounded-full ${isDemo ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span>Data Source: <strong>{pnrData.dataSource}</strong></span>
          <span className="text-slate-400">({pnrData.providerName})</span>
        </div>
      </div>

      {/* Main Grid: Left Side Railway Ticket Card, Right Side Probability Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Railway Ticket Details & Passengers (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Railway Ticket Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header Strip */}
            <div className="bg-slate-900 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Train className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold tracking-wider text-blue-300">
                      #{pnrData.trainNumber}
                    </span>
                    <span className="text-sm font-bold tracking-tight text-white">
                      {pnrData.trainName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Departs: {pnrData.expectedDepartureTime}</span>
                    <span>·</span>
                    <span>Distance: {pnrData.distanceKm} km</span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {pnrData.chartStatus === 'CHART_PREPARED' ? 'Chart Prepared' : 'Chart Not Prepared'}
                </span>
              </div>
            </div>

            {/* Journey Stations & Schedule */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Journey Date: <strong className="text-slate-800 font-mono">{pnrData.journeyDate}</strong></span>
                <span>Class: <strong className="text-slate-800 font-mono">{pnrData.class}</strong> · Quota: <strong className="text-slate-800 font-mono">{pnrData.quota}</strong></span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-mono block">From Station</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {pnrData.fromStationCode}
                  </span>
                  <span className="text-xs text-slate-600 block truncate">
                    {pnrData.fromStationName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase font-mono block">To Station</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {pnrData.toStationCode}
                  </span>
                  <span className="text-xs text-slate-600 block truncate">
                    {pnrData.toStationName}
                  </span>
                </div>
              </div>
            </div>

            {/* Passenger Status Section */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Passenger Booking & Current Status
                </h4>
              </div>

              <div className="space-y-2.5">
                {pnrData.passengers.map((p) => (
                  <div
                    key={p.passengerNumber}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        Passenger {p.passengerNumber}
                      </span>
                      {p.coach && p.berth ? (
                        <div className="text-xs text-emerald-700 font-mono mt-0.5">
                          Confirmed: Coach {p.coach}, Berth {p.berth} ({p.berthType})
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 mt-0.5">
                          Waitlist Type: <span className="font-mono text-slate-700">{p.currentType}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">Booking Status</span>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {p.bookingStatus}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Current Status</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          p.currentType === 'CNF'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.currentType === 'RAC'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.currentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explainable AI Card */}
          <ExplainabilityCard
            summary={explanation.summary}
            positiveFactors={explanation.positiveFactors}
            negativeFactors={explanation.negativeFactors}
            modelVersion={modelVersion}
          />
        </div>

        {/* Right Column: AI Confirmation Gauge & Disclaimer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ProbabilityGauge prediction={prediction} />

          {/* Official Disclaimer */}
          <DisclaimerBanner />

          {/* Model Pipeline Specs */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Machine Learning Model Architecture</span>
            </div>
            <div className="text-slate-600 leading-relaxed space-y-1">
              <div className="flex justify-between">
                <span>Model Pipeline:</span>
                <span className="font-mono font-medium text-slate-800">{prediction.modelType}</span>
              </div>
              <div className="flex justify-between">
                <span>Model Version:</span>
                <span className="font-mono font-medium text-slate-800">{modelVersion}</span>
              </div>
              <div className="flex justify-between">
                <span>Baseline Model:</span>
                <span className="font-mono font-medium text-slate-800">Calibrated Logistic Regression</span>
              </div>
              <div className="flex justify-between">
                <span>Probability Calibration:</span>
                <span className="font-mono font-medium text-slate-800">Platt Isotonic Scaling</span>
              </div>
              <div className="flex justify-between">
                <span>Brier Score (Calibration Error):</span>
                <span className="font-mono font-medium text-slate-800">{prediction.brierScoreEstimate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
