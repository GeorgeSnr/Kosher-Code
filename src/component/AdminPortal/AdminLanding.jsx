import React, { useEffect, useState } from 'react';
import { Row, Col, Dropdown, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers,
    faBuilding,
    faBriefcase,
    faFileAlt,
    faClock,
    faExclamationTriangle,
    faCheckCircle,
    faEllipsisH,
    faArrowUp,
    faSearch,
    faFileDownload,
    faEye,
    faTrashAlt,
    faChevronDown,
    faPlus,
    faShieldAlt,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faDollarSign,
    faCar,
    faServer,
    faCalendarAlt,
    faExternalLinkAlt,
    faTasks,
    faBolt,
    faUserShield
} from '@fortawesome/free-solid-svg-icons';
import { 
    faGoogle, 
    faAmazon, 
    faPaypal, 
    faApple, 
    faFigma, 
    faBuffer 
} from '@fortawesome/free-brands-svg-icons';
import { 
    getStoredOrders, 
    updateOrderStatus, 
    deleteStoredOrder, 
    getStoredAdmins,
    getStoredServices,
    subscribeToOrders,
    fetchOrdersAsync,
    getRegisteredUsers,
    fetchFirestoreUsers,
    subscribeToUsers,
    fetchContactInquiries,
    subscribeToContacts
} from '../../services/storageService';
import {
    getStoredTickets,
    getStoredTeamMembers,
    getStoredSprints
} from '../../services/ticketService';
import ExportDropdown from '../Shared/ExportButton/ExportDropdown';
import './AdminLanding.css';

const AdminLanding = () => {
    const [orders, setOrders] = useState(() => getStoredOrders());
    const [users, setUsers] = useState(() => getRegisteredUsers());
    const [contacts, setContacts] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [admins] = useState(() => getStoredAdmins());
    const [services] = useState(() => getStoredServices());
    const [jiraTickets] = useState(() => getStoredTickets());
    const [teamMembers] = useState(() => getStoredTeamMembers());
    const [jiraSprints] = useState(() => getStoredSprints());

    // Selected order for details modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Selected table rows (checkboxes)
    const [selectedRowIds, setSelectedRowIds] = useState(new Set());

    // Formatting helper for live numeric figures
    const formatStatNumber = (num) => {
        if (!num && num !== 0) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return String(num);
    };

    // Helper to extract month index from various order and contact date structures
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const extractMonthIndex = (item) => {
        if (!item) return -1;
        if (item.createdAt) {
            if (typeof item.createdAt.toDate === 'function') {
                return item.createdAt.toDate().getMonth();
            }
            const d = new Date(item.createdAt);
            if (!isNaN(d.getTime())) return d.getMonth();
        }
        if (item.date) {
            const d = new Date(item.date);
            if (!isNaN(d.getTime())) return d.getMonth();
            const lower = String(item.date).toLowerCase();
            for (let i = 0; i < monthNames.length; i++) {
                if (lower.includes(monthNames[i].toLowerCase())) return i;
            }
        }
        if (item.postedDate) {
            const lower = String(item.postedDate).toLowerCase();
            for (let i = 0; i < monthNames.length; i++) {
                if (lower.includes(monthNames[i].toLowerCase())) return i;
            }
        }
        return -1;
    };

    // Compute dynamic monthly stats from live orders & inbound contacts
    const monthlyStats = React.useMemo(() => {
        const rawCounts = monthNames.map((month, idx) => {
            const monthOrders = orders.filter(o => extractMonthIndex(o) === idx);
            const monthContacts = contacts.filter(c => extractMonthIndex(c) === idx);
            const appsCount = monthOrders.length + monthContacts.length;
            const postedCount = monthOrders.filter(o => o.status === 'Active' || o.status === 'In Progress' || o.status === 'Done').length;
            return { month, appsCount, postedCount };
        });

        const maxActivity = Math.max(4, ...rawCounts.map(r => Math.max(r.appsCount, r.postedCount)));
        const MAX_HEIGHT_PX = 104;

        return rawCounts.map(r => {
            const postedHeight = r.postedCount > 0 
                ? Math.max(10, Math.round((r.postedCount / maxActivity) * MAX_HEIGHT_PX)) 
                : 4;
            const appsHeight = r.appsCount > 0 
                ? Math.max(10, Math.round((r.appsCount / maxActivity) * MAX_HEIGHT_PX)) 
                : 4;
            const tooltip = r.appsCount > 0 || r.postedCount > 0 
                ? `${r.appsCount} Apps (${r.postedCount} Active)` 
                : '0 Activity';

            return {
                month: r.month,
                postedHeight,
                appsHeight,
                postedCount: r.postedCount,
                appsCount: r.appsCount,
                tooltip
            };
        });
    }, [orders, contacts]);

    // Peak activity or current month index for chart highlight
    const peakMonthIdx = React.useMemo(() => {
        let peakIdx = new Date().getMonth();
        let maxVal = -1;
        monthlyStats.forEach((m, idx) => {
            const total = m.appsCount + m.postedCount;
            if (total > maxVal) {
                maxVal = total;
                peakIdx = idx;
            }
        });
        return peakIdx;
    }, [monthlyStats]);

    const [activeMonthIdx, setActiveMonthIdx] = useState(peakMonthIdx);

    useEffect(() => {
        setActiveMonthIdx(peakMonthIdx);
    }, [peakMonthIdx]);

    // Dynamic Y-Axis scale based on actual maximum activity
    const yAxisLabels = React.useMemo(() => {
        const maxVal = Math.max(4, ...monthlyStats.map(m => Math.max(m.appsCount, m.postedCount)));
        const roundedMax = Math.ceil(maxVal / 4) * 4;
        return [
            formatStatNumber(roundedMax),
            formatStatNumber(Math.round(roundedMax * 0.75)),
            formatStatNumber(Math.round(roundedMax * 0.5)),
            formatStatNumber(Math.round(roundedMax * 0.25)),
            '0'
        ];
    }, [monthlyStats]);

    useEffect(() => {
        // Initial async fetch for orders
        fetchOrdersAsync().then(cloudList => {
            if (cloudList && cloudList.length > 0) setOrders(cloudList);
        });

        // Real-time Firestore orders subscription
        const unsubOrders = subscribeToOrders(
            (cloudOrders) => {
                if (cloudOrders && cloudOrders.length > 0) {
                    setOrders(cloudOrders);
                }
            },
            (err) => {
                console.log('Live admin landing orders subscription:', err.message);
            }
        );

        // Initial fetch for registered users
        fetchFirestoreUsers().then(cloudUsers => {
            if (cloudUsers && cloudUsers.length > 0) {
                setUsers(prev => {
                    const localUsers = getRegisteredUsers();
                    const map = new Map();
                    localUsers.forEach(u => map.set(u.email?.toLowerCase(), u));
                    cloudUsers.forEach(u => map.set(u.email?.toLowerCase() || u.id?.toLowerCase(), u));
                    return Array.from(map.values());
                });
            }
        });

        // Real-time Firestore users subscription
        const unsubUsers = subscribeToUsers(
            (cloudUsers) => {
                if (cloudUsers && cloudUsers.length > 0) {
                    setUsers(prev => {
                        const localUsers = getRegisteredUsers();
                        const map = new Map();
                        localUsers.forEach(u => map.set(u.email?.toLowerCase(), u));
                        cloudUsers.forEach(u => map.set(u.email?.toLowerCase() || u.id?.toLowerCase(), u));
                        return Array.from(map.values());
                    });
                }
            },
            (err) => {
                console.log('Live admin landing users subscription:', err.message);
            }
        );

        // Inbound contact inquiries
        fetchContactInquiries().then(inquiries => {
            if (inquiries && inquiries.length > 0) setContacts(inquiries);
        });

        const unsubContacts = subscribeToContacts(
            (inquiries) => {
                if (inquiries) setContacts(inquiries);
            },
            (err) => {
                console.log('Live admin landing contacts subscription:', err.message);
            }
        );

        return () => {
            if (typeof unsubOrders === 'function') unsubOrders();
            if (typeof unsubUsers === 'function') unsubUsers();
            if (typeof unsubContacts === 'function') unsubContacts();
        };
    }, []);

    const handleAction = (id, newStatus) => {
        const updated = updateOrderStatus(id, newStatus);
        setOrders(updated);
        if (selectedOrder && selectedOrder._id === id) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        toast.success(`Request status updated to "${newStatus}"!`);
    };

    const handleDelete = (id) => {
        swal({
            title: "Archive Request?",
            text: "Are you sure you want to remove this incoming client record?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                const updated = deleteStoredOrder(id);
                setOrders(updated);
                setShowModal(false);
                toast.success('Request archived.');
            }
        });
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // Filtered orders for table
    const filteredOrders = orders.filter(o => {
        const matchesStatus = filterStatus === 'All' || 
            (filterStatus === 'Active' ? (o.status === 'Active' || o.status === 'In Progress') : false) ||
            (filterStatus === 'Pending' ? o.status === 'Pending' : false) ||
            (filterStatus === 'Expired' ? (o.status === 'Expired' || o.status === 'Done') : false) ||
            o.status === filterStatus;

        const matchesSearch = !searchQuery || 
            o.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.location?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    // Checkbox selection
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(filteredOrders.map(o => o._id));
            setSelectedRowIds(allIds);
        } else {
            setSelectedRowIds(new Set());
        }
    };

    const handleToggleRow = (id) => {
        const next = new Set(selectedRowIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedRowIds(next);
    };

    // Brand icon mapper matching Dribbble inspiration
    const renderCompanyIcon = (companyName, iconKey) => {
        const lower = (companyName || '').toLowerCase();
        const iconLower = (iconKey || '').toLowerCase();

        if (lower.includes('google') || iconLower === 'google') {
            return <FontAwesomeIcon icon={faGoogle} style={{ color: '#EA4335' }} />;
        }
        if (lower.includes('amazon') || iconLower === 'amazon') {
            return <FontAwesomeIcon icon={faAmazon} style={{ color: '#FF9900' }} />;
        }
        if (lower.includes('paypal') || iconLower === 'paypal') {
            return <FontAwesomeIcon icon={faPaypal} style={{ color: '#003087' }} />;
        }
        if (lower.includes('apple') || iconLower === 'apple') {
            return <FontAwesomeIcon icon={faApple} style={{ color: 'inherit' }} />;
        }
        if (lower.includes('figma') || iconLower === 'figma') {
            return <FontAwesomeIcon icon={faFigma} style={{ color: '#F24E1E' }} />;
        }
        if (lower.includes('bmw') || iconLower === 'bmw') {
            return <FontAwesomeIcon icon={faCar} style={{ color: '#0066B1' }} />;
        }
        return <FontAwesomeIcon icon={faBuilding} style={{ color: '#7355F7' }} />;
    };

    // Render pill status badge
    const renderStatusBadge = (status) => {
        if (status === 'Pending' || status === 'In Review') {
            return <span className="ad-pill-pending">Pending</span>;
        }
        if (status === 'Active' || status === 'In Progress') {
            return <span className="ad-pill-active">Active</span>;
        }
        return <span className="ad-pill-expired">Expired</span>;
    };

    // Pending approvals list (top 3 for right card)
    const pendingList = orders
        .filter(o => o.status === 'Pending' || o.status === 'In Review')
        .slice(0, 3);

    // Dynamic counts from live database & storage
    const allUserEmails = new Set([
        ...users.map(u => u.email?.toLowerCase()).filter(Boolean),
        ...admins.map(a => a.toLowerCase()).filter(Boolean),
        ...orders.map(o => o.email?.toLowerCase()).filter(Boolean)
    ]);
    const totalUsersCount = Math.max(allUserEmails.size, users.length, admins.length);

    const allCompanies = new Set([
        ...orders.map(o => o.institution || o.company),
        ...users.map(u => u.institution || u.company)
    ].filter(Boolean).map(c => c.trim()));
    const totalCompaniesCount = allCompanies.size > 0 ? allCompanies.size : 1;

    const activeJobsCount = orders.filter(o => o.status === 'Active' || o.status === 'In Progress').length;
    const totalApplicationsCount = orders.length + (contacts?.length || 0);
    const pendingJobsCount = orders.filter(o => o.status === 'Pending' || o.status === 'In Review').length;
    const closedJobsCount = orders.filter(o => o.status === 'Done' || o.status === 'Completed' || o.status === 'Expired').length;

    return (
        <div className="admin-dribbble-dashboard">
            {/* Top Operations & Deployment Hub Command Banner */}
            <div className="ad-hero-banner mb-4">
                <Row className="align-items-center g-3">
                    <Col lg={8} md={7}>
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-2.5 rounded-pill ad-hero-badge">
                            <FontAwesomeIcon icon={faShieldAlt} /> Superadmin Operations • Kampala HQ Desk
                        </div>
                        <h3 className="fw-bold mb-1.5 ad-hero-title">Enterprise Systems & Telemetry</h3>
                        <p className="mb-0 ad-hero-sub">
                            Monitor live platform infrastructure, core banking switches, and multi-tenant solution deployments across East Africa and global cloud nodes.
                        </p>
                    </Col>
                    <Col lg={4} md={5} className="text-md-end">
                        <div className="ad-deployment-hub-box">
                            <div className="d-flex align-items-center justify-content-between mb-2.5">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="ad-pulse-dot" />
                                    <span className="ad-hub-label">Deployment Hub</span>
                                </div>
                                <span className="badge rounded-pill ad-hub-status-pill">
                                    ● 100% Operational
                                </span>
                            </div>

                            <div className="mb-2.5">
                                <h6 className="ad-hub-title mb-1 d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faServer} style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)' }} />
                                    Kampala HQ Switch
                                </h6>
                                <p className="mb-0 ad-hub-sub">
                                    East Africa Core Banking & Cloud Node
                                </p>
                            </div>

                            <div className="pt-2 border-top ad-hub-footer d-flex align-items-center justify-content-between">
                                <span className="ad-hub-sla d-flex align-items-center gap-1.5">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-success" style={{ fontSize: '0.8rem' }} />
                                    <span>SLA: <strong>99.9% Uptime</strong></span>
                                </span>
                                <span className="badge rounded-pill ad-hub-pill-tag">
                                    Production Live
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* =========================================================
               TOP SECTION: QUICK STATS (Horizontal Layout + Tall Pill Cards)
               ========================================================= */}
            <div className="ad-stats-section">
                {/* Left Heading Box */}
                <div className="ad-stats-intro">
                    <h3 className="ad-stats-intro-title">Quick Stats</h3>
                    <p className="ad-stats-intro-sub">Live platform telemetry & client volume.</p>
                </div>

                {/* Right 6 Tall Pill Cards */}
                <div className="ad-stats-grid">
                    {/* 1. Total Users */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div className="ad-stat-value">{formatStatNumber(totalUsersCount)}</div>
                        <p className="ad-stat-title">Total Users</p>
                    </div>

                    {/* 2. Total Companies */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faBuilding} />
                        </div>
                        <div className="ad-stat-value">{formatStatNumber(totalCompaniesCount)}</div>
                        <p className="ad-stat-title">Total Companies</p>
                    </div>

                    {/* 3. Active Jobs / Inbound (ACTIVE HIGHLIGHTED CARD MATCHING DRIBBBLE) */}
                    <div className="ad-stat-pill is-active">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faBriefcase} />
                        </div>
                        <div className="ad-stat-value">{formatStatNumber(activeJobsCount)}</div>
                        <p className="ad-stat-title">Active Deployments</p>
                        <div className="ad-stat-arrow-indicator" title="Active Deployments">
                            <FontAwesomeIcon icon={faArrowUp} style={{ transform: 'rotate(45deg)' }} />
                        </div>
                    </div>

                    {/* 4. Total Applications */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faFileAlt} />
                        </div>
                        <div className="ad-stat-value">{formatStatNumber(totalApplicationsCount)}</div>
                        <p className="ad-stat-title">Total Inquiries</p>
                    </div>

                    {/* 5. Pending Jobs */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                        <div className="ad-stat-value">{formatStatNumber(pendingJobsCount)}</div>
                        <p className="ad-stat-title">Pending Approvals</p>
                    </div>

                    {/* 6. Completed / Archived */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div className="ad-stat-value">{formatStatNumber(closedJobsCount)}</div>
                        <p className="ad-stat-title">Completed Jobs</p>
                    </div>
                </div>
            </div>

            {/* =========================================================
               MIDDLE SECTION: STATISTICS BAR CHART & PENDING APPROVALS
               ========================================================= */}
            <Row className="g-4 ad-middle-row">
                {/* Left 7 Cols: Statistics Minimal Bar Chart */}
                <Col lg={7} md={12}>
                    <div className="ad-card p-4 h-100">
                        <div className="ad-card-header">
                            <div>
                                <h4 className="ad-card-heading mb-0">Inbound & Deployment Volume</h4>
                                <small className="text-muted" style={{ fontSize: '0.74rem' }}>Live monthly distribution from platform database</small>
                            </div>
                            <div className="ad-chart-legend">
                                <span className="ad-legend-item">
                                    <span className="ad-legend-dot dark"></span> Active Jobs
                                </span>
                                <span className="ad-legend-item">
                                    <span className="ad-legend-dot light"></span> Applications
                                </span>
                            </div>
                        </div>

                        {/* Minimalist Bar Chart */}
                        <div className="ad-chart-container">
                            {/* Gridlines */}
                            <div className="ad-chart-gridlines">
                                <div className="ad-chart-gridline"></div>
                                <div className="ad-chart-gridline"></div>
                                <div className="ad-chart-gridline"></div>
                                <div className="ad-chart-gridline"></div>
                                <div className="ad-chart-gridline"></div>
                            </div>

                            {/* Dynamic Y-Axis Labels */}
                            <div className="ad-chart-y-axis">
                                {yAxisLabels.map((lbl, i) => (
                                    <span key={i}>{lbl}</span>
                                ))}
                            </div>

                            {/* Bars Area */}
                            <div className="ad-chart-bars-area">
                                {monthlyStats.map((item, idx) => {
                                    const isHighlighted = idx === activeMonthIdx;
                                    return (
                                        <div 
                                            key={item.month} 
                                            className="ad-chart-month-col"
                                            onMouseEnter={() => setActiveMonthIdx(idx)}
                                            title={`${item.month}: ${item.tooltip}`}
                                        >
                                            {/* Peak Floating Tooltip */}
                                            {isHighlighted && (
                                                <div className="ad-chart-active-tooltip">
                                                    {item.appsCount > 0 || item.postedCount > 0 ? `${item.appsCount} Apps` : '0 Apps'}
                                                    <div className="ad-chart-active-dot"></div>
                                                </div>
                                            )}

                                            <div className="ad-chart-pair">
                                                <div 
                                                    className="ad-chart-bar primary" 
                                                    style={{ height: `${item.postedHeight}px` }}
                                                ></div>
                                                <div 
                                                    className="ad-chart-bar secondary" 
                                                    style={{ height: `${item.appsHeight}px` }}
                                                ></div>
                                            </div>
                                            <span className="ad-chart-month-label">{item.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Right 5 Cols: Pending Approvals List */}
                <Col lg={5} md={12}>
                    <div className="ad-card p-4 h-100">
                        <div className="ad-card-header">
                            <h4 className="ad-card-heading">Pending Approvals</h4>
                            <button 
                                type="button" 
                                className="ad-btn-dots"
                                onClick={() => setFilterStatus('Pending')}
                                title="View All Pending Approvals"
                            >
                                <FontAwesomeIcon icon={faEllipsisH} />
                            </button>
                        </div>

                        {/* Pending Items List matching Dribbble */}
                        <div className="ad-pending-list">
                            {pendingList.length === 0 ? (
                                <div className="text-center py-4 text-muted small">
                                    No pending approvals currently require action.
                                </div>
                            ) : (
                                pendingList.map(item => (
                                    <div 
                                        key={item._id} 
                                        className="ad-pending-item"
                                        onClick={() => openOrderDetails(item)}
                                        style={{ cursor: 'pointer' }}
                                        title="Click to inspect approval details"
                                    >
                                        <div className="ad-pending-left">
                                            <div className="ad-pending-logo-box">
                                                {renderCompanyIcon(item.institution || item.name, item.companyIcon)}
                                            </div>
                                            <div className="overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                                                <div className="ad-pending-name text-truncate">{item.institution || item.name}</div>
                                                <div className="ad-pending-time text-truncate">{item.postedDate || item.date || 'Pending Review'}</div>
                                            </div>
                                        </div>
                                        <span className="ad-pill-pending">Pending</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* =========================================================
               JIRA AGILE ENGINEERING & SPRINT HUB CARD
               ========================================================= */}
            {(() => {
                const activeJiraSprint = jiraSprints.find(s => s.status === 'active') || jiraSprints[0];
                const sprintTickets = jiraTickets.filter(t => t.sprintId === activeJiraSprint?.id);
                const sprintDone = sprintTickets.filter(t => t.status === 'Done');
                const totalPts = sprintTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
                const donePts = sprintDone.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
                const sprintPct = totalPts > 0 ? Math.round((donePts / totalPts) * 100) : 0;
                const openJiraCount = jiraTickets.filter(t => t.status !== 'Done').length;
                const pendingJiraApprovals = jiraTickets.filter(t => t.approvalWorkflow?.status === 'Pending').length;

                return (
                    <div 
                        className="ad-card p-4 mb-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(6, 114, 203, 0.04) 0%, rgba(2, 132, 199, 0.04) 100%)',
                            border: '1px solid rgba(6, 114, 203, 0.18)'
                        }}
                    >
                        <Row className="align-items-center g-4">
                            {/* Left Col: Sprint Goal & Velocity */}
                            <Col lg={7} md={12}>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <span 
                                        className="badge rounded-pill px-3 py-1"
                                        style={{ backgroundColor: 'rgba(6, 114, 203, 0.12)', color: '#0672CB', fontSize: '0.74rem', fontWeight: 700 }}
                                    >
                                        <FontAwesomeIcon icon={faBolt} className="me-1" /> Active Sprint Cycle
                                    </span>
                                    {pendingJiraApprovals > 0 && (
                                        <span 
                                            className="badge rounded-pill px-2.5 py-1 text-white"
                                            style={{ backgroundColor: '#EF4444', fontSize: '0.72rem' }}
                                        >
                                            <FontAwesomeIcon icon={faClock} className="me-1" /> {pendingJiraApprovals} Awaiting Sign-off
                                        </span>
                                    )}
                                </div>

                                <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.01em' }}>
                                    {activeJiraSprint?.name || 'Sprint 1 - FinTech Switch & SACCO Q3'}
                                </h4>
                                <p className="small text-muted mb-3" style={{ maxWidth: '620px' }}>
                                    {activeJiraSprint?.goal || 'Core Banking switch adapter, MoMo float reconciliation, and EFRIS compliance.'}
                                </p>

                                {/* Velocity Progress Bar */}
                                <div className="mb-2">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="small fw-semibold text-muted">Sprint Resolution Velocity</span>
                                        <span className="small fw-bold text-primary">{donePts} / {totalPts} story pts ({sprintPct}%)</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px', borderRadius: '9999px', backgroundColor: 'rgba(0,0,0,0.06)' }}>
                                        <div 
                                            className="progress-bar" 
                                            role="progressbar" 
                                            style={{ width: `${sprintPct}%`, backgroundColor: '#0672CB', borderRadius: '9999px' }}
                                            aria-valuenow={sprintPct} 
                                            aria-valuemin="0" 
                                            aria-valuemax="100"
                                        />
                                    </div>
                                </div>
                            </Col>

                            {/* Right Col: Stats & Quick Jump Buttons */}
                            <Col lg={5} md={12}>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    <div className="p-2.5 rounded-3 bg-white border flex-grow-1 text-center">
                                        <div className="fw-bold fs-5 text-primary">{jiraTickets.length}</div>
                                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>Total Issues</small>
                                    </div>
                                    <div className="p-2.5 rounded-3 bg-white border flex-grow-1 text-center">
                                        <div className="fw-bold fs-5 text-warning">{openJiraCount}</div>
                                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>In Development</small>
                                    </div>
                                    <div className="p-2.5 rounded-3 bg-white border flex-grow-1 text-center">
                                        <div className="fw-bold fs-5 text-info">{teamMembers.length}</div>
                                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>Onboarded Team</small>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <Link to="/admin/tickets" className="flex-grow-1 text-decoration-none">
                                        <Button 
                                            variant="primary" 
                                            className="w-100 py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-1.5"
                                            style={{ backgroundColor: '#0672CB', borderColor: '#0672CB', borderRadius: '8px', fontSize: '0.82rem' }}
                                        >
                                            <FontAwesomeIcon icon={faTasks} /> Launch Kanban Board
                                        </Button>
                                    </Link>
                                    <Link to="/admin/team-roles" className="text-decoration-none">
                                        <Button 
                                            variant="outline-secondary" 
                                            className="py-2 px-3 fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5"
                                            style={{ fontSize: '0.82rem', borderRadius: '8px' }}
                                            title="Onboard Developers & Configure RBAC"
                                        >
                                            <FontAwesomeIcon icon={faUserShield} /> RBAC Studio
                                        </Button>
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </div>
                );
            })()}

            {/* =========================================================
               BOTTOM SECTION: MANAGE JOBS (Full Width Modern Minimal Table)
               ========================================================= */}
            <div className="ad-card ad-manage-card">
                <div className="ad-manage-header">
                    <h4 className="ad-manage-title">Manage jobs</h4>

                    {/* Action Controls Row with Neat Button Spacing & Checked Margins */}
                    <div className="ad-manage-actions">
                        {/* Search Pill Input */}
                        <div className="ad-search-pill-box">
                            <FontAwesomeIcon icon={faSearch} className="ad-search-icon" />
                            <input
                                type="text"
                                className="ad-search-input"
                                placeholder="Search client, job..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Status Filter Dropdown */}
                        <Dropdown>
                            <Dropdown.Toggle as="button" className="ad-btn-pill-filter">
                                <span>Status {filterStatus !== 'All' ? `(${filterStatus})` : ''}</span>
                                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px' }} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ borderRadius: '16px', border: '1px solid var(--cp-border)', padding: '6px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                {['All', 'Pending', 'Active', 'Expired', 'In Review'].map(st => (
                                    <Dropdown.Item 
                                        key={st}
                                        onClick={() => setFilterStatus(st)}
                                        active={filterStatus === st}
                                        style={{ borderRadius: '10px', fontSize: '0.82rem', fontWeight: 500, padding: '6px 14px' }}
                                    >
                                        {st}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Active Export Dropdown (Excel Default & PDF Option) */}
                        <ExportDropdown 
                            data={filteredOrders.length > 0 ? filteredOrders : orders} 
                            variant="dark"
                            buttonText="Export"
                            options={{
                                title: 'Kosher Code Inbound Inquiries & Telemetry Report',
                                subtitle: 'Kampala HQ Superadmin Desk • Live Platform Telemetry'
                            }}
                        />

                        {/* Publish Solution Shortcut */}
                        <Link to="/admin/add-service" className="text-decoration-none">
                            <button 
                                type="button" 
                                className="ad-btn-pill-filter"
                                style={{ backgroundColor: 'var(--cp-card-subtle)' }}
                                title="Publish New Solution"
                            >
                                <FontAwesomeIcon icon={faPlus} style={{ fontSize: '11px' }} />
                                <span>Publish</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Minimal Modern Table */}
                <div className="ad-table-responsive">
                    <table className="ad-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input 
                                        type="checkbox" 
                                        className="ad-checkbox"
                                        checked={filteredOrders.length > 0 && selectedRowIds.size === filteredOrders.length}
                                        onChange={handleSelectAll}
                                        aria-label="Select all rows"
                                    />
                                </th>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Posted Date</th>
                                <th style={{ width: '40px', textAlign: 'center' }}>···</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        No jobs or client inquiries found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => {
                                    const isSelected = selectedRowIds.has(order._id);
                                    return (
                                        <tr key={order._id}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    className="ad-checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleRow(order._id)}
                                                    aria-label={`Select row ${order._id}`}
                                                />
                                            </td>

                                            {/* Job Title / Solution Name */}
                                            <td>
                                                <span 
                                                    className="ad-cell-title"
                                                    onClick={() => openOrderDetails(order)}
                                                    title="Click to inspect request"
                                                >
                                                    {order.serviceName || order.title || 'Enterprise Solution'}
                                                </span>
                                            </td>

                                            {/* Company & Icon */}
                                            <td>
                                                <div className="ad-cell-company">
                                                    <div className="ad-company-icon-circle">
                                                        {renderCompanyIcon(order.institution || order.name, order.companyIcon)}
                                                    </div>
                                                    <span>{order.institution || order.name}</span>
                                                </div>
                                            </td>

                                            {/* Location */}
                                            <td>
                                                <span className="ad-cell-location">
                                                    {order.region || order.location || 'Kampala HQ / East Africa'}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td>
                                                {renderStatusBadge(order.status)}
                                            </td>

                                            {/* Posted Date */}
                                            <td>
                                                <span className="ad-cell-date">
                                                    {order.postedDate || order.date || 'Recent'}
                                                </span>
                                            </td>

                                            {/* 3-Dot Action Menu */}
                                            <td style={{ textAlign: 'center' }}>
                                                <Dropdown align="end">
                                                    <Dropdown.Toggle as="button" className="ad-btn-dots">
                                                        <FontAwesomeIcon icon={faEllipsisH} />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu style={{ borderRadius: '14px', border: '1px solid var(--cp-border)', padding: '6px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                                                        <Dropdown.Item 
                                                            onClick={() => openOrderDetails(order)}
                                                            style={{ borderRadius: '8px', fontSize: '0.82rem', fontWeight: 500 }}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} className="me-2 text-primary" /> View Details
                                                        </Dropdown.Item>
                                                        <Dropdown.Item 
                                                            onClick={() => handleAction(order._id, 'Pending')}
                                                            style={{ borderRadius: '8px', fontSize: '0.82rem' }}
                                                        >
                                                            ● Mark as Pending
                                                        </Dropdown.Item>
                                                        <Dropdown.Item 
                                                            onClick={() => handleAction(order._id, 'Active')}
                                                            style={{ borderRadius: '8px', fontSize: '0.82rem' }}
                                                        >
                                                            ● Mark as Active
                                                        </Dropdown.Item>
                                                        <Dropdown.Item 
                                                            onClick={() => handleAction(order._id, 'Expired')}
                                                            style={{ borderRadius: '8px', fontSize: '0.82rem' }}
                                                        >
                                                            ● Mark as Expired
                                                        </Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item 
                                                            onClick={() => handleDelete(order._id)}
                                                            className="text-danger"
                                                            style={{ borderRadius: '8px', fontSize: '0.82rem' }}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Archive
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =========================================================
               ORDER / JOB DETAILS MODAL (High-End Dribbble Modern Outlook)
               ========================================================= */}
            {selectedOrder && (
                <Modal 
                    show={showModal} 
                    onHide={() => setShowModal(false)}
                    centered 
                    size="lg"
                    dialogClassName="ad-modal-dialog"
                    contentClassName="ad-modal-content border-0 shadow-lg"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    <Modal.Header closeButton className="ad-modal-header">
                        <div className="d-flex align-items-center gap-3 overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                            <div className="ad-modal-header-icon">
                                {renderCompanyIcon(selectedOrder.institution || selectedOrder.name, selectedOrder.companyIcon)}
                            </div>
                            <div className="overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                                <Modal.Title className="ad-modal-title text-truncate">
                                    {selectedOrder.serviceName || selectedOrder.title || 'Enterprise Solution'}
                                </Modal.Title>
                                <div className="ad-modal-meta">
                                    <span className="fw-semibold text-truncate" style={{ maxWidth: '180px' }}>
                                        <FontAwesomeIcon icon={faBuilding} className="me-1 text-primary" style={{ fontSize: '0.75rem' }} />
                                        {selectedOrder.institution || selectedOrder.name}
                                    </span>
                                    <span>&bull;</span>
                                    <span>
                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1 text-muted" style={{ fontSize: '0.75rem' }} />
                                        {selectedOrder.postedDate || selectedOrder.date || 'Recent'}
                                    </span>
                                    <span>&bull;</span>
                                    <span className="ad-modal-ref-tag">
                                        REF-{selectedOrder._id ? selectedOrder._id.substring(0, 8).toUpperCase() : 'ENG-2026'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="d-none d-sm-block me-3 flex-shrink-0">
                            {renderStatusBadge(selectedOrder.status)}
                        </div>
                    </Modal.Header>

                    <Modal.Body className="ad-modal-body">
                        {/* Executive Snapshot Metric Strip */}
                        <div className="ad-modal-hero-strip">
                            <div className="ad-modal-hero-item">
                                <span className="ad-modal-hero-label">Representative</span>
                                <span className="ad-modal-hero-val" title={selectedOrder.name}>
                                    {selectedOrder.name || 'Enterprise Stakeholder'}
                                </span>
                            </div>
                            <div className="ad-modal-hero-item">
                                <span className="ad-modal-hero-label">Deployment Node</span>
                                <span className="ad-modal-hero-val" title={selectedOrder.region || selectedOrder.location || 'Kampala HQ'}>
                                    {selectedOrder.region || selectedOrder.location || 'Kampala HQ'}
                                </span>
                            </div>
                            <div className="ad-modal-hero-item">
                                <span className="ad-modal-hero-label">Valuation</span>
                                <span className="ad-modal-hero-val text-success">
                                    {selectedOrder.price ? `$${selectedOrder.price} ` : 'Custom Scope '}<small className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>USD</small>
                                </span>
                            </div>
                            <div className="ad-modal-hero-item">
                                <span className="ad-modal-hero-label">Infrastructure SLA</span>
                                <span className="ad-modal-hero-val d-flex align-items-center gap-1.5" style={{ color: '#10B981', fontSize: '0.85rem' }}>
                                    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '0.8rem' }} />
                                    99.9% Uptime
                                </span>
                            </div>
                        </div>

                        {/* 2-Column Detail Cards */}
                        <Row className="g-3 mb-4">
                            {/* Left Card: Client & Organization */}
                            <Col md={6}>
                                <div className="ad-modal-card">
                                    <div className="ad-modal-card-header">
                                        <div className="ad-modal-card-icon-pill">
                                            <FontAwesomeIcon icon={faUsers} />
                                        </div>
                                        <h6 className="ad-modal-card-title">Client & Stakeholder</h6>
                                    </div>
                                    <div className="ad-modal-field">
                                        <span className="ad-modal-field-label">Representative Name</span>
                                        <div className="ad-modal-field-value text-truncate">{selectedOrder.name}</div>
                                    </div>
                                    <div className="ad-modal-field">
                                        <span className="ad-modal-field-label">Corporate Email</span>
                                        <div className="ad-modal-field-value text-truncate">
                                            <a 
                                                href={`mailto:${selectedOrder.email}`} 
                                                className="d-inline-flex align-items-center gap-1.5"
                                                title={selectedOrder.email}
                                            >
                                                <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '0.75rem' }} />
                                                <span>{selectedOrder.email}</span>
                                                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '9px', opacity: 0.7 }} />
                                            </a>
                                        </div>
                                    </div>
                                    {selectedOrder.phone && (
                                        <div className="ad-modal-field">
                                            <span className="ad-modal-field-label">Direct Line / Phone</span>
                                            <div className="ad-modal-field-value text-truncate">
                                                <a href={`tel:${selectedOrder.phone}`} className="text-decoration-none" style={{ color: 'var(--cp-text-main)' }}>
                                                    <FontAwesomeIcon icon={faPhone} className="me-1.5 text-muted" style={{ fontSize: '0.75rem' }} />
                                                    {selectedOrder.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    <div className="ad-modal-field">
                                        <span className="ad-modal-field-label">Institution / Entity</span>
                                        <div className="ad-modal-field-value text-truncate">
                                            <FontAwesomeIcon icon={faBuilding} className="me-1.5 text-muted" style={{ fontSize: '0.75rem' }} />
                                            {selectedOrder.institution || selectedOrder.name}
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* Right Card: Solution Scope & Financials */}
                            <Col md={6}>
                                <div className="ad-modal-card">
                                    <div className="ad-modal-card-header">
                                        <div className="ad-modal-card-icon-pill" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                                            <FontAwesomeIcon icon={faBriefcase} />
                                        </div>
                                        <h6 className="ad-modal-card-title">Scope & Financials</h6>
                                    </div>
                                    <div className="ad-modal-field">
                                        <span className="ad-modal-field-label">Target Solution</span>
                                        <div className="ad-modal-field-value text-truncate fw-bold">
                                            {selectedOrder.title || selectedOrder.serviceName || 'Core Enterprise Deployment'}
                                        </div>
                                    </div>
                                    <div className="ad-modal-field">
                                        <span className="ad-modal-field-label">Licensing / Pricing Tier</span>
                                        <div className="ad-modal-field-value">
                                            <span 
                                                className="badge rounded-pill fw-semibold"
                                                style={{ 
                                                    backgroundColor: 'var(--cp-primary-subtle)', 
                                                    color: 'var(--cp-primary-text)',
                                                    border: '1px solid var(--cp-border-highlight)',
                                                    fontSize: '0.75rem',
                                                    padding: '4px 10px'
                                                }}
                                            >
                                                {selectedOrder.pricingType || 'Enterprise Dedicated Tier'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ad-modal-field">
                                        <span className="ad-modal-field-label">Deployment Region</span>
                                        <div className="ad-modal-field-value text-truncate">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1.5 text-danger" style={{ fontSize: '0.75rem' }} />
                                            {selectedOrder.location || selectedOrder.region || 'Kampala, Uganda (Global CDN)'}
                                        </div>
                                    </div>
                                    <div className="ad-modal-field">
                                        <span className="ad-modal-field-label">Contract Budget / Valuation</span>
                                        <div className="ad-modal-field-value">
                                            <span className="fw-bold fs-5 text-success">
                                                ${selectedOrder.price || '4,500'}
                                            </span>
                                            <span className="small text-muted ms-1">USD (Fixed Milestone)</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Full Width Requirements Box */}
                        <div className="ad-modal-card mb-4">
                            <div className="ad-modal-card-header">
                                <div className="ad-modal-card-icon-pill" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
                                    <FontAwesomeIcon icon={faFileAlt} />
                                </div>
                                <h6 className="ad-modal-card-title">Scope & Technical Specifications</h6>
                            </div>
                            <div className="ad-modal-desc-box">
                                {selectedOrder.description || 'Full solution deployment requested with custom institutional workflows, security compliance protocols, and technical staff onboarding support.'}
                            </div>
                        </div>

                        {/* Interactive Status Switcher Strip */}
                        <div className="ad-modal-status-strip">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faClock} style={{ color: 'var(--cp-primary)', fontSize: '0.85rem' }} />
                                    <span className="ad-modal-hero-label mb-0" style={{ fontSize: '0.74rem' }}>
                                        Operational Lifecycle State:
                                    </span>
                                </div>
                                <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                                    Click a pill to instantly transition status
                                </span>
                            </div>
                            <div className="ad-modal-status-buttons">
                                {['Pending', 'Active', 'Expired', 'Done'].map(st => {
                                    const isCurrent = selectedOrder.status === st;
                                    return (
                                        <button
                                            key={st}
                                            type="button"
                                            className={`ad-modal-status-btn ${isCurrent ? 'active' : ''}`}
                                            onClick={() => handleAction(selectedOrder._id, st)}
                                        >
                                            <span>●</span>
                                            <span>{st}</span>
                                            {isCurrent && <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '0.75rem', marginLeft: '4px' }} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer className="ad-modal-footer">
                        <button
                            type="button"
                            className="ad-modal-btn-archive"
                            onClick={() => handleDelete(selectedOrder._id)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                            <span>Archive Request</span>
                        </button>
                        <div className="d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="ad-modal-btn-close"
                                onClick={() => setShowModal(false)}
                            >
                                Close Details
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default AdminLanding;
