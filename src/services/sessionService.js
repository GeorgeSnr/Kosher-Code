/**
 * Session Management & Inactivity Tracker
 * Enforces strict 10-minute inactivity timeouts across active browsing and page refreshes.
 */

export const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
export const LAST_ACTIVITY_KEY = 'kosher_last_activity_timestamp';
export const SESSION_KEY = 'kosher_client_session';
export const USER_KEY = 'kosher_current_user';

/**
 * Record user interaction timestamp
 */
export const updateLastActivity = () => {
    try {
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    } catch (e) {}
};

/**
 * Get timestamp of last user interaction
 */
export const getLastActivity = () => {
    try {
        const ts = localStorage.getItem(LAST_ACTIVITY_KEY);
        return ts ? parseInt(ts, 10) : null;
    } catch (e) {
        return null;
    }
};

/**
 * Check if the active session has exceeded 10 minutes of inactivity
 */
export const isSessionExpired = () => {
    const lastActivity = getLastActivity();
    if (!lastActivity) return false;
    return (Date.now() - lastActivity) > INACTIVITY_TIMEOUT_MS;
};

/**
 * Wipe all authentication credentials from storage
 */
export const clearSessionStorage = () => {
    try {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('token');
        localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch (e) {}
};
