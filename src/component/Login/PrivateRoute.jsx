import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from '../../context';
import { isSessionExpired, clearSessionStorage } from '../../services/sessionService';

const PrivateRoute = ({ children, redirectTo = "/client/login", requiredRole }) => {
    const { state: { user, admin } } = useAppContext();
    const location = useLocation();

    // Strict 10-minute inactivity check upon route access & refresh
    if (isSessionExpired()) {
        clearSessionStorage();
        return <Navigate to={redirectTo} state={{ from: location, sessionExpired: true }} replace />;
    }
    
    let activeUser = user;
    if (!activeUser || !activeUser.email) {
        try {
            const stored = sessionStorage.getItem('kosher_client_session') || localStorage.getItem('kosher_current_user');
            if (stored) {
                activeUser = JSON.parse(stored);
            }
        } catch (e) {}
    }

    const isAuthenticated = Boolean(activeUser && (activeUser.isSignedIn || activeUser.email));
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    const currentRole = activeUser.role || (admin ? 'admin' : 'client');

    // Strict role segregation
    if (requiredRole && currentRole !== requiredRole) {
        if (requiredRole === 'admin' && currentRole === 'client') {
            return <Navigate to="/client" replace />;
        }
        if (requiredRole === 'client' && currentRole === 'admin') {
            return <Navigate to="/admin" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
