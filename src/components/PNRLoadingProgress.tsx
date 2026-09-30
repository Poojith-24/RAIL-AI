import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface PNRLoadingProgressProps {
  onComplete?: () => void;
}

const STEPS = [
  'Validating 10-digit PNR format',
  'Fetching railway status from data provider',
  'Analyzing historical clearance patterns',
  'Running gradient-boosted prediction model',
  'Calibrating probability & computing XAI factors'
];

export const PNRLoadingProgress: React.FC<PNRLoadingProgressProps> = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-lg mx-auto shadow-sm text-center">
      <div className="flex justify-center mb-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">
        Evaluating Railway Journey
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Retrieving reservation details and executing machine learning prediction engine...
      </p>

      <div className="space-y-3 text-left max-w-sm mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-opacity duration-200 ${
                isDone
                  ? 'text-slate-900 font-medium'
                  : isCurrent
                  ? 'text-blue-700 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
