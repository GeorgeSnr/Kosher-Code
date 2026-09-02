import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from '../../context';

const PrivateRoute = ({ children, redirectTo = "/login" }) => {
    const { state: { user } } = useAppContext();
    const location = useLocation();
    
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

    return isAuthenticated ? children : <Navigate to={redirectTo} state={{ from: location }} replace />;
};

export default PrivateRoute;
