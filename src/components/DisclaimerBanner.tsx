import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-amber-950">Official Railway Disclaimer: </span>
        <span>
          RailPredict AI provides an estimated probability based on available railway information and historical patterns.
          It is not an official railway service and does not guarantee ticket confirmation. Final ticket status is determined
          solely by the Indian Railways reservation system upon chart preparation.
        </span>
      </div>
    </div>
  );
};
