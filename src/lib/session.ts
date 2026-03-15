// Session token management using localStorage

const SESSION_KEY = 'eduforyou-session';
const SESSION_ID_KEY = 'eduforyou-session-id';

export interface SessionData {
  id: string;
  startedAt: string;
  lastActivity: string;
  pageViews: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getOrCreateSession(): SessionData {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const session: SessionData = JSON.parse(stored);
      // Session expires after 30 minutes of inactivity
      const lastActivity = new Date(session.lastActivity).getTime();
      if (Date.now() - lastActivity < 30 * 60 * 1000) {
        session.lastActivity = new Date().toISOString();
        session.pageViews += 1;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      }
    }
  } catch {}

  // Create new session
  const params = new URLSearchParams(window.location.search);
  const session: SessionData = {
    id: generateSessionId(),
    startedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    pageViews: 1,
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    referrer: document.referrer || undefined,
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_ID_KEY, session.id);
  } catch {}

  return session;
}

export function getSessionId(): string {
  try {
    return localStorage.getItem(SESSION_ID_KEY) || getOrCreateSession().id;
  } catch {
    return generateSessionId();
  }
}

export function getUTMParams(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
  } catch {}
}
