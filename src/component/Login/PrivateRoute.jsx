import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from '../../context';

const PrivateRoute = ({ children, redirectTo = "/login" }) => {
    const { state: { user } } = useAppContext();
    const location = useLocation();
    const isAuthenticated = Boolean(user && user.isSignedIn && user.email);

    return isAuthenticated ? children : <Navigate to={redirectTo} state={{ from: location }} replace />;
};

export default PrivateRoute;
