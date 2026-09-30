import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

interface NotificationAlert {
  id: string;
  timestamp: string;
  channel: 'EMAIL' | 'SMS' | 'BOTH';
  recipient: string;
  title: string;
  message: string;
  type: string;
}

interface RealTimeNotificationToggleProps {
  pnr: string;
  trainName: string;
  currentStatus: string;
}

export const RealTimeNotificationToggle: React.FC<RealTimeNotificationToggleProps> = ({
  pnr,
  trainName,
  currentStatus
}) => {
  const [enabled, setEnabled] = useState(false);
  const [channel, setChannel] = useState<'EMAIL' | 'SMS' | 'BOTH'>('EMAIL');
  const [email, setEmail] = useState('poojithnp24@gmail.com');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [alertTriggers, setAlertTriggers] = useState<string[]>([
    'WAITLIST_IMPROVEMENT',
    'CONFIRMATION_RAC',
    'CHART_PREPARATION'
  ]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<NotificationAlert[]>([]);

  // Load existing subscription status
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/notifications/status/${pnr}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.subscription) {
            setEnabled(data.subscribed);
            setChannel(data.subscription.channel || 'EMAIL');
            if (data.subscription.email) setEmail(data.subscription.email);
            if (data.subscription.phone) setPhone(data.subscription.phone);
            if (data.subscription.alertTriggers) setAlertTriggers(data.subscription.alertTriggers);
            if (data.subscription.recentAlertsSent) setRecentAlerts(data.subscription.recentAlertsSent);
          }
        }
      } catch (e) {
        console.error('Failed to fetch notification status:', e);
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [pnr]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggle = async () => {
    const nextState = !enabled;
    setLoading(true);

    try {
      if (nextState) {
        // Subscribe
        const res = await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pnr,
            channel,
            email,
            phone,
            alertTriggers
          })
        });
        const data = await res.json();
        if (res.ok) {
          setEnabled(true);
          if (data.subscription?.recentAlertsSent) {
            setRecentAlerts(data.subscription.recentAlertsSent);
          }
          showToast(`🔔 Real-time alerts activated for PNR #${pnr}!`);
        }
      } else {
        // Unsubscribe
        const res = await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pnr })
        });
        if (res.ok) {
          setEnabled(false);
          showToast(`Alerts paused for PNR #${pnr}.`);
        }
      }
    } catch (err) {
      console.error('Error toggling notifications:', err);
      showToast('Failed to update alert settings. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pnr,
          channel,
          email,
          phone,
          alertTriggers
        })
      });
      const data = await res.json();
      if (res.ok) {
        setEnabled(true);
        if (data.subscription?.recentAlertsSent) {
          setRecentAlerts(data.subscription.recentAlertsSent);
        }
        showToast('Notification preferences updated successfully!');
      }
    } catch (err) {
      console.error('Error saving notification preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestAlert = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr, trainName })
      });
      const data = await res.json();
      if (res.ok && data.alert) {
        setRecentAlerts(prev => [data.alert, ...prev.slice(0, 4)]);
        showToast(`Test alert simulated to ${data.alert.recipient}!`);
      }
    } catch (err) {
      console.error('Error sending test alert:', err);
    } finally {
      setTesting(false);
    }
  };

  const toggleTrigger = (triggerKey: string) => {
    setAlertTriggers(prev =>
      prev.includes(triggerKey)
        ? prev.filter(t => t !== triggerKey)
        : [...prev, triggerKey]
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 relative overflow-hidden">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Master Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-xs ${
            enabled
              ? 'bg-emerald-500 text-white shadow-emerald-500/25'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {enabled ? <BellRing className="w-5 h-5 animate-bounce" /> : <Bell className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Real-Time PNR Status Alerts
              </h3>
              {enabled ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  MONITORING ACTIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 text-slate-600">
                  INACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant Email or SMS notification whenever your waitlist position advances or confirms.
            </p>
          </div>
        </div>

        {/* Master Toggle Switch */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-semibold text-slate-700">
            {enabled ? 'Alerts ON' : 'Alerts OFF'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={loading}
            onClick={handleToggle}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
              enabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform flex items-center justify-center ${
                enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
              ) : enabled ? (
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Main Alert Subscription Configuration Panel */}
      <form onSubmit={handleSavePreferences} className="space-y-5">
        {/* Step 1: Delivery Channel Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
            1. Select Alert Delivery Channel
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Email Option */}
            <div
              onClick={() => setChannel('EMAIL')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                channel === 'EMAIL'
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/20'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                channel === 'EMAIL' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">
                  Email Alerts
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Detailed status summaries & advice
                </span>
              </div>
            </div>

            {/* SMS Option */}
            <div
              onClick={() => setChannel('SMS')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                channel === 'SMS'
                  ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-400/20'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                channel === 'SMS' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">
                  SMS / Mobile
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Instant text alerts to your phone
                </span>
              </div>
            </div>

            {/* Both Option */}
            <div
              onClick={() => setChannel('BOTH')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                channel === 'BOTH'
                  ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                channel === 'BOTH' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">
                  Email & SMS (Both)
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Maximum redundancy & reliability
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Recipient Details Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {(channel === 'EMAIL' || channel === 'BOTH') && (
            <div className="text-left">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Email Address for Alerts
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Verification not required. Delivered directly to your inbox.
              </span>
            </div>
          )}

          {(channel === 'SMS' || channel === 'BOTH') && (
            <div className="text-left">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                Mobile Number for SMS Alerts
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Supports Indian (+91) mobile numbers for instant SMS dispatch.
              </span>
            </div>
          )}
        </div>

        {/* Step 3: Trigger Conditions */}
        <div className="pt-2 text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            2. Alert Trigger Milestones
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={alertTriggers.includes('WAITLIST_IMPROVEMENT')}
                onChange={() => toggleTrigger('WAITLIST_IMPROVEMENT')}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-700">
                Any Waitlist Drop (e.g. WL 12 ➔ WL 6)
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={alertTriggers.includes('CONFIRMATION_RAC')}
                onChange={() => toggleTrigger('CONFIRMATION_RAC')}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-700">
                Move to RAC or Confirmed (CNF)
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={alertTriggers.includes('CHART_PREPARATION')}
                onChange={() => toggleTrigger('CHART_PREPARATION')}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-700">
                Final Chart Prep & Coach Allocation
              </span>
            </label>
          </div>
        </div>

        {/* Save / Activate & Test Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto flex-1 h-11 px-5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
              enabled
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : enabled ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <BellRing className="w-4 h-4" />
            )}
            <span>{enabled ? 'Update Alert Preferences' : 'Activate Real-Time Status Alerts'}</span>
          </button>

          <button
            type="button"
            onClick={handleSendTestAlert}
            disabled={testing}
            className="w-full sm:w-auto px-4 h-11 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            title="Simulate an immediate status alert to verify delivery"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-blue-600" />}
            <span>Send Test Alert</span>
          </button>
        </div>
      </form>

      {/* Monitoring Status Bar & Recent Alerts Log */}
      {enabled && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Polling PRS engine every 15 minutes for PNR #{pnr}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Target: {channel === 'BOTH' ? `${email} & ${phone}` : channel === 'EMAIL' ? email : phone}
            </span>
          </div>

          {/* Recent Alerts Feed */}
          {recentAlerts.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Recent Alerts Dispatched:
              </span>
              <div className="space-y-2">
                {recentAlerts.slice(0, 2).map(alert => (
                  <div key={alert.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-start gap-2.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{alert.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
