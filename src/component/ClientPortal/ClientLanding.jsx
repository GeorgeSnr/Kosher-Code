import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Table, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faComments, 
    faShieldAlt, 
    faClock, 
    faSpinner, 
    faCheckCircle, 
    faFolderOpen, 
    faHeadset, 
    faFileContract, 
    faArrowRight, 
    faUniversity, 
    faPiggyBank, 
    faChartLine, 
    faMobileAlt,
    faEye,
    faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { useAppContext, SET_SELECTED_SERVICE } from '../../context';
import { 
    getUserOrders, 
    getUserOrdersAsync, 
    subscribeToUserOrders,
    getStoredServices,
    fetchServicesAsync,
    subscribeToServices
} from '../../services/storageService';
import ExportDropdown from '../Shared/ExportButton/ExportDropdown';

const ClientLanding = () => {
    const { state: { user }, dispatch } = useAppContext();
    const [bookings, setBookings] = useState(() => getUserOrders(user?.email));
    const [services, setServices] = useState(() => getStoredServices());
    const [selectedEngagement, setSelectedEngagement] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        if (!user?.email) {
            setBookings([]);
            return;
        }

        // Fetch user orders and services
        getUserOrdersAsync(user.email).then(orders => {
            setBookings(orders || []);
        });

        fetchServicesAsync().then(srv => {
            if (srv && srv.length > 0) setServices(srv);
        });

        // Real-time listener for user orders
        const unsubOrders = subscribeToUserOrders(user.email, (cloudOrders) => {
            setBookings(cloudOrders || []);
        });

        // Real-time listener for services
        const unsubServices = subscribeToServices((cloudServices) => {
            if (cloudServices && cloudServices.length > 0) setServices(cloudServices);
        });

        return () => {
            if (typeof unsubOrders === 'function') unsubOrders();
            if (typeof unsubServices === 'function') unsubServices();
        };
    }, [user?.email]);

    const displayName = user?.name || 'Enterprise Partner';
    const pendingCount = bookings.filter(b => b.status === 'Pending').length;
    const reviewCount = bookings.filter(b => b.status === 'In Review').length;
    const progressCount = bookings.filter(b => b.status === 'In Progress').length;
    const doneCount = bookings.filter(b => b.status === 'Done' || b.status === 'Completed').length;

    const handleSelectService = (service) => {
        dispatch({ type: SET_SELECTED_SERVICE, payload: service });
    };

    const getSolutionIcon = (category = '') => {
        if (category.includes('Banking')) return faUniversity;
        if (category.includes('SACCO')) return faPiggyBank;
        if (category.includes('MSME') || category.includes('Enterprise')) return faChartLine;
        return faMobileAlt;
    };

    return (
        <div className="p-0">
            {/* 1. Executive Welcome Hero Banner (Dell Clean Architecture) */}
            <div 
                className="p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #004B87 0%, #0672CB 60%, #0076CE 100%)',
                    borderRadius: '0',
                    boxShadow: '0 10px 30px rgba(6, 114, 203, 0.22)'
                }}
            >
                <Row className="align-items-center g-4">
                    <Col lg={8}>
                        <div 
                            className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 mb-3" 
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.02em', borderRadius: '0' }}
                        >
                            <FontAwesomeIcon icon={faShieldAlt} /> Enterprise Client Hub • Kampala HQ
                        </div>
                        <h2 className="fw-bold mb-2.5" style={{ fontSize: '1.85rem', letterSpacing: '-0.025em' }}>Welcome back, {displayName}</h2>
                        <p className="mb-4 text-white text-opacity-85 small" style={{ maxWidth: '620px', lineHeight: 1.65, fontSize: '0.9rem' }}>
                            Supervise your active digital systems, core banking modules, and SACCO ERP requests. Our software engineering teams in Kampala, Uganda are actively maintaining your infrastructure under 24/7 SLA.
                        </p>
                        <div className="d-flex flex-wrap gap-3 mt-2">
                            <Link to="/client/book">
                                <Button 
                                    className="px-4 py-2.5 fw-semibold text-white d-inline-flex align-items-center gap-2"
                                    style={{
                                        backgroundColor: '#0F172A',
                                        borderColor: '#0F172A',
                                        borderRadius: '0',
                                        fontSize: '0.88rem',
                                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Book New Solution
                                </Button>
                            </Link>
                            <Link to="/client/bookings">
                                <Button 
                                    variant="outline-light" 
                                    className="px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2"
                                    style={{ fontSize: '0.88rem', borderRadius: '0' }}
                                >
                                    <FontAwesomeIcon icon={faFolderOpen} /> View Engagements ({bookings.length})
                                </Button>
                            </Link>
                        </div>
                    </Col>

                    <Col lg={4} className="mt-4 mt-lg-0 text-lg-end">
                        <div 
                            className="d-inline-block text-start"
                            style={{ 
                                width: '100%',
                                maxWidth: '300px',
                                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                border: '1px solid rgba(255, 255, 255, 0.22)',
                                borderRadius: '0',
                                padding: '18px 20px',
                                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)'
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <span 
                                        style={{ 
                                            width: '8px', 
                                            height: '8px', 
                                            borderRadius: '50%', 
                                            backgroundColor: '#10B981',
                                            boxShadow: '0 0 8px #10B981',
                                            display: 'inline-block'
                                        }} 
                                    />
                                    <span 
                                        style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: 700, 
                                            letterSpacing: '0.06em', 
                                            textTransform: 'uppercase',
                                            color: 'rgba(255, 255, 255, 0.95)' 
                                        }}
                                    >
                                        Client Advisory Desk
                                    </span>
                                </div>
                                <span 
                                    className="badge"
                                    style={{ 
                                        backgroundColor: 'rgba(16, 185, 129, 0.25)', 
                                        color: '#A7F3D0',
                                        border: '1px solid rgba(16, 185, 129, 0.4)',
                                        borderRadius: '0',
                                        fontSize: '0.7rem', 
                                        fontWeight: 700,
                                        padding: '4px 10px'
                                    }}
                                >
                                    ● Active Desk
                                </span>
                            </div>

                            <div className="mb-3">
                                <h6 className="text-white fw-bold mb-1 d-flex align-items-center gap-2" style={{ fontSize: '1.02rem', letterSpacing: '-0.01em' }}>
                                    <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }} />
                                    {user?.institution || user?.company || (user?.name ? `${user.name}'s Account` : 'Enterprise Partner')}
                                </h6>
                                <p className="mb-0 text-white text-opacity-80" style={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
                                    {bookings.length > 0 
                                        ? `${bookings.length} Solution Engagement${bookings.length > 1 ? 's' : ''} Managed` 
                                        : 'Dedicated Kosher Code Solutions Team'}
                                </p>
                            </div>

                            <div 
                                className="pt-2.5 border-top d-flex align-items-center justify-content-between" 
                                style={{ borderColor: 'rgba(255, 255, 255, 0.16)', fontSize: '0.76rem' }}
                            >
                                <a 
                                    href="tel:+256703275790" 
                                    className="text-white text-opacity-90 d-flex align-items-center gap-1.5 text-decoration-none"
                                    title="Call Kosher Code Advisory Desk"
                                >
                                    <FontAwesomeIcon icon={faHeadset} style={{ color: '#A7F3D0', fontSize: '0.85rem' }} />
                                    <span>Desk: <strong>+256 703 275 790</strong></span>
                                </a>
                                <span 
                                    className="badge"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                                        color: '#FFFFFF',
                                        borderRadius: '0',
                                        fontSize: '0.68rem',
                                        padding: '3px 8px',
                                        fontWeight: 600
                                    }}
                                >
                                    Priority SLA
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* 2. Key Metrics Snapshot (Sharp Dell Architectural Layout) */}
            <Row className="g-3 mb-4">
                <Col xs={6} md={3}>
                    <div className="p-4 cp-card h-100 d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="admin-kpi-label mb-0">TOTAL ENGAGEMENTS</span>
                            <div 
                                className="d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: '42px', height: '42px', borderRadius: '0', backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary)' }}
                            >
                                <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: '0.95rem' }} />
                            </div>
                        </div>
                        <div>
                            <h3 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', fontSize: '1.75rem', fontWeight: 800 }}>{bookings.length}</h3>
                            <small style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>Registered solution requests</small>
                        </div>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-4 cp-card h-100 d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="admin-kpi-label mb-0">PENDING PROPOSALS</span>
                            <div 
                                className="d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: '42px', height: '42px', borderRadius: '0', backgroundColor: 'rgba(245, 158, 11, 0.14)', color: '#F59E0B' }}
                            >
                                <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.95rem' }} />
                            </div>
                        </div>
                        <div>
                            <h3 className="fw-bold mb-1 text-warning" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{pendingCount}</h3>
                            <small style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>Awaiting feasibility review</small>
                        </div>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-4 cp-card h-100 d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="admin-kpi-label mb-0">IN ENGINEERING</span>
                            <div 
                                className="d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: '42px', height: '42px', borderRadius: '0', backgroundColor: 'rgba(59, 130, 246, 0.14)', color: '#3B82F6' }}
                            >
                                <FontAwesomeIcon icon={faSpinner} style={{ fontSize: '0.95rem' }} />
                            </div>
                        </div>
                        <div>
                            <h3 className="fw-bold mb-1 text-primary" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{progressCount + reviewCount}</h3>
                            <small style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>Active sprint development</small>
                        </div>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-4 cp-card h-100 d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="admin-kpi-label mb-0">DEPLOYED & LIVE</span>
                            <div 
                                className="d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: '42px', height: '42px', borderRadius: '0', backgroundColor: 'rgba(16, 185, 129, 0.14)', color: '#10B981' }}
                            >
                                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '0.95rem' }} />
                            </div>
                        </div>
                        <div>
                            <h3 className="fw-bold mb-1 text-success" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{doneCount}</h3>
                            <small style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>Live in production</small>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* 3. Live Project Engagements Table with Generous Padding & Inspection Modal */}
            <div className="cp-card p-4 p-md-5 mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                    <div>
                        <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', fontSize: '1.12rem' }}>Live Project Engagements</h5>
                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem' }}>Real-time implementation milestones from the Kosher Code engineering team.</small>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                        {bookings.length > 0 && (
                            <ExportDropdown 
                                data={bookings}
                                variant="light"
                                buttonText="Export"
                                options={{
                                    title: 'Live Client Engagements Report',
                                    subtitle: `${displayName} • Kosher Code Client Portal`
                                }}
                            />
                        )}
                        <Link to="/client/book">
                            <Button 
                                className="d-flex align-items-center gap-2 fw-semibold text-white px-3.5 py-2"
                                style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '0', fontSize: '0.82rem' }}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Request Solution
                            </Button>
                        </Link>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-5" style={{ backgroundColor: 'var(--cp-card-subtle)', borderRadius: '0' }}>
                        <FontAwesomeIcon icon={faFileContract} style={{ fontSize: '2.5rem', color: 'var(--cp-text-light)' }} className="mb-2" />
                        <h6 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', fontSize: '0.95rem' }}>No Active Project Requests</h6>
                        <p className="small mb-3" style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem' }}>You haven't submitted a solution booking request yet.</p>
                        <Link to="/client/book">
                            <Button className="px-4 py-2" style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '0', fontSize: '0.82rem' }}>
                                Book Your First Solution
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 cp-table" style={{ minWidth: '760px' }}>
                            <thead>
                                <tr>
                                    <th className="py-2.5 small fw-semibold" style={{ fontSize: '0.74rem' }}>SOLUTION / PROJECT</th>
                                    <th className="py-2.5 small fw-semibold" style={{ fontSize: '0.74rem' }}>SECTOR</th>
                                    <th className="py-2.5 small fw-semibold" style={{ fontSize: '0.74rem' }}>TIMELINE</th>
                                    <th className="py-2.5 small fw-semibold" style={{ fontSize: '0.74rem' }}>PRICING MODEL</th>
                                    <th className="py-2.5 small fw-semibold text-center" style={{ fontSize: '0.74rem' }}>STATUS</th>
                                    <th className="py-2.5 small fw-semibold text-end" style={{ fontSize: '0.74rem' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.slice(0, 5).map((b, idx) => {
                                    const statusColor = b.status === 'Done' ? '#10B981' : b.status === 'In Progress' ? '#3B82F6' : b.status === 'In Review' ? '#8B5CF6' : '#F59E0B';
                                    const statusBg = b.status === 'Done' ? 'rgba(16, 185, 129, 0.12)' : b.status === 'In Progress' ? 'rgba(59, 130, 246, 0.12)' : b.status === 'In Review' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)';
                                    return (
                                        <tr key={b._id || idx}>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div 
                                                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                                                        style={{ 
                                                            width: '40px', 
                                                            height: '40px', 
                                                            borderRadius: '0', 
                                                            backgroundColor: 'var(--cp-primary-subtle)',
                                                            color: 'var(--cp-primary)',
                                                            border: '1px solid var(--cp-border)'
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={getSolutionIcon(b.serviceName || b.institution)} style={{ fontSize: '0.92rem' }} />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '0.9rem' }}>{b.serviceName}</div>
                                                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.74rem' }}>{b.date || 'Active Request'}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="small" style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem' }}>{b.institution || 'Enterprise'}</td>
                                            <td className="small" style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem' }}>{b.timeline || '1-3 months'}</td>
                                            <td className="small fw-semibold" style={{ color: 'var(--cp-text-main)', fontSize: '0.8rem' }}>{b.pricingType?.split('(')[0] || `$${b.price || 48}`}</td>
                                            <td className="text-center">
                                                <span 
                                                    className="px-3 py-1 fw-semibold small d-inline-flex align-items-center gap-1"
                                                    style={{
                                                        backgroundColor: statusBg,
                                                        color: statusColor,
                                                        border: `1px solid ${statusColor}33`,
                                                        borderRadius: '0',
                                                        fontSize: '0.76rem'
                                                    }}
                                                >
                                                    ● {b.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <Button 
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => { setSelectedEngagement(b); setShowDetailsModal(true); }}
                                                    className="px-3 py-1 d-inline-flex align-items-center gap-1.5"
                                                    style={{ fontSize: '0.78rem', fontWeight: 600, borderRadius: '0' }}
                                                >
                                                    <FontAwesomeIcon icon={faEye} /> Inspect
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>

            {/* 4. Quick Solution Launchpad Cards (Sharp Dell Architectural Layout) */}
            <div className="cp-card p-4 p-md-5 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', fontSize: '1.12rem' }}>Solutions Suite Catalog</h5>
                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem' }}>Instant shortcuts to configure specialized architecture from Kampala HQ.</small>
                    </div>
                </div>

                <Row className="g-3">
                    {services.slice(0, 4).map((service, sIdx) => {
                        const icon = getSolutionIcon(service.category);
                        return (
                            <Col md={6} lg={3} key={sIdx}>
                                <div 
                                    className="p-3.5 cp-card-subtle h-100 d-flex flex-column justify-content-between"
                                    style={{
                                        transition: 'all 0.2s ease',
                                        border: '1px solid var(--cp-border)',
                                        borderRadius: '0'
                                    }}
                                >
                                    <div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div 
                                                className="d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ 
                                                    width: '42px', 
                                                    height: '42px', 
                                                    borderRadius: '0',
                                                    backgroundColor: 'var(--cp-primary-subtle)',
                                                    color: 'var(--cp-primary)',
                                                    border: '1px solid var(--cp-border)'
                                                }}
                                            >
                                                <FontAwesomeIcon icon={icon} style={{ fontSize: '0.95rem' }} />
                                            </div>
                                            <span className="badge px-2.5 py-1" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', borderRadius: '0', fontSize: '0.7rem', fontWeight: 600 }}>
                                                {service.category || 'Enterprise'}
                                            </span>
                                        </div>

                                        <h6 className="fw-bold mb-1.5" style={{ color: 'var(--cp-text-main)', fontSize: '0.95rem' }}>{service.name}</h6>
                                        <p className="small mb-3" style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem', lineHeight: 1.55 }}>
                                            {(service.description || '').substring(0, 75)}...
                                        </p>
                                    </div>
                                    <Link 
                                        to="/client/book" 
                                        onClick={() => handleSelectService(service)}
                                        className="btn w-100 fw-semibold text-white d-flex align-items-center justify-content-center gap-1.5 py-2"
                                        style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '0', fontSize: '0.82rem' }}
                                    >
                                        Configure Solution <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.72rem' }} />
                                    </Link>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </div>

            {/* 5. Support & Feedback Channels (Sharp Dell Architectural Layout) */}
            <Row className="g-3">
                <Col md={6}>
                    <div className="p-4 p-md-5 cp-card h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-flex align-items-center justify-content-between mb-3.5 pb-2.5 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px', borderRadius: '0', backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary)' }}>
                                        <FontAwesomeIcon icon={faHeadset} style={{ fontSize: '1.1rem' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '1.02rem' }}>Direct Engineering Support</h6>
                                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>Kampala Technology Hub • Enterprise Desk</small>
                                    </div>
                                </div>
                                <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5" style={{ fontSize: '0.72rem', fontWeight: 600, borderRadius: '0' }}>
                                    ● 24/7 SLA Active
                                </span>
                            </div>

                            <div className="p-3.5 mb-3.5" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2 pb-1.5 border-bottom border-light small" style={{ fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--cp-text-muted)' }}>Assigned Lead</span>
                                    <strong style={{ color: 'var(--cp-text-main)' }}>Senior Solutions Architect</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2 pb-1.5 border-bottom border-light small" style={{ fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--cp-text-muted)' }}>Priority 1 SLA</span>
                                    <strong className="text-success">&lt; 15 min Turnaround</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center small" style={{ fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--cp-text-muted)' }}>Emergency Hotline</span>
                                    <a href="tel:+256703275790" className="text-decoration-none fw-bold" style={{ color: 'var(--cp-text-main)' }}>
                                        +256 703 275 790
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top" style={{ borderColor: 'var(--cp-border)' }}>
                            <a 
                                href="mailto:koshercode01@gmail.com" 
                                className="btn fw-semibold text-white d-inline-flex align-items-center gap-2 px-4 py-2"
                                style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '0', fontSize: '0.82rem' }}
                            >
                                Email Lead Architect <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                            </a>
                            <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>
                                koshercode01@gmail.com
                            </small>
                        </div>
                    </div>
                </Col>

                <Col md={6}>
                    <div className="p-4 p-md-5 cp-card h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-flex align-items-center justify-content-between mb-3.5 pb-2.5 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px', borderRadius: '0', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                                        <FontAwesomeIcon icon={faComments} style={{ fontSize: '1.1rem' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '1.02rem' }}>Client Reviews & Testimonials</h6>
                                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>Verified Enterprise Feedback & Ratings</small>
                                    </div>
                                </div>
                                <span className="badge px-3 py-1.5" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', borderRadius: '0', fontSize: '0.72rem', fontWeight: 600 }}>
                                    ★★★★★ 5.0 Rating
                                </span>
                            </div>

                            <p className="small mb-3.5" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.6, fontSize: '0.86rem' }}>
                                Have you recently completed a banking integration, SACCO ERP rollout, or bespoke software milestone with Kosher Code? Share your review to be featured across our platform.
                            </p>

                            <div className="d-flex flex-wrap gap-2 mb-3.5">
                                <span className="badge" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0', color: 'var(--cp-text-main)', fontSize: '0.76rem', padding: '6px 14px' }}>
                                    ✓ Verified Client Feedback
                                </span>
                                <span className="badge" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0', color: 'var(--cp-text-main)', fontSize: '0.76rem', padding: '6px 14px' }}>
                                    ✓ Direct Roadmap Influence
                                </span>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top" style={{ borderColor: 'var(--cp-border)' }}>
                            <Link 
                                to="/client/review" 
                                className="btn btn-outline-success fw-semibold d-inline-flex align-items-center gap-2 px-4 py-2" 
                                style={{ fontSize: '0.82rem', borderRadius: '0' }}
                            >
                                Submit Milestone Review <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                            </Link>
                            <Link to="/client/review" className="text-decoration-none small fw-semibold" style={{ color: 'var(--cp-primary)', fontSize: '0.8rem' }}>
                                View Testimonials &rarr;
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* 6. Engagement Details Inspection Modal */}
            <Modal 
                show={showDetailsModal} 
                onHide={() => setShowDetailsModal(false)} 
                centered 
                size="lg"
                className="client-modal"
            >
                <Modal.Header closeButton style={{ borderBottom: '1px solid var(--cp-border)' }}>
                    <div className="d-flex align-items-center gap-3">
                        <div 
                            className="d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ 
                                width: '42px', 
                                height: '42px', 
                                borderRadius: '0', 
                                backgroundColor: 'var(--cp-primary-subtle)',
                                color: 'var(--cp-primary)'
                            }}
                        >
                            <FontAwesomeIcon icon={getSolutionIcon(selectedEngagement?.serviceName || selectedEngagement?.institution)} />
                        </div>
                        <div>
                            <Modal.Title className="fw-bold fs-5 mb-0" style={{ color: 'var(--cp-text-main)' }}>
                                {selectedEngagement?.serviceName || 'Engagement Details'}
                            </Modal.Title>
                            <small style={{ color: 'var(--cp-text-muted)' }}>ID: {selectedEngagement?._id || 'N/A'}</small>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {selectedEngagement && (
                        <div>
                            <Row className="g-3 mb-4">
                                <Col sm={6}>
                                    <div className="p-3" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                        <small className="admin-kpi-label">Current Status</small>
                                        <span 
                                            className="px-3 py-1 fw-bold d-inline-flex align-items-center gap-1.5"
                                            style={{
                                                backgroundColor: selectedEngagement.status === 'Done' ? 'rgba(16, 185, 129, 0.12)' : selectedEngagement.status === 'In Progress' ? 'rgba(59, 130, 246, 0.12)' : selectedEngagement.status === 'In Review' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                                color: selectedEngagement.status === 'Done' ? '#10B981' : selectedEngagement.status === 'In Progress' ? '#3B82F6' : selectedEngagement.status === 'In Review' ? '#8B5CF6' : '#F59E0B',
                                                border: `1px solid ${selectedEngagement.status === 'Done' ? '#10B98133' : selectedEngagement.status === 'In Progress' ? '#3B82F633' : selectedEngagement.status === 'In Review' ? '#8B5CF633' : '#F59E0B33'}`,
                                                borderRadius: '0',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            ● {selectedEngagement.status || 'Pending'}
                                        </span>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="p-3" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                        <small className="admin-kpi-label">Pricing Model</small>
                                        <div className="fw-bold" style={{ color: 'var(--cp-text-main)', fontSize: '0.95rem' }}>
                                            {selectedEngagement.pricingType || `$${selectedEngagement.price || 48}`}
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="p-3" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                        <small className="admin-kpi-label">Institution / Sector</small>
                                        <div className="fw-semibold" style={{ color: 'var(--cp-text-main)', fontSize: '0.9rem' }}>
                                            {selectedEngagement.institution || 'Commercial Banking & FinTech'}
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="p-3" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                        <small className="admin-kpi-label">Delivery Timeline</small>
                                        <div className="fw-semibold" style={{ color: 'var(--cp-text-main)', fontSize: '0.9rem' }}>
                                            {selectedEngagement.timeline || 'Immediate (1-3 months)'}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div className="p-3.5 mb-3" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                <small className="admin-kpi-label mb-2">Scope & Project Specifications</small>
                                <p className="mb-0" style={{ color: 'var(--cp-text-main)', fontSize: '0.88rem', lineHeight: 1.6, wordBreak: 'break-word' }}>
                                    {selectedEngagement.description || 'Enterprise software architecture configured for your operational scale.'}
                                </p>
                            </div>

                            <div className="p-3" style={{ backgroundColor: 'var(--cp-primary-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <FontAwesomeIcon icon={faShieldAlt} style={{ color: 'var(--cp-primary)' }} />
                                    <strong className="small" style={{ color: 'var(--cp-primary-text)' }}>Kampala HQ Engineering SLA Active</strong>
                                </div>
                                <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>
                                    Supervised under 24/7 SLA. Priority response time and continuous deployment pipelines enabled.
                                </small>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid var(--cp-border)' }}>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowDetailsModal(false)}
                        className="px-4 py-2"
                        style={{ fontSize: '0.85rem', borderRadius: '0' }}
                    >
                        Close
                    </Button>
                    <Link to="/client/bookings" onClick={() => setShowDetailsModal(false)}>
                        <Button 
                            className="px-4 py-2 text-white"
                            style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '0', fontSize: '0.85rem' }}
                        >
                            Manage All Engagements
                        </Button>
                    </Link>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ClientLanding;
