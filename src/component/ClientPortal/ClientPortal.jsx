import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHome,
    faFileAlt,
    faChartBar,
    faPlusCircle,
    faFolderOpen,
    faFileInvoiceDollar,
    faStar,
    faUserShield,
    faUniversity,
    faPiggyBank,
    faChartLine,
    faMobileAlt,
    faBuilding,
    faBolt,
    faHeadset,
    faChevronUp,
    faChevronDown,
    faCog,
    faSignOutAlt,
    faUser,
    faGlobe,
    faClock,
    faCheckCircle,
    faSun,
    faMoon
} from '@fortawesome/free-solid-svg-icons';
import { faBuffer } from '@fortawesome/free-brands-svg-icons';
import ClientLanding from './ClientLanding';
import Book from '../Dashoboard/UserDashboard/Book/Book';
import BookList from '../Dashoboard/UserDashboard/BookList/BookList';
import Review from '../Dashoboard/UserDashboard/AddReview/Review';
import ClientProfile from './ClientProfile';
import './ClientSidebar.css';
import '../Dashoboard/Dashboard/Dashboard.css';
import { SET_USER, useAppContext } from '../../context';
import { getUserOrders } from '../../services/storageService';
import userImg from '../../Assets/user.svg';
import UserAvatar from '../Shared/UserAvatar/UserAvatar';
import toast from 'react-hot-toast';
import { clearSessionStorage } from '../../services/sessionService';
import { firebaseSignOut } from '../../services/firebaseService';

const ClientPortal = () => {
    const { state: { user }, dispatch } = useAppContext();
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('kosher_client_sidebar_open');
        if (saved !== null) return saved === 'true';
        return true;
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 991 : false);
    const [title, setTitle] = useState('Overview');
    const sidebarRef = useRef(null);
    const toggleBtnRef = useRef(null);

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

    // Gently close / collapse sidebar when clicking or tapping outside or pressing Escape
    useEffect(() => {
        const isCurrentlyOpen = isMobile ? mobileOpen : sidebarOpen;
        if (!isCurrentlyOpen) return;

        const handleClickOutside = (event) => {
            if (
                (sidebarRef.current && sidebarRef.current.contains(event.target)) ||
                (toggleBtnRef.current && toggleBtnRef.current.contains(event.target))
            ) {
                return;
            }

            if (isMobile || (typeof window !== 'undefined' && window.innerWidth <= 991)) {
                setMobileOpen(false);
            } else {
                setSidebarOpen(false);
                localStorage.setItem('kosher_client_sidebar_open', 'false');
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (isMobile || (typeof window !== 'undefined' && window.innerWidth <= 991)) {
                    setMobileOpen(false);
                } else {
                    setSidebarOpen(false);
                    localStorage.setItem('kosher_client_sidebar_open', 'false');
                }
            }
        };

        document.addEventListener('pointerdown', handleClickOutside, true);
        document.addEventListener('click', handleClickOutside, true);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside, true);
            document.removeEventListener('click', handleClickOutside, true);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobile, mobileOpen, sidebarOpen]);

    const handleToggleSidebar = () => {
        if (window.innerWidth <= 991) {
            setMobileOpen(prev => !prev);
        } else {
            setSidebarOpen(prev => {
                const next = !prev;
                localStorage.setItem('kosher_client_sidebar_open', next.toString());
                return next;
            });
        }
    };
    
    // Theme Switch Engine: 'light' | 'dark'
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
    const [workspaceOpen, setWorkspaceOpen] = useState(true);
    const [solutionsOpen, setSolutionsOpen] = useState(true);
    const [supportOpen, setSupportOpen] = useState(false);

    // User settings popover
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navigate = useNavigate();

    const bookings = getUserOrders(user?.email);

    const displayName = user?.name || 'Enterprise Client';
    const displayEmail = user?.email || 'client@koshercode.com';
    const displayImg = user?.img || userImg;

    const handleSignOut = () => {
        clearSessionStorage();
        firebaseSignOut().catch(() => {});
        dispatch({ type: SET_USER, payload: { isSignedIn: false, email: '', name: '' } });
        toast.success('Client session ended');
        navigate('/client/login');
    };

    const handleNavClick = (pageTitle) => {
        setTitle(pageTitle);
        setShowUserMenu(false);

        // Automatically roll back expanded sub-accordion selection lists
        setSolutionsOpen(false);
        setSupportOpen(false);

        // Mobile: gently roll back drawer unconditionally upon selection
        setTimeout(() => {
            setMobileOpen(false);
        }, 140);

        // Desktop: roll back to compact icon rail automatically
        if (typeof window !== 'undefined' && window.innerWidth > 991) {
            setTimeout(() => {
                setSidebarOpen(false);
                localStorage.setItem('kosher_client_sidebar_open', 'false');
            }, 140);
        }
    };

    const handleBrandClick = () => {
        setShowUserMenu(false);
        setTimeout(() => {
            setMobileOpen(false);
        }, 140);
    };

    return (
        <div id="dashboard" data-theme={theme} className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
            {/* Mobile Backdrop */}
            <div 
                className={`client-sidebar-backdrop ${mobileOpen ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                onTouchStart={() => setMobileOpen(false)}
                aria-hidden="true"
            ></div>

            {/* Sidebar */}
            <aside ref={sidebarRef} className={`client-sidebar ${mobileOpen ? 'mobile-open' : ''} ${!sidebarOpen ? 'desktop-collapsed' : ''}`}>
                {/* 1. Header with Brand & Interactive Theme Switch Toggle */}
                <div className="cs-header">
                    <Link to="/" onClick={handleBrandClick} className="cs-brand" title="Kosher Code Home">
                        <div className="cs-brand-icon">
                            <FontAwesomeIcon icon={faBuffer} />
                        </div>
                        <span className="cs-brand-name">Kosher Code</span>
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

                {/* 2. Scrollable Navigation List */}
                <div className="cs-nav-scroll">
                    {/* Top Fast Links */}
                    <div className="cs-top-group">
                        <NavLink 
                            to="/client" 
                            end
                            onClick={() => handleNavClick('Workspace Dashboard')}
                            className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                            title="Workspace Dashboard"
                        >
                            <div className="cs-nav-item-left">
                                <FontAwesomeIcon icon={faHome} className="cs-icon" />
                                <span>Home</span>
                            </div>
                        </NavLink>

                        <NavLink 
                            to="/client/bookings" 
                            onClick={() => handleNavClick('Reports & Deliverables')}
                            className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                            title="Reports & Deliverables"
                        >
                            <div className="cs-nav-item-left">
                                <FontAwesomeIcon icon={faFileAlt} className="cs-icon" />
                                <span>Reports</span>
                            </div>
                            <div className="cs-dot-indicator"></div>
                        </NavLink>
                    </div>

                    {/* SECTION 1: WORKSPACE */}
                    <div 
                        className="cs-section-header" 
                        onClick={() => setWorkspaceOpen(!workspaceOpen)}
                    >
                        <span className="cs-section-title">WORKSPACE</span>
                        <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className={`cs-section-chevron ${workspaceOpen ? 'open' : ''}`} 
                        />
                    </div>

                    <div className={`cs-nav-accordion ${workspaceOpen ? 'open' : ''}`}>
                        <ul className="cs-nav-list">
                            <li>
                                <NavLink 
                                    to="/client" 
                                    end
                                    onClick={() => handleNavClick('Overview & Analytics')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Overview & Analytics"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faChartBar} className="cs-icon" />
                                        <span>Overview</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/book" 
                                    onClick={() => handleNavClick('Book Enterprise Solution')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Book Solution"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faPlusCircle} className="cs-icon" />
                                        <span>Book Solution</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/bookings" 
                                    onClick={() => handleNavClick('Active Engagements & Pipeline')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Active Engagements"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faFolderOpen} className="cs-icon" />
                                        <span>Active Engagements</span>
                                    </div>
                                    {bookings.length > 0 && (
                                        <span className="badge cs-badge-pill">{bookings.length}</span>
                                    )}
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/bookings" 
                                    onClick={() => handleNavClick('Invoices & Milestone Billing')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Invoices & Billing"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="cs-icon" />
                                        <span>Invoices & Billing</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/review" 
                                    onClick={() => handleNavClick('Project Feedback & Testimonials')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Project Reviews"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faStar} className="cs-icon" />
                                        <span>Project Reviews</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/profile" 
                                    onClick={() => handleNavClick('Client Account & SLA Profile')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Account Profile"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faUserShield} className="cs-icon" />
                                        <span>Account Profile</span>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* SECTION 2: SOLUTIONS SUITE */}
                    <div 
                        className="cs-section-header" 
                        onClick={() => setSolutionsOpen(!solutionsOpen)}
                    >
                        <span className="cs-section-title">SOLUTIONS SUITE</span>
                        <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className={`cs-section-chevron ${solutionsOpen ? 'open' : ''}`} 
                        />
                    </div>

                    <div className={`cs-nav-accordion ${solutionsOpen ? 'open' : ''}`}>
                        <ul className="cs-nav-list">
                            <li>
                                <NavLink 
                                    to="/client/book?category=banking" 
                                    onClick={() => handleNavClick('Core Banking & FinTech Architecture')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Core Banking Suite"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faUniversity} className="cs-icon" />
                                        <span>Core Banking Suite</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/book?category=sacco" 
                                    onClick={() => handleNavClick('SACCO & Microfinance ERP')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="SACCO ERP Systems"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faPiggyBank} className="cs-icon" />
                                        <span>SACCO ERP Systems</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/book?category=msme" 
                                    onClick={() => handleNavClick('MSME Enterprise Cloud Solutions')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="MSME Growth Engine"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faChartLine} className="cs-icon" />
                                        <span>MSME Growth Engine</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/book?category=digital" 
                                    onClick={() => handleNavClick('Web & Mobile Digital Platforms')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Web & Mobile Apps"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faMobileAlt} className="cs-icon" />
                                        <span>Web & Mobile Apps</span>
                                    </div>
                                    <span className="cs-plus-indicator">+</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* SECTION 3: KAMPALA HQ & SLA */}
                    <div 
                        className="cs-section-header" 
                        onClick={() => setSupportOpen(!supportOpen)}
                    >
                        <span className="cs-section-title">KAMPALA HQ & SLA</span>
                        <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className={`cs-section-chevron ${supportOpen ? 'open' : ''}`} 
                        />
                    </div>

                    <div className={`cs-nav-accordion ${supportOpen ? 'open' : ''}`}>
                        <ul className="cs-nav-list">
                            <li>
                                <NavLink 
                                    to="/client/profile" 
                                    onClick={() => handleNavClick('Kampala Tech Hub Lead Assignment')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="Kampala HQ Desk"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faBuilding} className="cs-icon" />
                                        <span>Kampala HQ Desk</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/client/profile" 
                                    onClick={() => handleNavClick('Priority 24/7 SLA Telemetry')}
                                    className={({ isActive }) => `cs-nav-item ${isActive ? 'active' : ''}`}
                                    title="24/7 Priority SLA"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faBolt} className="cs-icon" />
                                        <span>24/7 Priority SLA</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li>
                                <a 
                                    href="mailto:support@koshercode.com"
                                    onClick={() => {
                                        if (isMobile || (typeof window !== 'undefined' && window.innerWidth <= 991)) {
                                            setTimeout(() => setMobileOpen(false), 140);
                                        }
                                    }}
                                    className="cs-nav-item"
                                    title="Direct Tech Hotline"
                                >
                                    <div className="cs-nav-item-left">
                                        <FontAwesomeIcon icon={faHeadset} className="cs-icon" />
                                        <span>Direct Tech Hotline</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 3. Bottom User Profile Card (Matching Reference) */}
                <div className="cs-footer">
                    {showUserMenu && (
                        <div className="cs-popover-menu">
                            <Link 
                                to="/client/profile" 
                                onClick={() => handleNavClick('Client Account Profile')}
                                className="cs-popover-item"
                            >
                                <FontAwesomeIcon icon={faUser} /> Account Profile
                            </Link>
                            <Link 
                                to="/" 
                                onClick={() => {
                                    setShowUserMenu(false);
                                    if (isMobile || (typeof window !== 'undefined' && window.innerWidth <= 991)) {
                                        setTimeout(() => setMobileOpen(false), 140);
                                    }
                                }}
                                className="cs-popover-item"
                            >
                                <FontAwesomeIcon icon={faGlobe} /> Back to Website
                            </Link>
                            <button 
                                onClick={() => {
                                    setShowUserMenu(false);
                                    setMobileOpen(false);
                                    handleSignOut();
                                }}
                                className="cs-popover-item logout"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                            </button>
                        </div>
                    )}

                    <div className="cs-user-card">
                        <div className="cs-user-left">
                            <UserAvatar 
                                src={displayImg} 
                                name={displayName}
                                role="client"
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
                            title="Account Settings"
                        >
                            <FontAwesomeIcon icon={faCog} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Page Content */}
            <div id="pageContent" className={!sidebarOpen ? 'sidebar-collapsed' : ''}>
                {/* Clean Responsive Top Header */}
                <div className="dashBoardHeader">
                    <div className="d-flex align-items-center gap-2.5 gap-sm-3 overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                        <div 
                            ref={toggleBtnRef}
                            id="nav-icon"
                            className={(isMobile ? mobileOpen : sidebarOpen) ? "menu-btn open" : "menu-btn"}
                            onClick={handleToggleSidebar}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleToggleSidebar();
                                }
                            }}
                            title={(isMobile ? mobileOpen : sidebarOpen) ? "Collapse Sidebar (Compact Mode)" : "Expand Sidebar (Full Mode)"}
                            role="button"
                            tabIndex={0}
                            aria-label={(isMobile ? mobileOpen : sidebarOpen) ? "Collapse Sidebar" : "Expand Sidebar"}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                            <h4 className="fw-bold mb-0 text-truncate" style={{ color: 'var(--cp-text-main)' }}>{title}</h4>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 gap-sm-2.5 gap-md-3 flex-shrink-0">
                        <button 
                            type="button" 
                            onClick={toggleTheme}
                            className="btn d-flex align-items-center gap-2 rounded-pill"
                            style={{ 
                                backgroundColor: 'var(--cp-card-subtle)', 
                                border: '1px solid var(--cp-border)',
                                color: 'var(--cp-text-main)',
                                fontSize: '0.82rem',
                                fontWeight: 500,
                                padding: '7px 16px'
                            }}
                            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        >
                            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} style={{ color: 'var(--cp-primary)' }} />
                            <span className="d-none d-md-inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                        </button>

                        <div 
                            className="d-none d-md-flex align-items-center gap-2 rounded-pill" 
                            style={{ 
                                backgroundColor: 'var(--cp-card-subtle)', 
                                border: '1px solid var(--cp-border)', 
                                fontSize: '0.8rem',
                                padding: '7px 16px'
                            }}
                        >
                            <FontAwesomeIcon icon={faClock} style={{ color: 'var(--cp-primary)' }} />
                            <span className="fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Kampala HQ Desk</span>
                        </div>
                        <span 
                            className="badge rounded-pill d-none d-sm-inline-flex align-items-center gap-1.5" 
                            style={{ 
                                backgroundColor: 'var(--cp-primary-subtle)', 
                                color: 'var(--cp-primary-text)', 
                                border: '1px solid var(--cp-border-highlight)', 
                                fontSize: '0.8rem',
                                padding: '7px 16px',
                                fontWeight: 600
                            }}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} /> Secured Client Session
                        </span>
                        <button 
                            type="button" 
                            onClick={handleSignOut}
                            className="btn btn-sm btn-outline-danger rounded-pill d-inline-flex align-items-center gap-2 px-3.5 py-1.5"
                            style={{ fontSize: '0.82rem', fontWeight: 600 }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} /> <span className="d-none d-sm-inline">Exit</span>
                        </button>
                    </div>
                </div>

                {/* Sub-Routes */}
                <Routes>
                    <Route index element={<ClientLanding />} />
                    <Route path="" element={<ClientLanding />} />
                    <Route path="book" element={<Book />} />
                    <Route path="book/:id" element={<Book />} />
                    <Route path="bookings" element={<BookList />} />
                    <Route path="review" element={<Review />} />
                    <Route path="profile" element={<ClientProfile />} />
                    <Route path="*" element={<ClientLanding />} />
                </Routes>
            </div>
        </div>
    );
};

export default ClientPortal;
