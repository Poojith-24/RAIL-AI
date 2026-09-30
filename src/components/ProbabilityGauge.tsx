import React from 'react';
import { PredictionResult } from '../types';

interface ProbabilityGaugeProps {
  prediction: PredictionResult;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({ prediction }) => {
  const { probability, category, confidence, expectedStatus, features, pnrData } = prediction;

  // Circular gauge math: strokeDasharray & strokeDashoffset
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (Math.min(100, Math.max(0, probability)) / 100) * circumference;

  let colorClasses = {
    ring: 'stroke-emerald-500',
    bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    badge: 'text-emerald-700 bg-emerald-50',
    text: 'text-emerald-600',
    title: 'HIGH POSSIBILITY'
  };

  if (category === 'MEDIUM') {
    colorClasses = {
      ring: 'stroke-amber-500',
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      badge: 'text-amber-700 bg-amber-50',
      text: 'text-amber-600',
      title: 'MEDIUM POSSIBILITY'
    };
  } else if (category === 'LOW') {
    colorClasses = {
      ring: 'stroke-rose-500',
      bg: 'bg-rose-50 text-rose-900 border-rose-200',
      badge: 'text-rose-700 bg-rose-50',
      text: 'text-rose-600',
      title: 'LOW POSSIBILITY'
    };
  }

  const p1 = pnrData.passengers[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">
          AI Confirmation Prediction
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center">
        {/* Circular Gauge */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-100"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className={`${colorClasses.ring} transition-all duration-1000 ease-out`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums font-mono">
              {probability}%
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">
              Probability
            </span>
          </div>
        </div>

        {/* Category Badge & Details */}
        <div className="mt-4 text-center">
          <div className="text-base font-bold tracking-tight text-slate-900">
            {colorClasses.title}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-2">
            <span>Model Confidence: <strong className="text-slate-700">{confidence}</strong></span>
            <span>·</span>
            <span>Calibration: <strong className="text-slate-700">Platt Scaled</strong></span>
          </div>
          <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
            {expectedStatus}
          </p>
        </div>
      </div>

      {/* Structured Key Comparison Metrics */}
      <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">Booking Status</span>
          <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
            {p1 ? p1.bookingStatus : 'WL'}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">Current Status</span>
          <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
            {p1 ? p1.currentStatus : 'WL'}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">Days Remaining</span>
          <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
            {features.days_to_journey} {features.days_to_journey === 1 ? 'Day' : 'Days'}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">Hist. Train Rate</span>
          <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
            {Math.round(features.historical_train_confirmation_rate * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
