import React from 'react';
import { XAIFactor } from '../types';
import { TrendingUp, TrendingDown, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ExplainabilityCardProps {
  summary: string;
  positiveFactors: XAIFactor[];
  negativeFactors: XAIFactor[];
  modelVersion: string;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({
  summary,
  positiveFactors,
  negativeFactors,
  modelVersion
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Why this prediction?</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Model Attribution ({modelVersion})
        </span>
      </div>

      {/* Editorial Summary */}
      <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-100">
        <strong className="text-slate-900">Analysis Summary: </strong>
        {summary}
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Positive Factors Column */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Positive Factors ({positiveFactors.length})</span>
          </div>

          {positiveFactors.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No significant positive factors identified.</p>
          ) : (
            <div className="space-y-2.5">
              {positiveFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {factor.name}
                    </span>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums text-[11px]">
                      +{factor.weight}%
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed pl-5">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Negative Factors Column */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold uppercase tracking-wider text-rose-800">
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            <span>Risk & Constraint Factors ({negativeFactors.length})</span>
          </div>

          {negativeFactors.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No critical risk constraints detected.</p>
          ) : (
            <div className="space-y-2.5">
              {negativeFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-rose-100 bg-rose-50/40 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-rose-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      {factor.name}
                    </span>
                    <span className="font-mono font-bold text-rose-700 tabular-nums text-[11px]">
                      -{factor.weight}%
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed pl-5">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
