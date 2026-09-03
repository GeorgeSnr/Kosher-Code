import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTachometerAlt, 
    faInbox, 
    faFileMedical, 
    faCog, 
    faUserShield, 
    faUserCircle, 
    faGlobe,
    faShieldAlt,
    faChevronUp,
    faChevronDown,
    faSignOutAlt,
    faUniversity,
    faPiggyBank,
    faChartLine,
    faMobileAlt,
    faServer,
    faSun,
    faMoon,
    faClock,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faBuffer } from '@fortawesome/free-brands-svg-icons';
import AdminLanding from './AdminLanding';
import OrderList from '../Dashoboard/OrderList/OrderList';
import AddService from '../Dashoboard/AddService/AddService';
import ManageServices from '../Dashoboard/ManageServices/ManageServices';
import MakeAdmin from '../Dashoboard/MakeAdmin/MakeAdmin';
import AdminProfile from './AdminProfile';
import '../ClientPortal/ClientSidebar.css';
import '../Dashoboard/Dashboard/Dashboard.css';
import { SET_USER, SET_ADMIN, useAppContext } from '../../context';
import { getStoredOrders, getStoredAdmins } from '../../services/storageService';
import userImg from '../../Assets/user.svg';
import UserAvatar from '../Shared/UserAvatar/UserAvatar';
import toast from 'react-hot-toast';

const AdminPortal = () => {
    const { state: { user }, dispatch } = useAppContext();
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('kosher_admin_sidebar_open');
        if (saved !== null) return saved === 'true';
        return true;
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 991 : false);
    const [title, setTitle] = useState('Command Center');

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 991;
            setIsMobile(mobile);
            if (!mobile) {
                setMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleToggleSidebar = () => {
        if (window.innerWidth <= 991) {
            setMobileOpen(prev => !prev);
        } else {
            setSidebarOpen(prev => {
                const next = !prev;
                localStorage.setItem('kosher_admin_sidebar_open', next.toString());
                return next;
            });
        }
    };

    // Theme Switch Engine
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
        toast(nextTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated', {
            icon: nextTheme === 'dark' ? '🌙' : '☀️',
            style: {
                borderRadius: '4px',
                background: nextTheme === 'dark' ? '#1E293B' : '#FFFFFF',
                color: nextTheme === 'dark' ? '#F8FAFC' : '#0F172A',
                border: '1px solid ' + (nextTheme === 'dark' ? '#334155' : '#E2E8F0'),
            },
        });
    };

    // Collapsible Sections
    const [opsOpen, setOpsOpen] = useState(true);
    const [catalogOpen, setCatalogOpen] = useState(true);
    const [telemetryOpen, setTelemetryOpen] = useState(false);

    // User settings popover
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navigate = useNavigate();

    const orders = getStoredOrders();
    const admins = getStoredAdmins();
    const displayName = user?.name || 'Super Administrator';
    const displayEmail = user?.email || 'georgewilliamochole@gmail.com';
    const displayImg = user?.img || userImg;

    const handleSignOut = () => {
        localStorage.removeItem('kosher_current_user');
        localStorage.removeItem('token');
        dispatch({ type: SET_USER, payload: { isSignedIn: false, email: '', name: '' } });
        dispatch({ type: SET_ADMIN, payload: false });
        toast.success('Admin session ended');
        navigate('/login');
    };

    const handleNavClick = (pageTitle) => {
        setTitle(pageTitle);
        setMobileOpen(false);
        setShowUserMenu(false);
    };

    return (
        <div id="dashboard" data-theme={theme} className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
            {/* Mobile Backdrop */}
            <div 
                className={`client-sidebar-backdrop ${mobileOpen ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`client-sidebar ${mobileOpen ? 'mobile-open' : ''} ${!sidebarOpen ? 'desktop-closed' : ''}`}>
                {/* 1. Header with Brand & Interactive Theme Switch Toggle */}
                <div className="cs-header">
                    <Link to="/" onClick={() => setMobileOpen(false)} className="cs-brand">
                        <div className="cs-brand-icon">
                            <FontAwesomeIcon icon={faBuffer} />
                        </div>
                        <span className="cs-brand-name">Kosher <span style={{ color: 'var(--cp-primary)' }}>Admin</span></span>
                    </Link>

                    <div 
                        className={`cs-toggle-pill ${theme === 'dark' ? 'checked' : ''}`}
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                    >
                        <div className="cs-toggle-dot">
                            <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
                        </div>
                    </div>
                </div>

                {/* Distinct Admin Badge */}
                <div className="px-2 mb-2">
                    <div 
                        className="py-1.5 px-2.5 text-center small fw-semibold d-flex align-items-center justify-content-center gap-1.5"
                        style={{
                            borderRadius: '4px',
                            backgroundColor: 'var(--cp-primary-subtle)',
                            color: 'var(--cp-primary-text)',
                            border: '1px solid var(--cp-border-highlight)',
                            fontSize: '0.75rem',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase'
                        }}
                    >
                        <FontAwesomeIcon icon={faShieldAlt} />
                        Executive Control Center
                    </div>
                </div>

                {/* 2. Scrollable Navigation List */}
                <div className="cs-nav-scroll">
                    {/* Top Fast Links */}
                    <div className="cs-top-group">
                        <NavLink 
                            to="/admin" 
                            end
                            onClick={() => handleNavClick('Command Center Overview')}
                            className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="cs-nav-item-left">
                                <FontAwesomeIcon icon={faTachometerAlt} className="cs-icon" />
                                <span>Overview</span>
                            </div>
                        </NavLink>

                        <NavLink 
                            to="/admin/orders" 
                            onClick={() => handleNavClick('Incoming Inquiries & Pipeline')}
                            className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="cs-nav-item-left">
                                <FontAwesomeIcon icon={faInbox} className="cs-icon" />
                                <span>Inbound Requests</span>
                            </div>
                            {orders.length > 0 ? (
                                <span className="cs-badge-pill">{orders.length}</span>
                            ) : (
                                <div className="cs-dot-indicator"></div>
                            )}
                        </NavLink>
                    </div>

                    {/* SECTION 1: OPERATIONS */}
                    <div 
                        className="cs-section-header" 
                        onClick={() => setOpsOpen(!opsOpen)}
                    >
                        <span className="cs-section-title">OPERATIONS</span>
                        <FontAwesomeIcon 
                            icon={opsOpen ? faChevronUp : faChevronDown} 
                            className="cs-section-chevron" 
                        />
                    </div>

                    {opsOpen && (
                        <ul className="cs-nav-list">
                            <li>
                                <NavLink 
                                    to="/admin/orders" 
                                    onClick={() => handleNavClick('Incoming Inquiries & Pipeline')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faInbox} className="cs-icon" />
                                        <span>Client Inquiries</span>
                                    </div>
                                    <span className="cs-badge-pill">{orders.length}</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/admin/add-service" 
                                    onClick={() => handleNavClick('Publish New Solution')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faFileMedical} className="cs-icon" />
                                        <span>Publish Solution</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/admin/services" 
                                    onClick={() => handleNavClick('Manage Solution Catalog')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faCog} className="cs-icon" />
                                        <span>Manage Catalog</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/admin/team" 
                                    onClick={() => handleNavClick('Administrator Privileges')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faUserShield} className="cs-icon" />
                                        <span>Admin Team</span>
                                    </div>
                                    <span className="cs-badge-pill">{admins.length}</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/admin/profile" 
                                    onClick={() => handleNavClick('Executive Profile & Access')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faUserCircle} className="cs-icon" />
                                        <span>Admin Profile</span>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    )}

                    {/* SECTION 2: SOLUTION CATEGORIES */}
                    <div 
                        className="cs-section-header" 
                        onClick={() => setCatalogOpen(!catalogOpen)}
                    >
                        <span className="cs-section-title">SOLUTIONS CATALOG</span>
                        <FontAwesomeIcon 
                            icon={catalogOpen ? faChevronUp : faChevronDown} 
                            className="cs-section-chevron" 
                        />
                    </div>

                    {catalogOpen && (
                        <ul className="cs-nav-list">
                            <li>
                                <NavLink 
                                    to="/admin/services" 
                                    onClick={() => handleNavClick('Core Banking & FinTech Solutions')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faUniversity} className="cs-icon" />
                                        <span>Core Banking</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/admin/services" 
                                    onClick={() => handleNavClick('SACCO & Microfinance Solutions')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faPiggyBank} className="cs-icon" />
                                        <span>SACCO Systems</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/admin/services" 
                                    onClick={() => handleNavClick('MSME Enterprise ERP Solutions')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faChartLine} className="cs-icon" />
                                        <span>MSME ERPs</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/admin/services" 
                                    onClick={() => handleNavClick('Web, Mobile & Cloud Solutions')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faMobileAlt} className="cs-icon" />
                                        <span>Web & Mobile</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>
                        </ul>
                    )}

                    {/* SECTION 3: SYSTEM TELEMETRY */}
                    <div 
                        className="cs-section-header" 
                        onClick={() => setTelemetryOpen(!telemetryOpen)}
                    >
                        <span className="cs-section-title">SYSTEM TELEMETRY</span>
                        <FontAwesomeIcon 
                            icon={telemetryOpen ? faChevronUp : faChevronDown} 
                            className="cs-section-chevron" 
                        />
                    </div>

                    {telemetryOpen && (
                        <ul className="cs-nav-list">
                            <li>
                                <NavLink 
                                    to="/admin/profile" 
                                    onClick={() => handleNavClick('System Health & Infrastructure Telemetry')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faServer} className="cs-icon text-success" />
                                        <span>99.9% Uptime Active</span>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </div>

                {/* 3. Bottom User Profile Card */}
                <div className="cs-footer">
                    {showUserMenu && (
                        <div className="cs-popover-menu">
                            <Link 
                                to="/admin/profile" 
                                onClick={() => handleNavClick('Admin Executive Profile')}
                                className="cs-popover-item"
                            >
                                <FontAwesomeIcon icon={faUserCircle} /> Profile
                            </Link>
                            <Link 
                                to="/" 
                                onClick={() => setShowUserMenu(false)}
                                className="cs-popover-item"
                            >
                                <FontAwesomeIcon icon={faGlobe} /> Back to Website
                            </Link>
                            <button 
                                onClick={handleSignOut}
                                className="cs-popover-item logout"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
                            </button>
                        </div>
                    )}

                    <div className="cs-user-card">
                        <div className="cs-user-left">
                            <UserAvatar 
                                src={displayImg} 
                                name={displayName}
                                role="admin"
                                size="sm"
                                showStatus={true}
                                ring={true}
                                ringType="glow"
                            />

                            <div className="cs-user-info">
                                <div className="cs-user-name">{displayName}</div>
                                <div className="cs-user-email">{displayEmail}</div>
                            </div>
                        </div>

                        <button 
                            type="button"
                            className="cs-settings-btn"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            title="Admin Settings"
                        >
                            <FontAwesomeIcon icon={faCog} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Page Content */}
            <div id="pageContent" className={!sidebarOpen ? 'sidebar-collapsed' : ''}>
                {/* Clean Top Header */}
                <div className="dashBoardHeader">
                    <div className="d-flex align-items-center">
                        <div 
                            id="nav-icon"
                            className={(isMobile ? mobileOpen : sidebarOpen) ? "menu-btn open" : "menu-btn"}
                            onClick={handleToggleSidebar}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleToggleSidebar();
                                }
                            }}
                            title={(isMobile ? mobileOpen : sidebarOpen) ? "Close Sidebar" : "Open Sidebar"}
                            role="button"
                            tabIndex={0}
                            aria-label={(isMobile ? mobileOpen : sidebarOpen) ? "Close Sidebar" : "Open Sidebar"}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div>
                            <h4 className="fw-bold mb-0 ms-1 ms-sm-2" style={{ color: 'var(--cp-text-main)' }}>{title}</h4>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 gap-sm-3">
                        <button 
                            type="button"
                            onClick={toggleTheme}
                            className="btn btn-sm d-flex align-items-center gap-1.5 py-1 px-2.5"
                            style={{ 
                                backgroundColor: 'var(--cp-card-subtle)', 
                                border: '1px solid var(--cp-border)',
                                color: 'var(--cp-text-main)',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 500
                            }}
                            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        >
                            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} style={{ color: 'var(--cp-primary)' }} />
                            <span className="d-none d-md-inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                        </button>

                        <div className="d-none d-md-flex align-items-center gap-1.5 px-2.5 py-1 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', fontSize: '0.78rem' }}>
                            <FontAwesomeIcon icon={faClock} style={{ color: 'var(--cp-primary)' }} />
                            <span className="fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Kampala Admin Desk</span>
                        </div>
                        <span className="badge px-2.5 py-1.5 d-none d-sm-inline-flex align-items-center gap-1" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', border: '1px solid var(--cp-border-highlight)', fontSize: '0.78rem' }}>
                            <FontAwesomeIcon icon={faCheckCircle} /> Superadmin Access
                        </span>
                        <button 
                            type="button" 
                            onClick={handleSignOut}
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1.5 py-1 px-2.5"
                            style={{ borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} /> <span className="d-none d-sm-inline">Exit</span>
                        </button>
                    </div>
                </div>

                {/* Sub-Routes */}
                <Routes>
                    <Route index element={<AdminLanding />} />
                    <Route path="" element={<AdminLanding />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="add-service" element={<AddService />} />
                    <Route path="services" element={<ManageServices />} />
                    <Route path="team" element={<MakeAdmin />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="*" element={<AdminLanding />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPortal;
