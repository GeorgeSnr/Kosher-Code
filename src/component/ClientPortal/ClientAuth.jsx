import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuffer,
    faGoogle 
} from '@fortawesome/free-brands-svg-icons';
import { 
    faEnvelope, 
    faLock, 
    faUser, 
    faBuilding, 
    faSignInAlt, 
    faUserPlus, 
    faKey, 
    faArrowLeft, 
    faShieldAlt,
    faUserShield,
    faCheckCircle,
    faSun,
    faMoon,
    faEye,
    faEyeSlash,
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { SET_USER, SET_ADMIN, useAppContext } from '../../context';
import { 
    checkIsAdmin, 
    saveUserToFirestore, 
    authenticateUserAccount, 
    registerUserAccount,
    findRegisteredUser,
    verifyUserCredentials,
    getUserFromFirestore
} from '../../services/storageService';
import { 
    firebaseLogin, 
    firebaseRegister, 
    firebaseGoogleSignIn,
    firebaseSendPasswordReset 
} from '../../services/firebaseService';
import { updateLastActivity } from '../../services/sessionService';
import userImg from '../../Assets/user.svg';

const ClientAuth = ({ defaultPortal }) => {
    const { dispatch } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Theme Engine
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('kosher_client_theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('kosher_client_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    // Determine intended target portal: 'client' | 'admin'
    const isExplicitAdminPortal = defaultPortal === 'admin' || location.pathname === '/admin/login';
    const authRole = isExplicitAdminPortal ? 'admin' : 'client';

    // Modes: 'signin' | 'signup' | 'forgot'
    const [mode, setMode] = useState('signin');
    const [submitting, setSubmitting] = useState(false);

    // Password visibility toggles
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);

    // Sign In Form State & Validation
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signInErrors, setSignInErrors] = useState({ email: '', password: '' });
    const [signInAlert, setSignInAlert] = useState(null); // { type, title, message, action }

    // Sign Up Form State & Validation
    const [signUpName, setSignUpName] = useState('');
    const [signUpOrg, setSignUpOrg] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpErrors, setSignUpErrors] = useState({ name: '', email: '', password: '' });
    const [signUpAlert, setSignUpAlert] = useState(null); // { type, title, message, action }

    // Forgot Password Form State
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSubmitting, setForgotSubmitting] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [forgotAlert, setForgotAlert] = useState(null); // { type, title, message }
    const [forgotSuccess, setForgotSuccess] = useState(false);

    // Detect session expiration notice passed via navigation state
    useEffect(() => {
        if (location.state?.sessionExpired) {
            setSignInAlert({
                type: 'warning',
                title: 'Session Expired',
                message: 'You have been automatically logged out due to 10 minutes of inactivity. Please sign in to resume your workspace.'
            });
        }
    }, [location.state]);

    // Validation Helpers
    const validateEmailFormat = (email) => {
        if (!email || !email.trim()) return 'Email address is required.';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email.trim())) return 'Please enter a valid email address (e.g. name@company.com).';
        return '';
    };

    const validatePasswordFormat = (password, isSignUp = false) => {
        if (!password) return 'Password is required.';
        if (isSignUp && password.length < 6) return 'Password must be at least 6 characters long.';
        return '';
    };

    const validateNameFormat = (name) => {
        if (!name || !name.trim()) return 'Full name or representative name is required.';
        if (name.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
    };

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { score: 0, label: '', color: 'transparent', width: '0%' };
        let score = 0;
        if (pwd.length >= 6) score += 1;
        if (pwd.length >= 8) score += 1;
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (pwd.length < 6) {
            return { score: 1, label: 'Too short (min 6 chars)', color: '#EF4444', width: '25%' };
        }
        if (score <= 2) {
            return { score: 2, label: 'Fair', color: '#F59E0B', width: '50%' };
        }
        if (score === 3 || score === 4) {
            return { score: 3, label: 'Good', color: '#3B82F6', width: '75%' };
        }
        return { score: 4, label: 'Strong', color: '#10B981', width: '100%' };
    };

    const handleSwitchMode = (targetMode) => {
        setMode(targetMode);
        setSignInAlert(null);
        setSignUpAlert(null);
        setForgotAlert(null);
        setForgotSuccess(false);
        setSignInErrors({ email: '', password: '' });
        setSignUpErrors({ name: '', email: '', password: '' });
        setForgotError('');
    };

    const finalizeAuthSession = (userObj) => {
        // Strict role definition: client vs admin
        const isClient = userObj.role === 'client';
        const isAdmin = userObj.role === 'admin' || (!isClient && checkIsAdmin(userObj.email));
        const finalRole = isAdmin ? 'admin' : 'client';
        
        // If user targeted Admin Portal but does not have admin privileges, block and redirect to client login
        if (authRole === 'admin' && finalRole !== 'admin') {
            setSignInAlert({
                type: 'danger',
                title: 'Access Restricted',
                message: 'This account has Client privileges. Please sign in through the Client Portal.'
            });
            toast.error('Access restricted: This account is a Client account. Please sign in via the Client Portal.');
            navigate('/client/login');
            return;
        }

        const resolvedUser = {
            ...userObj,
            role: finalRole,
            img: userObj.img || (finalRole === 'admin' 
                ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
                : userImg)
        };

        sessionStorage.setItem('kosher_client_session', JSON.stringify(resolvedUser));
        localStorage.setItem('kosher_current_user', JSON.stringify(resolvedUser));
        updateLastActivity();

        dispatch({ type: SET_USER, payload: resolvedUser });
        dispatch({ type: SET_ADMIN, payload: finalRole === 'admin' });

        // Save / update in Firestore in real-time
        saveUserToFirestore(resolvedUser).catch(err => console.log('Firestore user profile sync:', err.message));

        if (finalRole === 'admin') {
            toast.success('Welcome to the Administrator Command Center!');
            navigate('/admin');
        } else {
            toast.success(`Welcome to Kosher Code, ${resolvedUser.name}!`);
            navigate('/client');
        }
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        setSignInAlert(null);

        // 1. Client-side Form Validation
        const emailErr = validateEmailFormat(signInEmail);
        const passwordErr = validatePasswordFormat(signInPassword, false);

        if (emailErr || passwordErr) {
            setSignInErrors({ email: emailErr, password: passwordErr });
            if (emailErr) toast.error(emailErr);
            else if (passwordErr) toast.error(passwordErr);
            return;
        }

        setSubmitting(true);
        const loading = toast.loading('Authenticating credentials...');

        try {
            // Attempt real-time Firebase Auth login
            const res = await firebaseLogin(signInEmail.trim(), signInPassword);
            toast.dismiss(loading);
            setSubmitting(false);

            if (res.success && res.user) {
                registerUserAccount({ ...res.user, password: signInPassword });
                finalizeAuthSession(res.user);
                return;
            }

            // If Firebase Auth did not succeed, check local database
            const localVerification = verifyUserCredentials(signInEmail.trim(), signInPassword);
            if (localVerification.success && localVerification.user) {
                finalizeAuthSession(localVerification.user);
                return;
            }

            // If local database caught wrong password explicitly
            if (localVerification.reason === 'wrong_password') {
                setSignInErrors(prev => ({ ...prev, password: 'Incorrect password.' }));
                setSignInAlert({
                    type: 'danger',
                    title: 'Incorrect Password',
                    message: 'The password you entered is incorrect. Please verify your password and try again.'
                });
                toast.error('Incorrect password. Please verify your credentials.');
                return;
            }

            // Granular Firebase Auth error analysis
            const errorCode = res.code || '';
            const errorMsg = (res.error || '').toLowerCase();

            if (errorCode === 'auth/wrong-password' || errorMsg.includes('wrong-password')) {
                setSignInErrors(prev => ({ ...prev, password: 'Incorrect password.' }));
                setSignInAlert({
                    type: 'danger',
                    title: 'Incorrect Password',
                    message: 'The password you entered does not match our records. Please verify your password and try again.'
                });
                toast.error('Incorrect password. Please verify your credentials.');
            } else if (errorCode === 'auth/user-not-found' || errorMsg.includes('user-not-found')) {
                setSignInErrors(prev => ({ ...prev, email: 'No account registered with this email.' }));
                setSignInAlert({
                    type: 'warning',
                    title: 'Account Not Found',
                    message: `No registered account found for "${signInEmail.trim()}". Would you like to create a free client account?`,
                    action: 'signup'
                });
                toast.error('No account found with this email.');
            } else if (errorCode === 'auth/invalid-login-credentials' || errorCode === 'auth/invalid-credential' || errorMsg.includes('invalid-login-credentials')) {
                // In modern Firebase SDKs, 'invalid-login-credentials' covers both wrong password and missing user.
                const existingUser = findRegisteredUser(signInEmail.trim()) || await getUserFromFirestore(signInEmail.trim());
                if (existingUser) {
                    setSignInErrors(prev => ({ ...prev, password: 'Incorrect password.' }));
                    setSignInAlert({
                        type: 'danger',
                        title: 'Incorrect Password',
                        message: 'The password you entered is incorrect. Please check your password or use "Forgot password".'
                    });
                    toast.error('Incorrect password. Please verify your credentials.');
                } else {
                    setSignInErrors(prev => ({ ...prev, email: 'No account registered with this email.' }));
                    setSignInAlert({
                        type: 'warning',
                        title: 'Account Not Found',
                        message: `No account exists for "${signInEmail.trim()}". You can create an account in just a few seconds.`,
                        action: 'signup'
                    });
                    toast.error('No account found with this email.');
                }
            } else if (errorCode === 'auth/too-many-requests' || errorMsg.includes('too-many-requests')) {
                setSignInAlert({
                    type: 'danger',
                    title: 'Access Temporarily Restricted',
                    message: 'Access to this account has been temporarily disabled due to consecutive failed sign-in attempts. Please try again in a few minutes.'
                });
                toast.error('Too many failed attempts. Account temporarily locked.');
            } else if (errorCode === 'auth/invalid-email' || errorMsg.includes('invalid-email')) {
                setSignInErrors(prev => ({ ...prev, email: 'Invalid email address format.' }));
                setSignInAlert({
                    type: 'danger',
                    title: 'Invalid Email',
                    message: 'Please provide a valid corporate or personal email address.'
                });
                toast.error('Invalid email address format.');
            } else {
                setSignInAlert({
                    type: 'danger',
                    title: 'Sign In Notice',
                    message: res.error || 'Authentication failed. Please verify your email and password or create an account.'
                });
                toast.error(res.error || 'Authentication failed.');
            }
        } catch (err) {
            toast.dismiss(loading);
            setSubmitting(false);
            setSignInAlert({
                type: 'danger',
                title: 'Sign In Error',
                message: err.message || 'An unexpected error occurred during sign in. Please try again.'
            });
            toast.error(err.message || 'Sign in error');
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setSignUpAlert(null);

        // 1. Client-side Form Validation
        const nameErr = validateNameFormat(signUpName);
        const emailErr = validateEmailFormat(signUpEmail);
        const passwordErr = validatePasswordFormat(signUpPassword, true);

        if (nameErr || emailErr || passwordErr) {
            setSignUpErrors({ name: nameErr, email: emailErr, password: passwordErr });
            if (nameErr) toast.error(nameErr);
            else if (emailErr) toast.error(emailErr);
            else if (passwordErr) toast.error(passwordErr);
            return;
        }

        setSubmitting(true);
        const loading = toast.loading('Creating account in database realtime...');

        try {
            // Check if user already exists in local database or Firestore before creating
            const existingLocal = findRegisteredUser(signUpEmail.trim());
            const existingFirestore = await getUserFromFirestore(signUpEmail.trim());

            if (existingLocal || existingFirestore) {
                toast.dismiss(loading);
                setSubmitting(false);
                setSignUpErrors(prev => ({ ...prev, email: 'This email is already in use.' }));
                setSignUpAlert({
                    type: 'warning',
                    title: 'Account Already Exists',
                    message: `An account for "${signUpEmail.trim()}" is already registered. Please sign in with your password.`,
                    action: 'signin'
                });
                toast.error('This email is already registered. Please sign in instead.');
                return;
            }

            const res = await firebaseRegister(signUpEmail.trim(), signUpPassword, signUpName.trim(), 'client', signUpOrg.trim());
            toast.dismiss(loading);
            setSubmitting(false);

            if (res.success && res.user) {
                const userRecord = { ...res.user, institution: signUpOrg.trim(), password: signUpPassword };
                registerUserAccount(userRecord);
                toast.success('Account successfully created! Entering your client workspace...');
                finalizeAuthSession(userRecord);
                return;
            }

            // If Firebase returns error
            const errorCode = res.code || '';
            const errorMsg = (res.error || '').toLowerCase();

            if (errorCode === 'auth/email-already-in-use' || errorMsg.includes('already in use') || errorMsg.includes('already-in-use')) {
                setSignUpErrors(prev => ({ ...prev, email: 'This email is already in use.' }));
                setSignUpAlert({
                    type: 'warning',
                    title: 'Account Already Exists',
                    message: `The email address "${signUpEmail.trim()}" is already registered. Please sign in with your password.`,
                    action: 'signin'
                });
                toast.error('This email is already registered. Please sign in instead.');
            } else if (errorCode === 'auth/weak-password' || errorMsg.includes('weak-password') || errorMsg.includes('password should be at least')) {
                setSignUpErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters.' }));
                setSignUpAlert({
                    type: 'danger',
                    title: 'Password Too Weak',
                    message: 'Password must be at least 6 characters long. Please choose a stronger password.'
                });
                toast.error('Password must be at least 6 characters.');
            } else if (errorCode === 'auth/invalid-email' || errorMsg.includes('invalid-email')) {
                setSignUpErrors(prev => ({ ...prev, email: 'Invalid email address format.' }));
                setSignUpAlert({
                    type: 'danger',
                    title: 'Invalid Email',
                    message: 'Please provide a valid corporate or personal email address.'
                });
                toast.error('Invalid email address format.');
            } else {
                setSignUpAlert({
                    type: 'danger',
                    title: 'Registration Notice',
                    message: res.error || 'Account creation encountered an issue. Please verify your information and retry.'
                });
                toast.error(res.error || 'Registration failed.');
            }
        } catch (err) {
            toast.dismiss(loading);
            setSubmitting(false);
            setSignUpAlert({
                type: 'danger',
                title: 'Registration Error',
                message: err.message || 'An unexpected error occurred during account creation. Please try again.'
            });
            toast.error(err.message || 'Registration error');
        }
    };

    const handleGoogleAuth = async () => {
        const loading = toast.loading('Connecting with Google...');
        try {
            const res = await firebaseGoogleSignIn();
            toast.dismiss(loading);
            if (res.success && res.user) {
                registerUserAccount(res.user);
                finalizeAuthSession(res.user);
            } else if (res.error) {
                toast.error(res.error);
            }
        } catch (err) {
            toast.dismiss(loading);
            toast.error(err.message || 'Google authentication error');
        }
    };

    // Forgot Password Submit Handler
    const handleForgotSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setForgotAlert(null);

        const emailErr = validateEmailFormat(forgotEmail);
        if (emailErr) {
            setForgotError(emailErr);
            toast.error(emailErr);
            return;
        }

        setForgotSubmitting(true);
        const loading = toast.loading('Sending password reset email...');

        try {
            const res = await firebaseSendPasswordReset(forgotEmail.trim());
            toast.dismiss(loading);
            setForgotSubmitting(false);

            if (res.success) {
                setForgotSuccess(true);
                toast.success('Password reset email dispatched! Check your inbox.');
            } else {
                const errorCode = res.code || '';
                const errorMsg = (res.error || '').toLowerCase();

                if (errorCode === 'auth/user-not-found' || errorMsg.includes('user-not-found')) {
                    setForgotError('No account found with this email address.');
                    setForgotAlert({
                        type: 'warning',
                        title: 'Account Not Found',
                        message: `We could not find an account associated with "${forgotEmail.trim()}". Please verify the address or create a new account.`
                    });
                    toast.error('No account found with this email.');
                } else if (errorCode === 'auth/invalid-email' || errorMsg.includes('invalid-email')) {
                    setForgotError('Invalid email format.');
                    setForgotAlert({
                        type: 'danger',
                        title: 'Invalid Email',
                        message: 'Please provide a valid corporate or personal email address.'
                    });
                    toast.error('Invalid email address format.');
                } else {
                    setForgotAlert({
                        type: 'danger',
                        title: 'Reset Notice',
                        message: res.error || 'Unable to dispatch reset email right now. Please try again later.'
                    });
                    toast.error(res.error || 'Password reset request failed.');
                }
            }
        } catch (err) {
            toast.dismiss(loading);
            setForgotSubmitting(false);
            setForgotAlert({
                type: 'danger',
                title: 'Reset Error',
                message: err.message || 'An unexpected error occurred. Please try again.'
            });
            toast.error(err.message || 'Reset error');
        }
    };

    const pwdStrength = getPasswordStrength(signUpPassword);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--site-bg, #F8F9FD)', color: 'var(--site-text-main, #0F172A)', display: 'flex', flexDirection: 'column', transition: 'background-color 0.25s ease' }}>
            {/* Minimal Top Header */}
            <header className="py-3 px-4" style={{ backgroundColor: 'var(--site-nav-bg, #FFFFFF)', borderBottom: '1px solid var(--site-border, #E5E0FA)' }}>
                <Container className="d-flex justify-content-between align-items-center">
                    <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faBuffer} style={{ color: 'var(--site-primary, #7355F7)', fontSize: '1.7rem' }} />
                        <span className="fw-bold fs-5" style={{ color: 'var(--site-text-main, #070120)' }}>
                            Kosher <span style={{ color: 'var(--site-primary, #7355F7)' }}>Code</span>
                        </span>
                    </Link>

                    <div className="d-flex align-items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="site-theme-btn d-flex align-items-center justify-content-center"
                            style={{ width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer' }}
                            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        >
                            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                        </button>

                        <Link to="/" className="small fw-semibold text-decoration-none d-flex align-items-center gap-1.5" style={{ color: 'var(--site-text-muted, #555555)' }}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Website
                        </Link>
                    </div>
                </Container>
            </header>

            {/* Main Auth Container */}
            <main className="flex-grow-1 d-flex align-items-center py-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <div 
                                className="p-4 p-sm-5"
                                style={{
                                    backgroundColor: 'var(--site-card-bg, #FFFFFF)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--site-border, #E5E0FA)',
                                    boxShadow: 'var(--site-shadow-md, 0 8px 30px rgba(115, 85, 247, 0.07))'
                                }}
                            >
                                {/* Header / Icon */}
                                <div className="text-center mb-4">
                                    <div 
                                        className="d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '54px',
                                            height: '54px',
                                            borderRadius: '8px',
                                            backgroundColor: authRole === 'admin' ? 'rgba(139, 92, 246, 0.2)' : 'var(--site-primary-subtle, #F4F0FF)',
                                            color: 'var(--site-primary, #7355F7)',
                                            border: '1px solid var(--site-border, #E5E0FA)'
                                        }}
                                    >
                                        <FontAwesomeIcon 
                                            icon={mode === 'forgot' ? faKey : (authRole === 'admin' ? faUserShield : faUser)} 
                                            style={{ fontSize: '1.45rem' }} 
                                        />
                                    </div>
                                    <h4 className="fw-bold mb-1" style={{ color: 'var(--site-text-main, #070120)' }}>
                                        {mode === 'forgot' 
                                            ? 'Password Recovery' 
                                            : (authRole === 'admin' ? 'Administrator Command Portal' : 'Enterprise Client Workspace')}
                                    </h4>
                                    <p className="small mb-0" style={{ color: 'var(--site-text-muted, #666666)' }}>
                                        {mode === 'forgot'
                                            ? 'Request a secure password reset link to be sent to your inbox.'
                                            : (authRole === 'admin'
                                                ? 'Sign in to access inbound requests, publish catalog solutions, and manage privileges.'
                                                : 'Sign in or create an account to book bank-grade solutions and manage deployments.')}
                                    </p>
                                </div>

                                {/* Mode Switcher Tabs (Sign In vs Sign Up) - Hidden during Forgot Password */}
                                {authRole === 'client' && mode !== 'forgot' && (
                                    <div className="d-flex gap-2 mb-4 p-1.5 rounded" style={{ backgroundColor: 'var(--site-card-subtle, #FAF8FF)', border: '1px solid var(--site-border, #E5E0FA)' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchMode('signin')}
                                            className="btn btn-sm flex-fill py-2 fw-semibold"
                                            style={{
                                                borderRadius: '4px',
                                                fontSize: '0.86rem',
                                                backgroundColor: mode === 'signin' ? 'var(--site-primary, #7355F7)' : 'transparent',
                                                color: mode === 'signin' ? '#FFFFFF' : 'var(--site-text-muted, #555555)',
                                                border: 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faSignInAlt} className="me-1.5" /> Sign In
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchMode('signup')}
                                            className="btn btn-sm flex-fill py-2 fw-semibold"
                                            style={{
                                                borderRadius: '4px',
                                                fontSize: '0.86rem',
                                                backgroundColor: mode === 'signup' ? 'var(--site-primary, #7355F7)' : 'transparent',
                                                color: mode === 'signup' ? '#FFFFFF' : 'var(--site-text-muted, #555555)',
                                                border: 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faUserPlus} className="me-1.5" /> Create Account
                                        </button>
                                    </div>
                                )}

                                {/* SIGN IN ALERT BANNER */}
                                {mode === 'signin' && signInAlert && (
                                    <div 
                                        className="d-flex align-items-start gap-2.5 p-3 mb-3.5 rounded"
                                        style={{ 
                                            fontSize: '0.85rem',
                                            border: signInAlert.type === 'danger' 
                                                ? '1px solid #FECDD3' 
                                                : (signInAlert.type === 'warning' ? '1px solid #FED7AA' : '1px solid #BAE6FD'),
                                            backgroundColor: signInAlert.type === 'danger' 
                                                ? 'rgba(239, 68, 68, 0.08)' 
                                                : (signInAlert.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(14, 165, 233, 0.08)'),
                                            color: signInAlert.type === 'danger' 
                                                ? '#991B1B' 
                                                : (signInAlert.type === 'warning' ? '#9A3412' : '#075985')
                                        }}
                                    >
                                        <FontAwesomeIcon 
                                            icon={signInAlert.type === 'danger' ? faExclamationCircle : faExclamationTriangle} 
                                            className="mt-0.5" 
                                            style={{ fontSize: '1rem', flexShrink: 0 }}
                                        />
                                        <div className="flex-grow-1">
                                            {signInAlert.title && (
                                                <div className="fw-bold mb-0.5">{signInAlert.title}</div>
                                            )}
                                            <div>{signInAlert.message}</div>
                                            {signInAlert.action === 'signup' && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleSwitchMode('signup');
                                                        setSignUpEmail(signInEmail);
                                                    }}
                                                    className="btn btn-sm mt-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                                                    style={{ 
                                                        fontSize: '0.78rem', 
                                                        borderRadius: '4px',
                                                        backgroundColor: 'var(--site-primary, #7355F7)',
                                                        color: '#FFFFFF',
                                                        border: 'none'
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faUserPlus} /> Create Account with this Email &rarr;
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSignInAlert(null)}
                                            className="btn-close ms-1"
                                            aria-label="Close"
                                            style={{ fontSize: '0.65rem', flexShrink: 0 }}
                                        />
                                    </div>
                                )}

                                {/* SIGN UP ALERT BANNER */}
                                {mode === 'signup' && signUpAlert && (
                                    <div 
                                        className="d-flex align-items-start gap-2.5 p-3 mb-3.5 rounded"
                                        style={{ 
                                            fontSize: '0.85rem',
                                            border: signUpAlert.type === 'danger' 
                                                ? '1px solid #FECDD3' 
                                                : (signUpAlert.type === 'warning' ? '1px solid #FED7AA' : '1px solid #BAE6FD'),
                                            backgroundColor: signUpAlert.type === 'danger' 
                                                ? 'rgba(239, 68, 68, 0.08)' 
                                                : (signUpAlert.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(14, 165, 233, 0.08)'),
                                            color: signUpAlert.type === 'danger' 
                                                ? '#991B1B' 
                                                : (signUpAlert.type === 'warning' ? '#9A3412' : '#075985')
                                        }}
                                    >
                                        <FontAwesomeIcon 
                                            icon={signUpAlert.type === 'danger' ? faExclamationCircle : faExclamationTriangle} 
                                            className="mt-0.5" 
                                            style={{ fontSize: '1rem', flexShrink: 0 }}
                                        />
                                        <div className="flex-grow-1">
                                            {signUpAlert.title && (
                                                <div className="fw-bold mb-0.5">{signUpAlert.title}</div>
                                            )}
                                            <div>{signUpAlert.message}</div>
                                            {signUpAlert.action === 'signin' && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleSwitchMode('signin');
                                                        setSignInEmail(signUpEmail);
                                                    }}
                                                    className="btn btn-sm mt-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                                                    style={{ 
                                                        fontSize: '0.78rem', 
                                                        borderRadius: '4px',
                                                        backgroundColor: 'var(--site-primary, #7355F7)',
                                                        color: '#FFFFFF',
                                                        border: 'none'
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faSignInAlt} /> Switch to Sign In &rarr;
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSignUpAlert(null)}
                                            className="btn-close ms-1"
                                            aria-label="Close"
                                            style={{ fontSize: '0.65rem', flexShrink: 0 }}
                                        />
                                    </div>
                                )}

                                {/* 1. SIGN IN FORM */}
                                {mode === 'signin' && (
                                    <Form onSubmit={handleSignInSubmit} noValidate>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main, #0F172A)' }}>
                                                {authRole === 'admin' ? 'Administrator Email *' : 'Corporate / Personal Email *'}
                                            </Form.Label>
                                            <div className="input-group">
                                                <span 
                                                    className="input-group-text border-end-0" 
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-subtle)', 
                                                        borderColor: signInErrors.email ? '#EF4444' : 'var(--site-border)', 
                                                        borderRadius: '4px 0 0 4px', 
                                                        color: signInErrors.email ? '#EF4444' : 'var(--site-text-muted)' 
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEnvelope} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="email"
                                                    autoComplete="email"
                                                    value={signInEmail}
                                                    onChange={(e) => {
                                                        setSignInEmail(e.target.value);
                                                        if (signInErrors.email) setSignInErrors(prev => ({ ...prev, email: '' }));
                                                        if (signInAlert) setSignInAlert(null);
                                                    }}
                                                    placeholder={authRole === 'admin' ? "admin@koshercode.com" : "e.g. name@company.com"}
                                                    isInvalid={!!signInErrors.email}
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-bg)', 
                                                        borderColor: signInErrors.email ? '#EF4444' : 'var(--site-border)', 
                                                        color: 'var(--site-text-main)', 
                                                        borderRadius: '0 4px 4px 0', 
                                                        padding: '0.7rem 0.85rem' 
                                                    }}
                                                />
                                            </div>
                                            {signInErrors.email && (
                                                <div className="text-danger small mt-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                                                    <FontAwesomeIcon icon={faExclamationCircle} /> {signInErrors.email}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <Form.Label className="fw-semibold small mb-0" style={{ color: 'var(--site-text-main, #0F172A)' }}>
                                                    Password *
                                                </Form.Label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMode('forgot');
                                                        setForgotEmail(signInEmail || '');
                                                        setForgotAlert(null);
                                                        setForgotSuccess(false);
                                                        setForgotError('');
                                                    }}
                                                    className="btn btn-link p-0 small text-decoration-none fw-semibold"
                                                    style={{ color: 'var(--site-primary, #7355F7)', fontSize: '0.8rem' }}
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>
                                            <div className="input-group">
                                                <span 
                                                    className="input-group-text border-end-0" 
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-subtle)', 
                                                        borderColor: signInErrors.password ? '#EF4444' : 'var(--site-border)', 
                                                        borderRadius: '4px 0 0 4px', 
                                                        color: signInErrors.password ? '#EF4444' : 'var(--site-text-muted)' 
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faLock} className="small" />
                                                </span>
                                                <Form.Control
                                                    type={showSignInPassword ? "text" : "password"}
                                                    autoComplete="current-password"
                                                    value={signInPassword}
                                                    onChange={(e) => {
                                                        setSignInPassword(e.target.value);
                                                        if (signInErrors.password) setSignInErrors(prev => ({ ...prev, password: '' }));
                                                        if (signInAlert) setSignInAlert(null);
                                                    }}
                                                    placeholder="Enter your password"
                                                    isInvalid={!!signInErrors.password}
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-bg)', 
                                                        borderColor: signInErrors.password ? '#EF4444' : 'var(--site-border)', 
                                                        color: 'var(--site-text-main)', 
                                                        borderRadius: 0, 
                                                        padding: '0.7rem 0.85rem' 
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="input-group-text border-start-0"
                                                    onClick={() => setShowSignInPassword(prev => !prev)}
                                                    style={{
                                                        backgroundColor: 'var(--site-card-subtle)',
                                                        borderColor: signInErrors.password ? '#EF4444' : 'var(--site-border)',
                                                        color: showSignInPassword ? 'var(--site-primary, #7355F7)' : 'var(--site-text-muted)',
                                                        borderRadius: '0 4px 4px 0',
                                                        cursor: 'pointer',
                                                        padding: '0 0.85rem'
                                                    }}
                                                    title={showSignInPassword ? "Hide password" : "Show password"}
                                                    aria-label={showSignInPassword ? "Hide password" : "Show password"}
                                                >
                                                    <FontAwesomeIcon icon={showSignInPassword ? faEyeSlash : faEye} className="small" />
                                                </button>
                                            </div>
                                            {signInErrors.password && (
                                                <div className="text-danger small mt-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                                                    <FontAwesomeIcon icon={faExclamationCircle} /> {signInErrors.password}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-100 py-2.5 fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
                                            style={{
                                                backgroundColor: 'var(--site-primary, #7355F7)',
                                                borderColor: 'var(--site-primary, #7355F7)',
                                                borderRadius: '4px',
                                                fontSize: '0.95rem',
                                                boxShadow: '0 4px 14px rgba(115, 85, 247, 0.3)'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faSignInAlt} /> {submitting ? 'Authenticating...' : (authRole === 'admin' ? 'Access Admin Command Center' : 'Sign In to Client Workspace')}
                                        </Button>

                                        <div className="d-flex align-items-center my-3">
                                            <hr className="flex-grow-1 my-0" style={{ borderColor: 'var(--site-border)' }} />
                                            <span className="px-2 small text-uppercase fw-semibold" style={{ color: 'var(--site-text-muted)', fontSize: '0.72rem' }}>or continue with</span>
                                            <hr className="flex-grow-1 my-0" style={{ borderColor: 'var(--site-border)' }} />
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={handleGoogleAuth}
                                            className="w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                            style={{
                                                backgroundColor: 'var(--site-card-bg)',
                                                borderColor: 'var(--site-border)',
                                                color: 'var(--site-text-main)',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faGoogle} style={{ color: '#EA4335' }} /> Sign In with Google
                                        </Button>

                                        {authRole === 'client' && (
                                            <div className="text-center mt-3 pt-3 border-top" style={{ borderColor: 'var(--site-border)' }}>
                                                <span className="small" style={{ color: 'var(--site-text-muted)' }}>Don't have a client account? </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSwitchMode('signup')}
                                                    className="btn btn-link p-0 small fw-semibold text-decoration-none"
                                                    style={{ color: 'var(--site-primary, #7355F7)' }}
                                                >
                                                    Create an account
                                                </button>
                                            </div>
                                        )}
                                        {authRole === 'admin' && (
                                            <div className="text-center mt-3 pt-3 border-top" style={{ borderColor: 'var(--site-border)' }}>
                                                <Link to="/client/login" className="small text-decoration-none" style={{ color: 'var(--site-text-muted)' }}>
                                                    &larr; Switch to Client Portal Login
                                                </Link>
                                            </div>
                                        )}
                                    </Form>
                                )}

                                {/* 2. SIGN UP FORM */}
                                {mode === 'signup' && authRole === 'client' && (
                                    <Form onSubmit={handleSignUpSubmit} noValidate>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>
                                                Full Name / Representative *
                                            </Form.Label>
                                            <div className="input-group">
                                                <span 
                                                    className="input-group-text border-end-0" 
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-subtle)', 
                                                        borderColor: signUpErrors.name ? '#EF4444' : 'var(--site-border)', 
                                                        borderRadius: '4px 0 0 4px', 
                                                        color: signUpErrors.name ? '#EF4444' : 'var(--site-text-muted)' 
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faUser} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="text"
                                                    autoComplete="name"
                                                    value={signUpName}
                                                    onChange={(e) => {
                                                        setSignUpName(e.target.value);
                                                        if (signUpErrors.name) setSignUpErrors(prev => ({ ...prev, name: '' }));
                                                        if (signUpAlert) setSignUpAlert(null);
                                                    }}
                                                    placeholder="e.g. Sarah Akello"
                                                    isInvalid={!!signUpErrors.name}
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-bg)', 
                                                        borderColor: signUpErrors.name ? '#EF4444' : 'var(--site-border)', 
                                                        color: 'var(--site-text-main)', 
                                                        borderRadius: '0 4px 4px 0', 
                                                        padding: '0.65rem 0.85rem' 
                                                    }}
                                                />
                                            </div>
                                            {signUpErrors.name && (
                                                <div className="text-danger small mt-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                                                    <FontAwesomeIcon icon={faExclamationCircle} /> {signUpErrors.name}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>
                                                Organization / Institution
                                            </Form.Label>
                                            <div className="input-group">
                                                <span 
                                                    className="input-group-text border-end-0" 
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-subtle)', 
                                                        borderColor: 'var(--site-border)', 
                                                        borderRadius: '4px 0 0 4px', 
                                                        color: 'var(--site-text-muted)' 
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faBuilding} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="text"
                                                    autoComplete="organization"
                                                    value={signUpOrg}
                                                    onChange={(e) => setSignUpOrg(e.target.value)}
                                                    placeholder="e.g. Equatorial FinTech Ltd"
                                                    style={{ backgroundColor: 'var(--site-card-bg)', borderColor: 'var(--site-border)', color: 'var(--site-text-main)', borderRadius: '0 4px 4px 0', padding: '0.65rem 0.85rem' }}
                                                />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>
                                                Corporate / Personal Email *
                                            </Form.Label>
                                            <div className="input-group">
                                                <span 
                                                    className="input-group-text border-end-0" 
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-subtle)', 
                                                        borderColor: signUpErrors.email ? '#EF4444' : 'var(--site-border)', 
                                                        borderRadius: '4px 0 0 4px', 
                                                        color: signUpErrors.email ? '#EF4444' : 'var(--site-text-muted)' 
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEnvelope} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="email"
                                                    autoComplete="email"
                                                    value={signUpEmail}
                                                    onChange={(e) => {
                                                        setSignUpEmail(e.target.value);
                                                        if (signUpErrors.email) setSignUpErrors(prev => ({ ...prev, email: '' }));
                                                        if (signUpAlert) setSignUpAlert(null);
                                                    }}
                                                    placeholder="e.g. sarah@equatorialpay.com"
                                                    isInvalid={!!signUpErrors.email}
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-bg)', 
                                                        borderColor: signUpErrors.email ? '#EF4444' : 'var(--site-border)', 
                                                        color: 'var(--site-text-main)', 
                                                        borderRadius: '0 4px 4px 0', 
                                                        padding: '0.65rem 0.85rem' 
                                                    }}
                                                />
                                            </div>
                                            {signUpErrors.email && (
                                                <div className="text-danger small mt-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                                                    <FontAwesomeIcon icon={faExclamationCircle} /> {signUpErrors.email}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>
                                                Password (min 6 characters) *
                                            </Form.Label>
                                            <div className="input-group">
                                                <span 
                                                    className="input-group-text border-end-0" 
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-subtle)', 
                                                        borderColor: signUpErrors.password ? '#EF4444' : 'var(--site-border)', 
                                                        borderRadius: '4px 0 0 4px', 
                                                        color: signUpErrors.password ? '#EF4444' : 'var(--site-text-muted)' 
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faLock} className="small" />
                                                </span>
                                                <Form.Control
                                                    type={showSignUpPassword ? "text" : "password"}
                                                    minLength={6}
                                                    autoComplete="new-password"
                                                    value={signUpPassword}
                                                    onChange={(e) => {
                                                        setSignUpPassword(e.target.value);
                                                        if (signUpErrors.password) setSignUpErrors(prev => ({ ...prev, password: '' }));
                                                        if (signUpAlert) setSignUpAlert(null);
                                                    }}
                                                    placeholder="Create secure password (min 6 chars)"
                                                    isInvalid={!!signUpErrors.password}
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-bg)', 
                                                        borderColor: signUpErrors.password ? '#EF4444' : 'var(--site-border)', 
                                                        color: 'var(--site-text-main)', 
                                                        borderRadius: 0, 
                                                        padding: '0.65rem 0.85rem' 
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="input-group-text border-start-0"
                                                    onClick={() => setShowSignUpPassword(prev => !prev)}
                                                    style={{
                                                        backgroundColor: 'var(--site-card-subtle)',
                                                        borderColor: signUpErrors.password ? '#EF4444' : 'var(--site-border)',
                                                        color: showSignUpPassword ? 'var(--site-primary, #7355F7)' : 'var(--site-text-muted)',
                                                        borderRadius: '0 4px 4px 0',
                                                        cursor: 'pointer',
                                                        padding: '0 0.85rem'
                                                    }}
                                                    title={showSignUpPassword ? "Hide password" : "Show password"}
                                                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                                                >
                                                    <FontAwesomeIcon icon={showSignUpPassword ? faEyeSlash : faEye} className="small" />
                                                </button>
                                            </div>

                                            {/* Dynamic Password Strength Indicator */}
                                            {signUpPassword && (
                                                <div className="mt-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.74rem' }}>
                                                        <span style={{ color: 'var(--site-text-muted)' }}>Password strength:</span>
                                                        <span style={{ color: pwdStrength.color, fontWeight: 600 }}>{pwdStrength.label}</span>
                                                    </div>
                                                    <div className="progress" style={{ height: '4px', backgroundColor: 'var(--site-border)' }}>
                                                        <div 
                                                            className="progress-bar" 
                                                            role="progressbar" 
                                                            style={{ 
                                                                width: pwdStrength.width, 
                                                                backgroundColor: pwdStrength.color, 
                                                                transition: 'width 0.25s ease' 
                                                            }} 
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {signUpErrors.password && (
                                                <div className="text-danger small mt-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                                                    <FontAwesomeIcon icon={faExclamationCircle} /> {signUpErrors.password}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-100 py-2.5 fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
                                            style={{
                                                backgroundColor: 'var(--site-primary, #7355F7)',
                                                borderColor: 'var(--site-primary, #7355F7)',
                                                borderRadius: '4px',
                                                fontSize: '0.95rem',
                                                boxShadow: '0 4px 14px rgba(115, 85, 247, 0.3)'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faUserPlus} /> {submitting ? 'Creating Workspace...' : 'Create Account & Enter Portal'}
                                        </Button>

                                        <div className="d-flex align-items-center my-3">
                                            <hr className="flex-grow-1 my-0" style={{ borderColor: 'var(--site-border)' }} />
                                            <span className="px-2 small text-uppercase fw-semibold" style={{ color: 'var(--site-text-muted)', fontSize: '0.72rem' }}>or continue with</span>
                                            <hr className="flex-grow-1 my-0" style={{ borderColor: 'var(--site-border)' }} />
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={handleGoogleAuth}
                                            className="w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                            style={{
                                                backgroundColor: 'var(--site-card-bg)',
                                                borderColor: 'var(--site-border)',
                                                color: 'var(--site-text-main)',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faGoogle} style={{ color: '#EA4335' }} /> Sign Up with Google
                                        </Button>

                                        <div className="text-center mt-3 pt-3 border-top" style={{ borderColor: 'var(--site-border)' }}>
                                            <span className="small" style={{ color: 'var(--site-text-muted)' }}>Already have a client account? </span>
                                            <button
                                                type="button"
                                                onClick={() => handleSwitchMode('signin')}
                                                className="btn btn-link p-0 small fw-semibold text-decoration-none"
                                                style={{ color: 'var(--site-primary, #7355F7)' }}
                                            >
                                                Sign in here
                                            </button>
                                        </div>
                                    </Form>
                                )}

                                {/* 3. FORGOT PASSWORD VIEW */}
                                {mode === 'forgot' && (
                                    <div>
                                        {forgotSuccess ? (
                                            /* Confirmation Sent View */
                                            <div className="text-center py-2">
                                                <div 
                                                    className="d-inline-flex align-items-center justify-content-center mb-3"
                                                    style={{
                                                        width: '64px',
                                                        height: '64px',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                                        color: '#10B981'
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '2.2rem' }} />
                                                </div>
                                                <h5 className="fw-bold mb-2" style={{ color: 'var(--site-text-main)' }}>Reset Link Dispatched!</h5>
                                                <p className="small mb-4" style={{ color: 'var(--site-text-muted)', lineHeight: '1.6' }}>
                                                    A confirmation email with secure password reset instructions has been sent to <br />
                                                    <span className="fw-bold" style={{ color: 'var(--site-text-main)' }}>{forgotEmail}</span>.
                                                </p>

                                                <div 
                                                    className="p-3 mb-4 rounded text-start" 
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-subtle)', 
                                                        border: '1px solid var(--site-border)', 
                                                        fontSize: '0.82rem', 
                                                        color: 'var(--site-text-muted)' 
                                                    }}
                                                >
                                                    <div className="fw-bold mb-1.5" style={{ color: 'var(--site-text-main)' }}>
                                                        <FontAwesomeIcon icon={faInfoCircle} className="me-1.5" style={{ color: 'var(--site-primary)' }} /> Next Steps:
                                                    </div>
                                                    <ol className="ps-3 mb-0" style={{ lineHeight: '1.6' }}>
                                                        <li>Open your email inbox and look for the email from Kosher Code.</li>
                                                        <li>Check your spam or junk folder if it doesn't appear within 2 minutes.</li>
                                                        <li>Click the password reset link inside the email and choose a new password.</li>
                                                    </ol>
                                                </div>

                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        handleSwitchMode('signin');
                                                        setSignInEmail(forgotEmail);
                                                        setSignInPassword('');
                                                    }}
                                                    className="w-100 py-2.5 fw-semibold text-white d-flex align-items-center justify-content-center gap-2 mb-3"
                                                    style={{
                                                        backgroundColor: 'var(--site-primary, #7355F7)',
                                                        borderColor: 'var(--site-primary, #7355F7)',
                                                        borderRadius: '4px',
                                                        fontSize: '0.92rem'
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faSignInAlt} /> Return to Sign In
                                                </Button>

                                                <button
                                                    type="button"
                                                    disabled={forgotSubmitting}
                                                    onClick={handleForgotSubmit}
                                                    className="btn btn-link p-0 small text-decoration-none"
                                                    style={{ color: 'var(--site-primary, #7355F7)', fontSize: '0.82rem' }}
                                                >
                                                    Didn't receive email? Click here to resend
                                                </button>
                                            </div>
                                        ) : (
                                            /* Email Request Input Form */
                                            <Form onSubmit={handleForgotSubmit} noValidate>
                                                {forgotAlert && (
                                                    <div 
                                                        className="d-flex align-items-start gap-2.5 p-3 mb-3.5 rounded"
                                                        style={{ 
                                                            fontSize: '0.85rem',
                                                            border: forgotAlert.type === 'danger' ? '1px solid #FECDD3' : '1px solid #FED7AA',
                                                            backgroundColor: forgotAlert.type === 'danger' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.1)',
                                                            color: forgotAlert.type === 'danger' ? '#991B1B' : '#9A3412'
                                                        }}
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={forgotAlert.type === 'danger' ? faExclamationCircle : faExclamationTriangle} 
                                                            className="mt-0.5" 
                                                            style={{ fontSize: '1rem', flexShrink: 0 }}
                                                        />
                                                        <div className="flex-grow-1">
                                                            {forgotAlert.title && <div className="fw-bold mb-0.5">{forgotAlert.title}</div>}
                                                            <div>{forgotAlert.message}</div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setForgotAlert(null)}
                                                            className="btn-close ms-1"
                                                            aria-label="Close"
                                                            style={{ fontSize: '0.65rem', flexShrink: 0 }}
                                                        />
                                                    </div>
                                                )}

                                                <Form.Group className="mb-4">
                                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>
                                                        Registered Account Email *
                                                    </Form.Label>
                                                    <div className="input-group">
                                                        <span 
                                                            className="input-group-text border-end-0" 
                                                            style={{ 
                                                                backgroundColor: 'var(--site-card-subtle)', 
                                                                borderColor: forgotError ? '#EF4444' : 'var(--site-border)', 
                                                                borderRadius: '4px 0 0 4px', 
                                                                color: forgotError ? '#EF4444' : 'var(--site-text-muted)' 
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faEnvelope} className="small" />
                                                        </span>
                                                        <Form.Control
                                                            type="email"
                                                            autoComplete="email"
                                                            value={forgotEmail}
                                                            onChange={(e) => {
                                                                setForgotEmail(e.target.value);
                                                                if (forgotError) setForgotError('');
                                                                if (forgotAlert) setForgotAlert(null);
                                                            }}
                                                            placeholder="e.g. name@organization.com"
                                                            isInvalid={!!forgotError}
                                                            style={{ 
                                                                backgroundColor: 'var(--site-card-bg)', 
                                                                borderColor: forgotError ? '#EF4444' : 'var(--site-border)', 
                                                                color: 'var(--site-text-main)', 
                                                                borderRadius: '0 4px 4px 0', 
                                                                padding: '0.7rem 0.85rem' 
                                                            }}
                                                        />
                                                    </div>
                                                    {forgotError && (
                                                        <div className="text-danger small mt-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                                                            <FontAwesomeIcon icon={faExclamationCircle} /> {forgotError}
                                                        </div>
                                                    )}
                                                </Form.Group>

                                                <Button
                                                    type="submit"
                                                    disabled={forgotSubmitting}
                                                    className="w-100 py-2.5 fw-semibold text-white d-flex align-items-center justify-content-center gap-2 mb-3"
                                                    style={{
                                                        backgroundColor: 'var(--site-primary, #7355F7)',
                                                        borderColor: 'var(--site-primary, #7355F7)',
                                                        borderRadius: '4px',
                                                        fontSize: '0.95rem',
                                                        boxShadow: '0 4px 14px rgba(115, 85, 247, 0.3)'
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faKey} /> {forgotSubmitting ? 'Sending Reset Link...' : 'Send Password Reset Link'}
                                                </Button>

                                                <div className="text-center pt-3 border-top" style={{ borderColor: 'var(--site-border)' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSwitchMode('signin')}
                                                        className="btn btn-link p-0 small fw-semibold text-decoration-none d-inline-flex align-items-center gap-1.5"
                                                        style={{ color: 'var(--site-text-muted)' }}
                                                    >
                                                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Sign In
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

export default ClientAuth;
