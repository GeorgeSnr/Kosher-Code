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
    faServer
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
    fetchOrdersAsync 
} from '../../services/storageService';
import './AdminLanding.css';

const AdminLanding = () => {
    const [orders, setOrders] = useState(() => getStoredOrders());
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [admins] = useState(() => getStoredAdmins());
    const [services] = useState(() => getStoredServices());

    // Selected order for details modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Selected table rows (checkboxes)
    const [selectedRowIds, setSelectedRowIds] = useState(new Set());

    // Interactive chart state (default to August, index 7 matching 6.4K in Dribbble)
    const [activeMonthIdx, setActiveMonthIdx] = useState(7);

    // Monthly Bar Chart Data (Jan - Dec)
    const monthlyStats = [
        { month: 'Jan', postedHeight: 52, appsHeight: 38, tooltip: '4.0K' },
        { month: 'Feb', postedHeight: 96, appsHeight: 64, tooltip: '7.2K' },
        { month: 'Mar', postedHeight: 68, appsHeight: 46, tooltip: '5.1K' },
        { month: 'Apr', postedHeight: 78, appsHeight: 58, tooltip: '5.8K' },
        { month: 'May', postedHeight: 72, appsHeight: 52, tooltip: '5.4K' },
        { month: 'Jun', postedHeight: 104, appsHeight: 68, tooltip: '7.8K' },
        { month: 'Jul', postedHeight: 62, appsHeight: 44, tooltip: '4.6K' },
        { month: 'Aug', postedHeight: 88, appsHeight: 60, tooltip: '6.4K' }, // Peak featured in Dribbble
        { month: 'Sep', postedHeight: 56, appsHeight: 38, tooltip: '4.2K' },
        { month: 'Oct', postedHeight: 94, appsHeight: 66, tooltip: '7.0K' },
        { month: 'Nov', postedHeight: 60, appsHeight: 78, tooltip: '5.8K' },
        { month: 'Dec', postedHeight: 82, appsHeight: 56, tooltip: '6.2K' }
    ];

    useEffect(() => {
        // Initial async fetch
        fetchOrdersAsync().then(cloudList => {
            if (cloudList && cloudList.length > 0) setOrders(cloudList);
        });

        // Real-time Firestore subscription
        const unsubscribe = subscribeToOrders(
            (cloudOrders) => {
                if (cloudOrders && cloudOrders.length > 0) {
                    setOrders(cloudOrders);
                }
            },
            (err) => {
                console.log('Live admin landing orders subscription:', err.message);
            }
        );

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
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

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(orders, null, 2)
        )}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `kosher_inbound_requests_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success('Exporting inquiries report...');
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

    // Dynamic stats
    const pendingCount = orders.filter(o => o.status === 'Pending').length;

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
                    <p className="ad-stats-intro-sub">Your statistics for 1 week period.</p>
                </div>

                {/* Right 6 Tall Pill Cards */}
                <div className="ad-stats-grid">
                    {/* 1. Total Users */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div className="ad-stat-value">500K</div>
                        <p className="ad-stat-title">Total Users</p>
                    </div>

                    {/* 2. Total Companies */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faBuilding} />
                        </div>
                        <div className="ad-stat-value">1.2K</div>
                        <p className="ad-stat-title">Total Companies</p>
                    </div>

                    {/* 3. Active Jobs / Inbound (ACTIVE HIGHLIGHTED CARD MATCHING DRIBBBLE) */}
                    <div className="ad-stat-pill is-active">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faBriefcase} />
                        </div>
                        <div className="ad-stat-value">3.5K</div>
                        <p className="ad-stat-title">Active Jobs Posted</p>
                        <div className="ad-stat-arrow-indicator" title="Active Focus">
                            <FontAwesomeIcon icon={faArrowUp} style={{ transform: 'rotate(45deg)' }} />
                        </div>
                    </div>

                    {/* 4. Total Applications */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faFileAlt} />
                        </div>
                        <div className="ad-stat-value">28K</div>
                        <p className="ad-stat-title">Total Applications</p>
                    </div>

                    {/* 5. Pending Jobs */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                        <div className="ad-stat-value">{pendingCount > 0 ? pendingCount * 10 : 80}</div>
                        <p className="ad-stat-title">Pending Jobs</p>
                    </div>

                    {/* 6. Reported Jobs */}
                    <div className="ad-stat-pill">
                        <div className="ad-stat-icon-circle">
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div className="ad-stat-value">20</div>
                        <p className="ad-stat-title">Reported Jobs</p>
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
                            <h4 className="ad-card-heading">Statistics</h4>
                            <div className="ad-chart-legend">
                                <span className="ad-legend-item">
                                    <span className="ad-legend-dot dark"></span> Jobs Posted
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

                            {/* Y-Axis Labels */}
                            <div className="ad-chart-y-axis">
                                <span>8K</span>
                                <span>6K</span>
                                <span>4K</span>
                                <span>2K</span>
                                <span>0</span>
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
                                                    {item.tooltip}
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
                                                <div className="ad-pending-time text-truncate">{item.postedDate || `${item.date} 03:20 GMT`}</div>
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

                        {/* Dark Solid Action Button ("Export" in Dribbble) */}
                        <button 
                            type="button" 
                            className="ad-btn-pill-dark"
                            onClick={handleExport}
                            title="Export Inquiries"
                        >
                            <span>Export</span>
                            <FontAwesomeIcon icon={faFileDownload} style={{ fontSize: '11px' }} />
                        </button>

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
                                                    {order.title || order.serviceName || 'Product Designer'}
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
                                                    {order.location || order.region || 'San Francisco'}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td>
                                                {renderStatusBadge(order.status)}
                                            </td>

                                            {/* Posted Date */}
                                            <td>
                                                <span className="ad-cell-date">
                                                    {order.postedDate || `${order.date || 'Jun 10'} 03:20 GMT`}
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
               ORDER / JOB DETAILS MODAL (Matching Theme & High Polish)
               ========================================================= */}
            {selectedOrder && (
                <Modal 
                    show={showModal} 
                    onHide={() => setShowModal(false)}
                    centered 
                    size="lg"
                    dialogClassName="admin-modal"
                    contentClassName="ad-card border-0 shadow-lg"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    <Modal.Header closeButton style={{ borderBottom: '1px solid var(--cp-border)', padding: '20px 26px' }}>
                        <div className="d-flex align-items-center gap-3 overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                            <div className="ad-pending-logo-box" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
                                {renderCompanyIcon(selectedOrder.institution || selectedOrder.name, selectedOrder.companyIcon)}
                            </div>
                            <div className="overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                                <Modal.Title className="fs-5 fw-bold mb-0 text-truncate" style={{ color: 'var(--cp-text-main)' }}>
                                    {selectedOrder.title || selectedOrder.serviceName || 'Request Details'}
                                </Modal.Title>
                                <small className="text-truncate d-block" style={{ color: 'var(--cp-text-light)', fontSize: '0.8rem' }}>
                                    {selectedOrder.institution || selectedOrder.name} &bull; {selectedOrder.postedDate || selectedOrder.date}
                                </small>
                            </div>
                        </div>
                    </Modal.Header>

                    <Modal.Body className="p-4" style={{ color: 'var(--cp-text-main)', maxHeight: '78vh', overflowY: 'auto' }}>
                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <div className="p-3.5 rounded-4 h-100" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                    <h6 className="fw-bold mb-2.5 small text-uppercase" style={{ color: 'var(--cp-text-light)', letterSpacing: '0.04em' }}>
                                        Contact & Organization
                                    </h6>
                                    <div className="mb-2">
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Client Representative</small>
                                        <span className="fw-semibold text-truncate d-block">{selectedOrder.name}</span>
                                    </div>
                                    <div className="mb-2">
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Email Address</small>
                                        <a 
                                            href={`mailto:${selectedOrder.email}`} 
                                            className="fw-semibold text-decoration-none d-block" 
                                            style={{ color: 'var(--cp-primary)', wordBreak: 'break-all', overflowWrap: 'anywhere', fontSize: '0.86rem' }}
                                        >
                                            {selectedOrder.email}
                                        </a>
                                    </div>
                                    {selectedOrder.phone && (
                                        <div>
                                            <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Phone</small>
                                            <span className="fw-semibold text-truncate d-block">{selectedOrder.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="p-3.5 rounded-4 h-100" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                    <h6 className="fw-bold mb-2.5 small text-uppercase" style={{ color: 'var(--cp-text-light)', letterSpacing: '0.04em' }}>
                                        Scope & Commercials
                                    </h6>
                                    <div className="mb-2">
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Location / Region</small>
                                        <span className="fw-semibold text-truncate d-block">{selectedOrder.location || selectedOrder.region || 'Global'}</span>
                                    </div>
                                    <div className="mb-2">
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Plan / Tier</small>
                                        <span className="fw-semibold text-truncate d-block" style={{ color: 'var(--cp-primary)' }}>{selectedOrder.pricingType || 'Enterprise Tier'}</span>
                                    </div>
                                    <div>
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Project Budget / Price</small>
                                        <span className="fw-bold fs-5 text-success">${selectedOrder.price || '4,500'}</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div className="p-3.5 rounded-4 mb-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                            <h6 className="fw-bold mb-2 small text-uppercase" style={{ color: 'var(--cp-text-light)', letterSpacing: '0.04em' }}>
                                Requirements Description
                            </h6>
                            <p className="mb-0 small" style={{ lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>
                                {selectedOrder.description || 'Full solution deployment requested with custom institutional workflows, security compliance protocols, and technical staff onboarding support.'}
                            </p>
                        </div>

                        {/* Status Change Strip */}
                        <div className="p-3.5 rounded-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                            <small className="fw-bold text-uppercase d-block mb-2.5 text-muted" style={{ letterSpacing: '0.04em', fontSize: '0.72rem' }}>
                                Quick Status Update:
                            </small>
                            <div className="d-flex flex-wrap gap-2.5">
                                {['Pending', 'Active', 'Expired', 'Done'].map(st => {
                                    const isCurrent = selectedOrder.status === st;
                                    return (
                                        <button
                                            key={st}
                                            type="button"
                                            className={isCurrent ? "ad-btn-pill-dark" : "ad-btn-pill-filter"}
                                            style={{ padding: '6px 18px', fontSize: '0.78rem' }}
                                            onClick={() => handleAction(selectedOrder._id, st)}
                                        >
                                            ● {st}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer style={{ borderTop: '1px solid var(--cp-border)', padding: '16px 26px' }}>
                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-2 rounded-pill px-3.5 py-1.5"
                                onClick={() => handleDelete(selectedOrder._id)}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} /> Archive
                            </button>
                            <button
                                type="button"
                                className="ad-btn-pill-filter"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default AdminLanding;
