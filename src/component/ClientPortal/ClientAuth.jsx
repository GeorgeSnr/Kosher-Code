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
    faMoon
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { SET_USER, SET_ADMIN, useAppContext } from '../../context';
import { checkIsAdmin, saveUserToFirestore, authenticateUserAccount, registerUserAccount } from '../../services/storageService';
import { firebaseLogin, firebaseRegister, firebaseGoogleSignIn } from '../../services/firebaseService';
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
    const fromPath = location.state?.from?.pathname || '';
    const isExplicitAdminPortal = defaultPortal === 'admin' || fromPath.includes('/admin') || location.pathname.includes('/admin');
    const authRole = isExplicitAdminPortal ? 'admin' : 'client';

    const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
    const [submitting, setSubmitting] = useState(false);

    // Sign In Form State
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    // Sign Up Form State
    const [signUpName, setSignUpName] = useState('');
    const [signUpOrg, setSignUpOrg] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');

    const finalizeAuthSession = (userObj) => {
        const isSystemAdmin = checkIsAdmin(userObj.email);
        const isAdmin = userObj.role === 'admin' || (authRole === 'admin' && isSystemAdmin);
        
        // If user targeted Admin Portal but does not have admin privileges, block and redirect to client login
        if (authRole === 'admin' && !isAdmin && !isSystemAdmin) {
            toast.error('Access restricted: This account does not have Administrator privileges. Please sign in via the Client Portal.');
            navigate('/client/login');
            return;
        }

        const resolvedUser = {
            ...userObj,
            role: (isAdmin || isSystemAdmin) ? 'admin' : 'client',
            img: userObj.img || ((isAdmin || isSystemAdmin) 
                ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
                : userImg)
        };

        sessionStorage.setItem('kosher_client_session', JSON.stringify(resolvedUser));
        localStorage.setItem('kosher_current_user', JSON.stringify(resolvedUser));
        dispatch({ type: SET_USER, payload: resolvedUser });
        dispatch({ type: SET_ADMIN, payload: Boolean(isAdmin || isSystemAdmin) });

        // Save / update in Firestore in real-time
        saveUserToFirestore(resolvedUser).catch(err => console.log('Firestore user profile sync:', err.message));

        if (isAdmin || isSystemAdmin) {
            toast.success('Welcome to the Administrator Command Center!');
            navigate('/admin');
        } else {
            toast.success(`Welcome to Kosher Code, ${resolvedUser.name}!`);
            const targetDest = fromPath && !fromPath.includes('/admin') && fromPath !== '/login' && fromPath !== '/client/login'
                ? fromPath
                : '/client';
            navigate(targetDest);
        }
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        if (!signInEmail || !signInPassword) {
            toast.error('Please enter your email and password');
            return;
        }

        setSubmitting(true);
        const loading = toast.loading('Signing in to workspace...');

        try {
            // Attempt real-time Firebase Auth login
            const res = await firebaseLogin(signInEmail, signInPassword);
            toast.dismiss(loading);
            setSubmitting(false);

            if (res.success && res.user) {
                registerUserAccount({ ...res.user, password: signInPassword });
                finalizeAuthSession(res.user);
            } else {
                // Fallback to locally registered / administrator accounts
                const localUser = authenticateUserAccount(signInEmail, signInPassword);
                if (localUser) {
                    finalizeAuthSession(localUser);
                } else {
                    let errorMsg = 'Invalid email or password. Please verify your credentials or create an account.';
                    if (res.error) {
                        if (res.error.includes('invalid-login-credentials') || res.error.includes('wrong-password') || res.error.includes('user-not-found')) {
                            errorMsg = 'Invalid email or password. Please verify your credentials or create an account.';
                        } else {
                            errorMsg = res.error;
                        }
                    }
                    toast.error(errorMsg);
                }
            }
        } catch (err) {
            toast.dismiss(loading);
            setSubmitting(false);
            const localUser = authenticateUserAccount(signInEmail, signInPassword);
            if (localUser) {
                finalizeAuthSession(localUser);
            } else {
                toast.error(err.message || 'Authentication failed. Please verify your credentials.');
            }
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (!signUpName || !signUpEmail || !signUpPassword) {
            toast.error('Please complete all required fields');
            return;
        }

        if (signUpPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setSubmitting(true);
        const loading = toast.loading('Creating account in database realtime...');

        try {
            const res = await firebaseRegister(signUpEmail, signUpPassword, signUpName, 'client', signUpOrg);
            toast.dismiss(loading);
            setSubmitting(false);

            if (res.success && res.user) {
                registerUserAccount({ ...res.user, institution: signUpOrg, password: signUpPassword });
                toast.success('Account successfully created! Please sign in with your credentials.', { duration: 4500 });
                // Populate sign-in inputs and transition to Sign In tab
                setSignInEmail(signUpEmail);
                setSignInPassword(signUpPassword);
                setSignUpName('');
                setSignUpOrg('');
                setSignUpEmail('');
                setSignUpPassword('');
                setMode('signin');
            } else {
                if (res.error && res.error.toLowerCase().includes('already in use')) {
                    toast.error('This email is already registered. Please sign in instead.');
                    setMode('signin');
                    setSignInEmail(signUpEmail);
                    return;
                }
                const registeredUser = registerUserAccount({
                    name: signUpName,
                    email: signUpEmail.toLowerCase(),
                    institution: signUpOrg,
                    role: 'client',
                    password: signUpPassword,
                    isSignedIn: true
                });
                toast.success('Account successfully registered! Please sign in with your credentials.', { duration: 4500 });
                setSignInEmail(signUpEmail);
                setSignInPassword(signUpPassword);
                setSignUpName('');
                setSignUpOrg('');
                setSignUpEmail('');
                setSignUpPassword('');
                setMode('signin');
            }
        } catch (err) {
            toast.dismiss(loading);
            setSubmitting(false);
            registerUserAccount({
                name: signUpName,
                email: signUpEmail.toLowerCase(),
                institution: signUpOrg,
                role: 'client',
                password: signUpPassword,
                isSignedIn: true
            });
            toast.success('Account registered successfully! Please sign in with your credentials.', { duration: 4500 });
            setSignInEmail(signUpEmail);
            setSignInPassword(signUpPassword);
            setSignUpName('');
            setSignUpOrg('');
            setSignUpEmail('');
            setSignUpPassword('');
            setMode('signin');
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
                                    borderRadius: '6px',
                                    border: '1px solid var(--site-border, #E5E0FA)',
                                    boxShadow: 'var(--site-shadow-md, 0 8px 30px rgba(115, 85, 247, 0.07))'
                                }}
                            >
                                {/* Header / Icon */}
                                <div className="text-center mb-4">
                                    <div 
                                        className="d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '52px',
                                            height: '52px',
                                            borderRadius: '6px',
                                            backgroundColor: authRole === 'admin' ? 'rgba(139, 92, 246, 0.2)' : 'var(--site-primary-subtle, #F4F0FF)',
                                            color: 'var(--site-primary, #7355F7)',
                                            border: '1px solid var(--site-border, #E5E0FA)'
                                        }}
                                    >
                                        <FontAwesomeIcon icon={authRole === 'admin' ? faUserShield : faUser} style={{ fontSize: '1.4rem' }} />
                                    </div>
                                    <h4 className="fw-bold mb-1" style={{ color: 'var(--site-text-main, #070120)' }}>
                                        {authRole === 'admin' ? 'Administrator Command Portal' : 'Enterprise Client Workspace'}
                                    </h4>
                                    <p className="small mb-0" style={{ color: 'var(--site-text-muted, #666666)' }}>
                                        {authRole === 'admin'
                                            ? 'Sign in to access inbound requests, publish catalog solutions, and manage privileges.'
                                            : 'Sign in or create an account to book bank-grade solutions and manage deployments.'}
                                    </p>
                                </div>

                                {/* Mode Switcher Tabs (Sign In vs Sign Up) */}
                                {authRole === 'client' && (
                                    <div className="d-flex mb-4 p-1 rounded" style={{ backgroundColor: 'var(--site-card-subtle, #FAF8FF)', border: '1px solid var(--site-border, #E5E0FA)' }}>
                                        <button
                                            type="button"
                                            onClick={() => setMode('signin')}
                                            className="btn btn-sm flex-fill py-2 fw-semibold"
                                            style={{
                                                borderRadius: '3px',
                                                fontSize: '0.84rem',
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
                                            onClick={() => setMode('signup')}
                                            className="btn btn-sm flex-fill py-2 fw-semibold"
                                            style={{
                                                borderRadius: '3px',
                                                fontSize: '0.84rem',
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

                                {/* SIGN IN FORM */}
                                {mode === 'signin' && (
                                    <Form onSubmit={handleSignInSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main, #0F172A)' }}>
                                                {authRole === 'admin' ? 'Administrator Email *' : 'Corporate / Personal Email *'}
                                            </Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--site-card-subtle)', borderColor: 'var(--site-border)', borderRadius: '4px 0 0 4px', color: 'var(--site-text-muted)' }}>
                                                    <FontAwesomeIcon icon={faEnvelope} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    value={signInEmail}
                                                    onChange={(e) => setSignInEmail(e.target.value)}
                                                    placeholder="Corporate / Personal Email"
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-bg)', 
                                                        borderColor: 'var(--site-border)', 
                                                        color: 'var(--site-text-main)', 
                                                        borderRadius: '0 4px 4px 0', 
                                                        padding: '0.7rem 0.85rem' 
                                                    }}
                                                />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main, #0F172A)' }}>Password *</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--site-card-subtle)', borderColor: 'var(--site-border)', borderRadius: '4px 0 0 4px', color: 'var(--site-text-muted)' }}>
                                                    <FontAwesomeIcon icon={faLock} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="password"
                                                    required
                                                    autoComplete="current-password"
                                                    value={signInPassword}
                                                    onChange={(e) => setSignInPassword(e.target.value)}
                                                    placeholder="Password"
                                                    style={{ 
                                                        backgroundColor: 'var(--site-card-bg)', 
                                                        borderColor: 'var(--site-border)', 
                                                        color: 'var(--site-text-main)', 
                                                        borderRadius: '0 4px 4px 0', 
                                                        padding: '0.7rem 0.85rem' 
                                                    }}
                                                />
                                            </div>
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
                                            <FontAwesomeIcon icon={faSignInAlt} /> {authRole === 'admin' ? 'Access Admin Command Center' : 'Sign In to Client Workspace'}
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
                                                    onClick={() => setMode('signup')}
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

                                {/* SIGN UP FORM */}
                                {mode === 'signup' && authRole === 'client' && (
                                    <Form onSubmit={handleSignUpSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>Full Name / Representative *</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--site-card-subtle)', borderColor: 'var(--site-border)', borderRadius: '4px 0 0 4px', color: 'var(--site-text-muted)' }}>
                                                    <FontAwesomeIcon icon={faUser} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="text"
                                                    required
                                                    autoComplete="name"
                                                    value={signUpName}
                                                    onChange={(e) => setSignUpName(e.target.value)}
                                                    placeholder="Full Name / Representative"
                                                    style={{ backgroundColor: 'var(--site-card-bg)', borderColor: 'var(--site-border)', color: 'var(--site-text-main)', borderRadius: '0 4px 4px 0', padding: '0.65rem 0.85rem' }}
                                                />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>Organization / Institution</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--site-card-subtle)', borderColor: 'var(--site-border)', borderRadius: '4px 0 0 4px', color: 'var(--site-text-muted)' }}>
                                                    <FontAwesomeIcon icon={faBuilding} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="text"
                                                    autoComplete="organization"
                                                    value={signUpOrg}
                                                    onChange={(e) => setSignUpOrg(e.target.value)}
                                                    placeholder="Organization / Company Name"
                                                    style={{ backgroundColor: 'var(--site-card-bg)', borderColor: 'var(--site-border)', color: 'var(--site-text-main)', borderRadius: '0 4px 4px 0', padding: '0.65rem 0.85rem' }}
                                                />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>Corporate / Personal Email *</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--site-card-subtle)', borderColor: 'var(--site-border)', borderRadius: '4px 0 0 4px', color: 'var(--site-text-muted)' }}>
                                                    <FontAwesomeIcon icon={faEnvelope} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    value={signUpEmail}
                                                    onChange={(e) => setSignUpEmail(e.target.value)}
                                                    placeholder="Corporate / Personal Email Address"
                                                    style={{ backgroundColor: 'var(--site-card-bg)', borderColor: 'var(--site-border)', color: 'var(--site-text-main)', borderRadius: '0 4px 4px 0', padding: '0.65rem 0.85rem' }}
                                                />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold small" style={{ color: 'var(--site-text-main)' }}>Password (min 6 characters) *</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--site-card-subtle)', borderColor: 'var(--site-border)', borderRadius: '4px 0 0 4px', color: 'var(--site-text-muted)' }}>
                                                    <FontAwesomeIcon icon={faLock} className="small" />
                                                </span>
                                                <Form.Control
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    autoComplete="new-password"
                                                    value={signUpPassword}
                                                    onChange={(e) => setSignUpPassword(e.target.value)}
                                                    placeholder="Password (minimum 6 characters)"
                                                    style={{ backgroundColor: 'var(--site-card-bg)', borderColor: 'var(--site-border)', color: 'var(--site-text-main)', borderRadius: '0 4px 4px 0', padding: '0.65rem 0.85rem' }}
                                                />
                                            </div>
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
                                            <FontAwesomeIcon icon={faUserPlus} /> Create Account & Proceed
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
                                                onClick={() => setMode('signin')}
                                                className="btn btn-link p-0 small fw-semibold text-decoration-none"
                                                style={{ color: 'var(--site-primary, #7355F7)' }}
                                            >
                                                Sign in here
                                            </button>
                                        </div>
                                    </Form>
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
