import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SET_USER, SET_ADMIN, useAppContext } from '../../../context';
import { 
    isSessionExpired, 
    updateLastActivity, 
    clearSessionStorage, 
    INACTIVITY_TIMEOUT_MS 
} from '../../../services/sessionService';
import { firebaseSignOut } from '../../../services/firebaseService';

/**
 * SessionWatcher: Monitors active user interaction and enforces a strict
 * 10-minute inactivity session logout across tab sessions, page refreshes,
 * and live application usage.
 */
const SessionWatcher = () => {
    const { state: { user }, dispatch } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Only active when a user has an authenticated session
        if (!user || !user.email) return;

        const handleTimeout = () => {
            clearSessionStorage();
            firebaseSignOut().catch(() => {});
            dispatch({ type: SET_USER, payload: { isSignedIn: false, email: '', name: '' } });
            dispatch({ type: SET_ADMIN, payload: false });

            toast.error('Session expired due to 10 minutes of inactivity. Please sign in again.', {
                id: 'session-timeout-notice',
                duration: 6500
            });

            // Redirect if currently on a protected portal route
            const isProtected = location.pathname.startsWith('/client') || 
                                location.pathname.startsWith('/admin') || 
                                location.pathname.startsWith('/dashboard');

            if (isProtected) {
                navigate('/client/login', { 
                    replace: true, 
                    state: { sessionExpired: true, from: location } 
                });
            }
        };

        // 1. Check expiration immediately upon component mount / page refresh
        if (isSessionExpired()) {
            handleTimeout();
            return;
        }

        // Keep last activity fresh on initial mount
        updateLastActivity();

        // 2. Poll every 5 seconds to verify inactivity threshold
        const checkInterval = setInterval(() => {
            if (isSessionExpired()) {
                handleTimeout();
            }
        }, 5000);

        // 3. User interaction listener with throttle (at most once every 5 seconds)
        let lastLogged = Date.now();
        const onUserActivity = () => {
            const now = Date.now();
            if (now - lastLogged > 5000) {
                lastLogged = now;
                updateLastActivity();
            }
        };

        const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach((evt) => {
            window.addEventListener(evt, onUserActivity, { passive: true });
        });

        return () => {
            clearInterval(checkInterval);
            activityEvents.forEach((evt) => {
                window.removeEventListener(evt, onUserActivity);
            });
        };
    }, [user?.email, dispatch, navigate, location.pathname]);

    return null;
};

export default SessionWatcher;
