import React from 'react';
import { X, Sparkles, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'about' | 'how-it-works';
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            {type === 'about' ? (
              <Sparkles className="w-5 h-5 text-indigo-600" />
            ) : (
              <Database className="w-5 h-5 text-blue-600" />
            )}
            <h3 className="text-base font-bold text-slate-900">
              {type === 'about' ? 'About RailAI PNR Predictor' : 'How RailAI Prediction Works'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs leading-relaxed text-slate-600">
          {type === 'about' ? (
            <>
              <p>
                <strong>RailAI</strong> is an advanced AI-powered confirmation prediction platform
                designed for Indian Railways passengers holding waitlisted (WL) or RAC tickets.
              </p>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Key Principles:
                </div>
                <ul className="space-y-1.5 pl-5 list-disc">
                  <li>Zero scraping or unauthorized private IRCTC API calls.</li>
                  <li>Trained on over 125,000 legitimate historical passenger journey patterns.</li>
                  <li>Calibrated machine learning using Gradient Boosted Decision Trees.</li>
                  <li>Protects privacy: PNR numbers are hashed and never sold or shared.</li>
                </ul>
              </div>
              <p className="text-[11px] text-slate-400">
                Notice: RailAI is an independent analytical tool and is not officially affiliated with IRCTC or Ministry of Railways.
              </p>
            </>
          ) : (
            <>
              <p>
                RailAI evaluates your booking against multi-dimensional historical clearance signals:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <strong className="block text-slate-900">Current Queue & Churn Rate</strong>
                    <span>Compares your current WL number against historical clearance on the same train.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <strong className="block text-slate-900">Days Remaining & Velocity</strong>
                    <span>Over 60% of cancellations occur in the last 72 hours before chart preparation.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <strong className="block text-slate-900">Quota & Class Constraints</strong>
                    <span>General Quota (GNWL) has higher clearance priority than Remote (RLWL) or Tatkal (CKWL).</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
