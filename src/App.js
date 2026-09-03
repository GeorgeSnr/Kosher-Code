import React, { createContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./component/Home/Home/Home";
import About from "./component/Home/About/About";
import ClientAuth from "./component/ClientPortal/ClientAuth";
import PrivateRoute from "./component/Login/PrivateRoute";
import ClientPortal from "./component/ClientPortal/ClientPortal";
import AdminPortal from "./component/AdminPortal/AdminPortal";
import NotFound from "./component/NotFound";
import { useAppContext } from "./context";
import { seedFirestoreDatabase } from "./services/storageService";

export const UserContext = createContext();

// Smart redirector for legacy dashboard links
const DashboardRedirect = () => {
    const { state: { admin } } = useAppContext();
    return <Navigate to={admin ? "/admin" : "/client"} replace />;
};

const App = () => {
    useEffect(() => {
        const storedTheme = localStorage.getItem('kosher_client_theme') || 'light';
        document.documentElement.setAttribute('data-theme', storedTheme);

        // Auto-seed Firestore Database on initial run (if collections are empty)
        seedFirestoreDatabase({ force: false }).catch(err => {
            console.warn('Initial Firestore setup notice:', err.message);
        });
    }, []);

    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                
                {/* Client Portal Login & Registration */}
                <Route path="/login" element={<ClientAuth />} />
                <Route path="/client/login" element={<ClientAuth defaultPortal="client" />} />
                <Route path="/admin/login" element={<ClientAuth defaultPortal="admin" />} />

                {/* Dedicated Client Portal (Gated by Login / Client Role) */}
                <Route
                    path="/client/*"
                    element={
                        <PrivateRoute redirectTo="/client/login" requiredRole="client">
                            <ClientPortal />
                        </PrivateRoute>
                    }
                />

                {/* Dedicated Administrator Portal (Gated by Login / Admin Role) */}
                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute redirectTo="/admin/login" requiredRole="admin">
                            <AdminPortal />
                        </PrivateRoute>
                    }
                />

                {/* Legacy route compatibility */}
                <Route
                    path="/dashboard/*"
                    element={
                        <PrivateRoute redirectTo="/client/login">
                            <DashboardRedirect />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;
