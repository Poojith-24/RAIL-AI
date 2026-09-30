export interface NotificationAlert {
  id: string;
  timestamp: string;
  channel: 'EMAIL' | 'SMS' | 'BOTH';
  recipient: string;
  title: string;
  message: string;
  type: 'MOVEMENT' | 'CONFIRMATION' | 'CHART_PREP' | 'TEST';
}

export interface NotificationSubscription {
  pnr: string;
  enabled: boolean;
  channel: 'EMAIL' | 'SMS' | 'BOTH';
  email?: string;
  phone?: string;
  alertTriggers: string[];
  subscribedAt: string;
  lastNotifiedAt?: string;
  recentAlertsSent: NotificationAlert[];
}

class NotificationService {
  private subscriptions: Map<string, NotificationSubscription> = new Map();

  constructor() {
    // Seed with an initial sample subscription for testing
    this.subscriptions.set('4218765430', {
      pnr: '4218765430',
      enabled: true,
      channel: 'BOTH',
      email: 'poojithnp24@gmail.com',
      phone: '+91 98450 12345',
      alertTriggers: ['WAITLIST_IMPROVEMENT', 'CONFIRMATION_RAC', 'CHART_PREPARATION'],
      subscribedAt: new Date(Date.now() - 3600000).toISOString(),
      lastNotifiedAt: new Date(Date.now() - 1800000).toISOString(),
      recentAlertsSent: [
        {
          id: 'alt_1',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          channel: 'BOTH',
          recipient: 'poojithnp24@gmail.com / +91 98450 12345',
          title: 'Status Improved: RAC 4',
          message: 'Your ticket for 12637 Pandian Superfast Express moved from WL 12 to RAC 4!',
          type: 'MOVEMENT'
        }
      ]
    });
  }

  getSubscription(pnr: string): NotificationSubscription | null {
    return this.subscriptions.get(pnr) || null;
  }

  subscribe(
    pnr: string,
    data: {
      channel: 'EMAIL' | 'SMS' | 'BOTH';
      email?: string;
      phone?: string;
      alertTriggers?: string[];
    }
  ): NotificationSubscription {
    const existing = this.subscriptions.get(pnr);
    const sub: NotificationSubscription = {
      pnr,
      enabled: true,
      channel: data.channel,
      email: data.email || existing?.email || 'poojithnp24@gmail.com',
      phone: data.phone || existing?.phone || '+91 98450 12345',
      alertTriggers: data.alertTriggers && data.alertTriggers.length > 0
        ? data.alertTriggers
        : ['WAITLIST_IMPROVEMENT', 'CONFIRMATION_RAC', 'CHART_PREPARATION'],
      subscribedAt: existing?.subscribedAt || new Date().toISOString(),
      lastNotifiedAt: existing?.lastNotifiedAt,
      recentAlertsSent: existing?.recentAlertsSent || []
    };

    // Auto-create confirmation alert log
    const recipient = sub.channel === 'BOTH'
      ? `${sub.email} & ${sub.phone}`
      : sub.channel === 'EMAIL'
      ? sub.email || ''
      : sub.phone || '';

    const newAlert: NotificationAlert = {
      id: `alt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      channel: sub.channel,
      recipient,
      title: 'Alerts Activated for PNR #' + pnr,
      message: `Real-time monitoring active. You will receive ${sub.channel} alerts for waitlist jumps, RAC/CNF allocation, and final chart release.`,
      type: 'TEST'
    };

    sub.recentAlertsSent.unshift(newAlert);
    if (sub.recentAlertsSent.length > 5) sub.recentAlertsSent.pop();

    this.subscriptions.set(pnr, sub);
    return sub;
  }

  unsubscribe(pnr: string): boolean {
    const sub = this.subscriptions.get(pnr);
    if (sub) {
      sub.enabled = false;
      return true;
    }
    return false;
  }

  sendTestNotification(pnr: string, trainName = 'Express Train'): { success: boolean; alert: NotificationAlert } {
    const sub = this.subscriptions.get(pnr) || this.subscribe(pnr, {
      channel: 'EMAIL',
      email: 'poojithnp24@gmail.com',
      alertTriggers: ['WAITLIST_IMPROVEMENT', 'CONFIRMATION_RAC']
    });

    const recipient = sub.channel === 'BOTH'
      ? `${sub.email} & ${sub.phone}`
      : sub.channel === 'EMAIL'
      ? sub.email || ''
      : sub.phone || '';

    const alert: NotificationAlert = {
      id: `alt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      channel: sub.channel,
      recipient,
      title: `[TEST ALERT] PNR #${pnr} - Status Update Simulation`,
      message: `Simulated Alert: Status improved for ${trainName}. PRS position advanced. Next expected update upon chart prep.`,
      type: 'TEST'
    };

    sub.lastNotifiedAt = alert.timestamp;
    sub.recentAlertsSent.unshift(alert);
    if (sub.recentAlertsSent.length > 5) sub.recentAlertsSent.pop();

    return { success: true, alert };
  }
}

export const notificationService = new NotificationService();
