import React, { useReducer, useContext, createContext } from "react";
import { reducer } from "./reducer";
import { checkIsAdmin } from "../services/storageService";

const AppContext = createContext();

// Enforce Session-Only Management: Session clears upon leaving / closing tab
const getInitialUser = () => {
    try {
        const sessionUser = sessionStorage.getItem('kosher_client_session');
        if (sessionUser) {
            const parsed = JSON.parse(sessionUser);
            if (parsed && parsed.isSignedIn && parsed.email) {
                return parsed;
            }
        }
    } catch (e) {}
    return { isSignedIn: false, email: '', name: '' };
};

const initialUser = getInitialUser();
const initialAdmin = initialUser?.email ? checkIsAdmin(initialUser.email) || initialUser.role === 'admin' : false;

const initialState = {
    user: initialUser,
    admin: initialAdmin,
    selectedService: {},
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
