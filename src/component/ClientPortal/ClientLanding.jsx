import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
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
    faMobileAlt
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

const ClientLanding = () => {
    const { state: { user }, dispatch } = useAppContext();
    const [bookings, setBookings] = useState(() => getUserOrders(user?.email));
    const [services, setServices] = useState(() => getStoredServices());

    useEffect(() => {
        // Fetch user orders and services
        getUserOrdersAsync(user?.email).then(orders => {
            if (orders && orders.length > 0) setBookings(orders);
        });

        fetchServicesAsync().then(srv => {
            if (srv && srv.length > 0) setServices(srv);
        });

        // Real-time listener for user orders
        const unsubOrders = subscribeToUserOrders(user?.email, (cloudOrders) => {
            if (cloudOrders && cloudOrders.length > 0) setBookings(cloudOrders);
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
            {/* 1. Executive Welcome Hero Banner */}
            <div 
                className="p-4 p-md-4 mb-4 text-white position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #7355F7 0%, #4B24F5 55%, #2608AB 100%)',
                    borderRadius: '6px',
                    boxShadow: '0 8px 24px rgba(115, 85, 247, 0.18)'
                }}
            >
                <Row className="align-items-center g-3">
                    <Col lg={8}>
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-2.5 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.16)', fontSize: '0.75rem', fontWeight: 600 }}>
                            <FontAwesomeIcon icon={faShieldAlt} /> Enterprise Client Hub • Kampala HQ
                        </div>
                        <h2 className="fw-bold mb-2" style={{ fontSize: '1.65rem', letterSpacing: '-0.02em' }}>Welcome back, {displayName}</h2>
                        <p className="mb-3.5 text-white text-opacity-85 small" style={{ maxWidth: '580px', lineHeight: 1.6, fontSize: '0.88rem' }}>
                            Supervise your active digital systems, core banking modules, and SACCO ERP requests. Our software engineering teams in Kampala, Uganda are actively maintaining your infrastructure under 24/7 SLA.
                        </p>
                        <div className="d-flex flex-wrap gap-2.5">
                            <Link to="/client/book">
                                <Button 
                                    className="px-3.5 py-2 fw-semibold text-white d-inline-flex align-items-center gap-2"
                                    style={{
                                        backgroundColor: '#070120',
                                        borderColor: '#070120',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        boxShadow: '0 4px 12px rgba(7, 1, 32, 0.25)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Book New Solution
                                </Button>
                            </Link>
                            <Link to="/client/bookings">
                                <Button 
                                    variant="outline-light" 
                                    className="px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                                    style={{ borderRadius: '4px', fontSize: '0.85rem' }}
                                >
                                    <FontAwesomeIcon icon={faFolderOpen} /> View Engagements ({bookings.length})
                                </Button>
                            </Link>
                        </div>
                    </Col>

                    <Col lg={4} className="d-none d-lg-block text-end pe-2">
                        <div className="p-3 bg-white bg-opacity-10 border border-white border-opacity-15 rounded d-inline-block text-start" style={{ width: '230px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-1.5">
                                <small className="text-white text-opacity-80 fw-semibold" style={{ fontSize: '0.72rem' }}>Deployment Hub</small>
                                <span className="badge bg-success" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>Active</span>
                            </div>
                            <h6 className="text-white fw-bold mb-0.5" style={{ fontSize: '0.92rem' }}>Kampala, Uganda</h6>
                            <p className="text-white text-opacity-70 mb-2" style={{ fontSize: '0.73rem' }}>East Africa & Global Delivery</p>
                            <div className="pt-1.5 border-top border-white border-opacity-10 small text-white text-opacity-90" style={{ fontSize: '0.74rem' }}>
                                SLA: <strong>99.9% Uptime Guaranteed</strong>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* 2. Crisp KPI Metric Summary Cards with generous icon-to-heading margins */}
            <Row className="g-3 mb-4">
                <Col xs={6} md={3}>
                    <div className="p-3.5 cp-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="fw-bold text-uppercase" style={{ fontSize: '0.68rem', color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>TOTAL ENGAGEMENTS</small>
                            <div className="p-2 rounded d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px', backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary)' }}>
                                <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: '0.9rem' }} />
                            </div>
                        </div>
                        <h3 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', fontSize: '1.65rem' }}>{bookings.length}</h3>
                        <small style={{ fontSize: '0.72rem', color: 'var(--cp-text-muted)' }}>Registered solution requests</small>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-3.5 cp-card h-100" style={{ borderLeft: '3px solid #F59E0B' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="fw-bold text-uppercase" style={{ fontSize: '0.68rem', color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>PENDING PROPOSALS</small>
                            <div className="p-2 rounded d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning" style={{ width: '34px', height: '34px' }}>
                                <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.9rem' }} />
                            </div>
                        </div>
                        <h3 className="fw-bold mb-1 text-warning" style={{ fontSize: '1.65rem' }}>{pendingCount}</h3>
                        <small style={{ fontSize: '0.72rem', color: 'var(--cp-text-muted)' }}>Awaiting feasibility review</small>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-3.5 cp-card h-100" style={{ borderLeft: '3px solid #3B82F6' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="fw-bold text-uppercase" style={{ fontSize: '0.68rem', color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>IN ENGINEERING</small>
                            <div className="p-2 rounded d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary" style={{ width: '34px', height: '34px' }}>
                                <FontAwesomeIcon icon={faSpinner} style={{ fontSize: '0.9rem' }} />
                            </div>
                        </div>
                        <h3 className="fw-bold mb-1 text-primary" style={{ fontSize: '1.65rem' }}>{progressCount + reviewCount}</h3>
                        <small style={{ fontSize: '0.72rem', color: 'var(--cp-text-muted)' }}>Active sprint development</small>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-3.5 cp-card h-100" style={{ borderLeft: '3px solid #10B981' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="fw-bold text-uppercase" style={{ fontSize: '0.68rem', color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>DEPLOYED & LIVE</small>
                            <div className="p-2 rounded d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success" style={{ width: '34px', height: '34px' }}>
                                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '0.9rem' }} />
                            </div>
                        </div>
                        <h3 className="fw-bold mb-1 text-success" style={{ fontSize: '1.65rem' }}>{doneCount}</h3>
                        <small style={{ fontSize: '0.72rem', color: 'var(--cp-text-muted)' }}>Live in production</small>
                    </div>
                </Col>
            </Row>

            {/* 3. Live Project Engagements Table with Generous Icon Margins */}
            <div className="cp-card p-4 mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2.5 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                    <div>
                        <h5 className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '1.05rem' }}>Live Project Engagements</h5>
                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>Real-time implementation milestones from the Kosher Code engineering team.</small>
                    </div>
                    <Link to="/client/book">
                        <Button 
                            size="sm"
                            className="d-flex align-items-center gap-2 fw-semibold text-white mt-2 mt-sm-0"
                            style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '4px', fontSize: '0.8rem', padding: '6px 14px' }}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Request Solution
                        </Button>
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-4 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)' }}>
                        <FontAwesomeIcon icon={faFileContract} style={{ fontSize: '2.4rem', color: 'var(--cp-text-light)' }} className="mb-2" />
                        <h6 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', fontSize: '0.92rem' }}>No Active Project Requests</h6>
                        <p className="small mb-3" style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>You haven't submitted a solution booking request yet.</p>
                        <Link to="/client/book">
                            <Button size="sm" style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '4px', fontSize: '0.8rem', padding: '6px 14px' }}>
                                Book Your First Solution
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 cp-table">
                            <thead>
                                <tr>
                                    <th className="py-2.5 small fw-semibold" style={{ fontSize: '0.74rem' }}>SOLUTION / PROJECT</th>
                                    <th className="py-2.5 small fw-semibold" style={{ fontSize: '0.74rem' }}>SECTOR</th>
                                    <th className="py-2.5 small fw-semibold" style={{ fontSize: '0.74rem' }}>TIMELINE</th>
                                    <th className="py-2.5 small fw-semibold" style={{ fontSize: '0.74rem' }}>PRICING MODEL</th>
                                    <th className="py-2.5 small fw-semibold text-center" style={{ fontSize: '0.74rem' }}>STATUS</th>
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
                                                            width: '36px', 
                                                            height: '36px', 
                                                            borderRadius: '4px', 
                                                            backgroundColor: 'var(--cp-primary-subtle)',
                                                            color: 'var(--cp-primary)',
                                                            border: '1px solid var(--cp-border)'
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={getSolutionIcon(b.serviceName || b.institution)} style={{ fontSize: '0.9rem' }} />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '0.88rem' }}>{b.serviceName}</div>
                                                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.73rem' }}>{b.date || 'Active Request'}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="small" style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>{b.institution || 'Enterprise'}</td>
                                            <td className="small" style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>{b.timeline || '1-3 months'}</td>
                                            <td className="small fw-semibold" style={{ color: 'var(--cp-text-main)', fontSize: '0.78rem' }}>{b.pricingType?.split('(')[0] || `$${b.price || 48}`}</td>
                                            <td className="text-center">
                                                <span 
                                                    className="px-2.5 py-1 fw-semibold small d-inline-flex align-items-center gap-1"
                                                    style={{
                                                        borderRadius: '3px',
                                                        backgroundColor: statusBg,
                                                        color: statusColor,
                                                        border: `1px solid ${statusColor}33`,
                                                        fontSize: '0.74rem'
                                                    }}
                                                >
                                                    ● {b.status || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>

            {/* 4. Quick Solution Launchpad Cards with Generous Icon-to-Heading Margins */}
            <div className="cp-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '1.05rem' }}>Solutions Suite Catalog</h5>
                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>Instant shortcuts to configure specialized architecture from Kampala HQ.</small>
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
                                        borderRadius: '6px'
                                    }}
                                >
                                    <div>
                                        {/* Icon and Category Badge Row with Increased Bottom Margin */}
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div 
                                                className="d-flex align-items-center justify-content-center rounded"
                                                style={{ 
                                                    width: '36px', 
                                                    height: '36px', 
                                                    backgroundColor: 'var(--cp-primary-subtle)',
                                                    color: 'var(--cp-primary)',
                                                    border: '1px solid var(--cp-border)'
                                                }}
                                            >
                                                <FontAwesomeIcon icon={icon} style={{ fontSize: '0.95rem' }} />
                                            </div>
                                            <span className="badge px-2 py-1" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', fontSize: '0.68rem' }}>
                                                {service.category || 'Enterprise'}
                                            </span>
                                        </div>

                                        <h6 className="fw-bold mb-1.5" style={{ color: 'var(--cp-text-main)', fontSize: '0.92rem' }}>{service.name}</h6>
                                        <p className="small mb-3" style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem', lineHeight: 1.55 }}>
                                            {(service.description || '').substring(0, 75)}...
                                        </p>
                                    </div>
                                    <Link 
                                        to="/client/book" 
                                        onClick={() => handleSelectService(service)}
                                        className="btn btn-sm w-100 fw-semibold text-white d-flex align-items-center justify-content-center gap-1.5"
                                        style={{ backgroundColor: 'var(--cp-primary)', borderRadius: '4px', fontSize: '0.8rem', padding: '7px 12px' }}
                                    >
                                        Configure Solution <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                                    </Link>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </div>

            {/* 5. Support & Feedback Channels with Increased Gap Between Icon & Subheading */}
            <Row className="g-3">
                <Col md={6}>
                    <div className="p-4 cp-card h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-flex align-items-center justify-content-between mb-3.5 pb-2.5 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <div className="d-flex align-items-center gap-3.5">
                                    <div className="p-2.5 rounded d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px', backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary)' }}>
                                        <FontAwesomeIcon icon={faHeadset} style={{ fontSize: '1.1rem' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '1rem' }}>Direct Engineering Support</h6>
                                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.76rem' }}>Kampala Technology Hub • Enterprise Desk</small>
                                    </div>
                                </div>
                                <span className="badge bg-success bg-opacity-10 text-success" style={{ fontSize: '0.68rem', padding: '4px 8px' }}>
                                    ● 24/7 SLA Active
                                </span>
                            </div>

                            <div className="p-3 rounded mb-3.5" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2 pb-1.5 border-bottom border-light small" style={{ fontSize: '0.78rem' }}>
                                    <span style={{ color: 'var(--cp-text-muted)' }}>Assigned Lead</span>
                                    <strong style={{ color: 'var(--cp-text-main)' }}>Senior Solutions Architect</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2 pb-1.5 border-bottom border-light small" style={{ fontSize: '0.78rem' }}>
                                    <span style={{ color: 'var(--cp-text-muted)' }}>Priority 1 SLA</span>
                                    <strong className="text-success">&lt; 15 min Turnaround</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center small" style={{ fontSize: '0.78rem' }}>
                                    <span style={{ color: 'var(--cp-text-muted)' }}>Emergency Hotline</span>
                                    <strong style={{ color: 'var(--cp-text-main)' }}>+256 700 000 000</strong>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2.5 border-top" style={{ borderColor: 'var(--cp-border)' }}>
                            <a 
                                href="mailto:support@koshercode.com" 
                                className="btn btn-sm fw-semibold text-white d-inline-flex align-items-center gap-1.5"
                                style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '4px', fontSize: '0.82rem', padding: '7px 14px' }}
                            >
                                Email Lead Architect <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                            </a>
                            <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.76rem' }}>
                                support@koshercode.com
                            </small>
                        </div>
                    </div>
                </Col>

                <Col md={6}>
                    <div className="p-4 cp-card h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-flex align-items-center justify-content-between mb-3.5 pb-2.5 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <div className="d-flex align-items-center gap-3.5">
                                    <div className="p-2.5 rounded d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                                        <FontAwesomeIcon icon={faComments} style={{ fontSize: '1.1rem' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '1rem' }}>Client Reviews & Testimonials</h6>
                                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.76rem' }}>Verified Enterprise Feedback & Ratings</small>
                                    </div>
                                </div>
                                <span className="badge" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', fontSize: '0.68rem', padding: '4px 8px' }}>
                                    ★★★★★ 5.0 Rating
                                </span>
                            </div>

                            <p className="small mb-3.5" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.6, fontSize: '0.84rem' }}>
                                Have you recently completed a banking integration, SACCO ERP rollout, or bespoke software milestone with Kosher Code? Share your review to be featured across our platform.
                            </p>

                            <div className="d-flex flex-wrap gap-2 mb-3.5">
                                <span className="badge" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', color: 'var(--cp-text-main)', fontSize: '0.74rem', padding: '5px 10px' }}>
                                    ✓ Verified Client Feedback
                                </span>
                                <span className="badge" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', color: 'var(--cp-text-main)', fontSize: '0.74rem', padding: '5px 10px' }}>
                                    ✓ Direct Roadmap Influence
                                </span>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2.5 border-top" style={{ borderColor: 'var(--cp-border)' }}>
                            <Link 
                                to="/client/review" 
                                className="btn btn-sm btn-outline-success fw-semibold d-inline-flex align-items-center gap-1.5" 
                                style={{ borderRadius: '4px', fontSize: '0.82rem', padding: '7px 14px' }}
                            >
                                Submit Milestone Review <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                            </Link>
                            <Link to="/client/review" className="text-decoration-none small fw-semibold" style={{ color: 'var(--cp-primary)', fontSize: '0.78rem' }}>
                                View Testimonials &rarr;
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ClientLanding;
