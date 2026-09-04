import React, { useEffect, useState } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Book.css';
import swal from 'sweetalert';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle, 
    faPaperPlane, 
    faShieldAlt, 
    faUniversity,
    faPiggyBank,
    faChartLine,
    faMobileAlt,
    faArrowRight,
    faFileContract,
    faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { SET_SELECTED_SERVICE, useAppContext } from '../../../../context';
import { 
    getStoredServices, 
    fetchServicesAsync, 
    subscribeToServices, 
    saveOrder,
    getUserOrders,
    getUserOrdersAsync,
    subscribeToUserOrders
} from '../../../../services/storageService';

const Book = () => {
    const { state: { user, selectedService }, dispatch } = useAppContext();
    const [services, setServices] = useState(() => getStoredServices());
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Fetch services from Firestore
        fetchServicesAsync().then(cloudServices => {
            if (cloudServices && cloudServices.length > 0) {
                setServices(cloudServices);
            }
        });

        // Real-time listener for services catalog
        const unsubscribe = subscribeToServices((cloudServices) => {
            if (cloudServices && cloudServices.length > 0) {
                setServices(cloudServices);
            }
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, []);

    const userEmail = user?.email || 'client@koshercode.com';
    const [subscribedSolutions, setSubscribedSolutions] = useState(() => getUserOrders(userEmail));

    useEffect(() => {
        getUserOrdersAsync(userEmail).then(orders => {
            if (orders && orders.length > 0) {
                setSubscribedSolutions(orders);
            }
        });

        const unsubscribe = subscribeToUserOrders(
            userEmail,
            (cloudOrders) => {
                if (cloudOrders) setSubscribedSolutions(cloudOrders);
            },
            (err) => console.log('Subscribed solutions listener:', err?.message)
        );

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [userEmail]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'In Review':
                return { bg: 'rgba(139, 92, 246, 0.12)', text: '#8B5CF6', border: 'rgba(139, 92, 246, 0.25)' };
            case 'In Progress':
                return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.25)' };
            case 'Done':
            case 'Completed':
                return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', border: 'rgba(16, 185, 129, 0.25)' };
            default: // Pending
                return { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.25)' };
        }
    };

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || 'client@koshercode.com',
        phone: '+256 ',
        institution: 'MSME / SME Business',
        region: 'Uganda (Kampala & Regional)',
        pricingType: 'Consultation Quotation (Price defined later)',
        customPrice: selectedService?.price ? `$${selectedService.price} (Starter)` : 'To be discussed',
        description: '',
        timeline: 'Immediate (1-3 months)'
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const cat = queryParams.get('category');
        if (cat && services.length > 0) {
            let matched = null;
            if (cat === 'banking') matched = services.find(s => s.category?.includes('Banking'));
            else if (cat === 'sacco') matched = services.find(s => s.category?.includes('SACCO'));
            else if (cat === 'msme') matched = services.find(s => s.category?.includes('MSME') || s.category?.includes('Enterprise'));
            else if (cat === 'digital') matched = services.find(s => s.category?.includes('Digital') || s.name?.includes('Web'));
            if (matched) {
                dispatch({ type: SET_SELECTED_SERVICE, payload: matched });
                setFormData(prev => ({
                    ...prev,
                    customPrice: `$${matched.price} (Starting)`,
                    institution: matched.category?.includes('Banking') ? 'Commercial Banking & FinTech' : matched.category?.includes('SACCO') ? 'SACCO / Microfinance Institution' : prev.institution
                }));
                return;
            }
        }
        if ((!selectedService || !selectedService.name) && services.length > 0) {
            dispatch({ type: SET_SELECTED_SERVICE, payload: services[0] });
        }
    }, [location.search, selectedService, dispatch, services]);

    const handleServiceChange = (e) => {
        const found = services.find(s => s.name === e.target.value);
        if (found) {
            dispatch({ type: SET_SELECTED_SERVICE, payload: found });
            setFormData(prev => ({
                ...prev,
                customPrice: `$${found.price} (Starting)`,
                institution: found.category?.includes('Banking') ? 'Commercial Banking & FinTech' : found.category?.includes('SACCO') ? 'SACCO / Microfinance Institution' : prev.institution
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const currentService = selectedService?.name ? selectedService : (services[0] || {});

    const getServiceIcon = (str = '') => {
        const cat = (str || '').toLowerCase();
        if (cat.includes('banking') || cat.includes('fintech')) return faUniversity;
        if (cat.includes('sacco') || cat.includes('microfinance')) return faPiggyBank;
        if (cat.includes('msme') || cat.includes('growth') || cat.includes('erp')) return faChartLine;
        return faMobileAlt;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const loading = toast.loading('Submitting solution request...');

        const newOrder = {
            name: formData.name || user?.name || 'Valued Client',
            email: formData.email || user?.email || 'client@koshercode.com',
            phone: formData.phone,
            institution: formData.institution,
            region: formData.region,
            serviceName: currentService.name,
            serviceId: currentService._id,
            price: currentService.price || 48,
            pricingType: formData.pricingType,
            description: formData.description || 'Project requirements and system implementation request.',
            img: currentService.img || 'https://assets.maccarianagency.com/svg/illustrations/designer.svg',
            timeline: formData.timeline,
            status: 'Pending'
        };

        setTimeout(() => {
            saveOrder(newOrder);
            toast.dismiss(loading);
            swal({
                title: "Solution Request Submitted!",
                text: `Your request for "${currentService.name}" has been logged into the Kosher Code system. Our engineering lead in Kampala will review and update the status in your portal.`,
                icon: "success",
                button: "View My Engagements"
            }).then(() => {
                navigate('/client/bookings');
            });
        }, 450);
    };

    return (
        <div className="p-1 p-sm-2">
            {/* Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-4 border-bottom gap-2" style={{ borderColor: 'var(--cp-border)' }}>
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>Configure & Book Enterprise Solution</h4>
                    <p className="mb-0 small" style={{ color: 'var(--cp-text-muted)' }}>Tailor architecture parameters, user volume, and engagement models with Kampala HQ engineers.</p>
                </div>
                <span className="badge rounded-pill px-3.5 py-2 mt-2 mt-sm-0 d-inline-flex align-items-center gap-1.5" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', border: '1px solid var(--cp-border)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <FontAwesomeIcon icon={faShieldAlt} /> 24/7 SLA Protected
                </span>
            </div>

            <Row className="g-4">
                {/* Form Inputs (Left Column) */}
                <Col lg={8}>
                    <div className="cp-card p-4 p-md-5">
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-3">
                                {/* Selected Solution */}
                                <Col md={6} xs={12}>
                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Target Solution *</Form.Label>
                                    <select 
                                        className="form-select cp-input" 
                                        value={currentService.name} 
                                        onChange={handleServiceChange}
                                    >
                                        {services.map((s, idx) => (
                                            <option key={s._id || idx} value={s.name}>
                                                {s.name} ({s.category})
                                            </option>
                                        ))}
                                    </select>
                                </Col>

                                {/* Pricing / Budget Model */}
                                <Col md={6} xs={12}>
                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Pricing Model *</Form.Label>
                                    <select 
                                        name="pricingType"
                                        className="form-select cp-input" 
                                        value={formData.pricingType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Consultation Quotation (Price defined later)">Consultation Quote (Price Defined Later)</option>
                                        <option value="Standard Solution Tier">Standard Tier (${currentService.price})</option>
                                        <option value="Fixed Milestone Contract">Fixed Milestone Contract</option>
                                        <option value="Monthly Retainer SLA">Monthly Retainer & 24/7 SLA</option>
                                    </select>
                                </Col>

                                {/* Institution / Sector */}
                                <Col md={6} xs={12}>
                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Institution / Industry Sector *</Form.Label>
                                    <select 
                                        name="institution"
                                        className="form-select cp-input" 
                                        value={formData.institution}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Commercial Banking & FinTech">Commercial Banking & FinTech</option>
                                        <option value="SACCO / Microfinance Institution">SACCO / Microfinance Institution (MFI)</option>
                                        <option value="MSME / SME Business">MSME / SME Growth Enterprise</option>
                                        <option value="Tech Startup & Creators">Tech Startup & Digital Platform</option>
                                        <option value="Multi-Continental Corporation">Multi-Continental Enterprise</option>
                                        <option value="Government Agency / NGO">Government Agency / NGO</option>
                                    </select>
                                </Col>

                                {/* Operational Region */}
                                <Col md={6} xs={12}>
                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Operational Region *</Form.Label>
                                    <select 
                                        name="region"
                                        className="form-select cp-input" 
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Uganda (Kampala & Regional)">Uganda (Kampala & Regional)</option>
                                        <option value="East Africa (Kenya, TZ, RW, SS)">East Africa (Kenya, TZ, RW, SS)</option>
                                        <option value="Pan-African Operations">Pan-African Operations</option>
                                        <option value="Multi-Continental / Global">Multi-Continental / Global</option>
                                    </select>
                                </Col>

                                {/* Contact Person Name */}
                                <Col md={4} xs={12}>
                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Authorized Contact Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        required
                                        className="cp-input"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. David Mukasa"
                                    />
                                </Col>

                                {/* Email */}
                                <Col md={4} xs={12}>
                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Corporate Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        required
                                        className="cp-input"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="mukasa@organization.com"
                                    />
                                </Col>

                                {/* Phone / WhatsApp */}
                                <Col md={4} xs={12}>
                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Phone / WhatsApp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        className="cp-input"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+256 700 000 000"
                                    />
                                </Col>

                                {/* Scope & Specifications */}
                                <Col md={12}>
                                    <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Scope & Special Integrations</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        className="cp-input"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Specific integrations required (MTN MoMo, Airtel Money, URA EFRIS, CBS Core Banking, SWIFT, AWS/Azure cloud)..."
                                    />
                                </Col>
                            </Row>

                            <div className="d-flex flex-wrap align-items-center justify-content-between mt-4 pt-3 border-top gap-3" style={{ borderColor: 'var(--cp-border)' }}>
                                <div className="d-flex align-items-center gap-2 small" style={{ color: 'var(--cp-text-muted)' }}>
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                                    <span>Direct Kampala HQ SLA commitment and NDA included.</span>
                                </div>

                                <button
                                    type="submit"
                                    className="btn rounded-pill py-2.5 px-5 d-inline-flex align-items-center gap-2 text-white fw-semibold"
                                    style={{
                                        backgroundColor: '#121417',
                                        borderColor: '#121417',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} /> Submit Solution Request
                                </button>
                            </div>
                        </Form>
                    </div>
                </Col>

                {/* Right Column: Live Solution Summary & Already Subscribed Solutions */}
                <Col lg={4}>
                    <div className="sticky-top" style={{ top: '80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* 1. Target Solution Configuration Summary */}
                        <div className="book-summary-card">
                            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <div className="d-flex align-items-center gap-3 overflow-hidden">
                                    <div className="book-summary-icon">
                                        <FontAwesomeIcon icon={getServiceIcon(currentService.category || currentService.name)} style={{ fontSize: '1.2rem' }} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <span 
                                            className="badge rounded-pill px-2.5 py-1 mb-1 d-inline-block"
                                            style={{ 
                                                backgroundColor: 'var(--cp-primary-subtle)', 
                                                color: 'var(--cp-primary-text)', 
                                                fontSize: '0.7rem', 
                                                fontWeight: 600 
                                            }}
                                        >
                                            {currentService.category || 'Enterprise Solution'}
                                        </span>
                                        <h6 className="fw-bold mb-0 text-truncate" style={{ color: 'var(--cp-text-main)', fontSize: '1.02rem' }}>
                                            {currentService.name}
                                        </h6>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <span className="admin-kpi-label mb-2">ENGAGEMENT SPECIFICATIONS</span>
                                <div className="book-param-row">
                                    <span className="book-param-label">Pricing Model</span>
                                    <span className="book-param-value text-truncate ms-2" style={{ maxWidth: '170px' }}>
                                        {formData.pricingType.split('(')[0]}
                                    </span>
                                </div>
                                <div className="book-param-row">
                                    <span className="book-param-label">Industry Sector</span>
                                    <span className="book-param-value text-truncate ms-2" style={{ maxWidth: '170px' }}>
                                        {formData.institution}
                                    </span>
                                </div>
                                <div className="book-param-row">
                                    <span className="book-param-label">Operational Region</span>
                                    <span className="book-param-value text-truncate ms-2" style={{ maxWidth: '170px' }}>
                                        {formData.region}
                                    </span>
                                </div>
                                <div className="book-param-row">
                                    <span className="book-param-label">Turnaround SLA</span>
                                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                                        24h Engineering Review
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 rounded-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <FontAwesomeIcon icon={faShieldAlt} style={{ color: 'var(--cp-primary)' }} />
                                    <strong className="small" style={{ color: 'var(--cp-text-main)' }}>Kampala HQ Engineering SLA</strong>
                                </div>
                                <p className="small mb-0" style={{ color: 'var(--cp-text-muted)', fontSize: '0.76rem', lineHeight: 1.55 }}>
                                    Dedicated Lead Architect assignment, ISO/FinTech security compliance, and continuous deployment pipeline.
                                </p>
                            </div>
                        </div>

                        {/* 2. Already Subscribed Solutions */}
                        <div className="book-summary-card">
                            <div className="d-flex align-items-center justify-content-between mb-3 pb-2.5 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <div>
                                    <h6 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)', fontSize: '0.98rem' }}>
                                        Already Subscribed Solutions
                                    </h6>
                                    <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.74rem' }}>
                                        Active institutional engagements
                                    </small>
                                </div>
                                <span 
                                    className="badge rounded-pill px-2.5 py-1 fw-semibold"
                                    style={{
                                        backgroundColor: 'var(--cp-primary-subtle)',
                                        color: 'var(--cp-primary-text)',
                                        fontSize: '0.74rem',
                                        border: '1px solid var(--cp-border)'
                                    }}
                                >
                                    {subscribedSolutions.length} {subscribedSolutions.length === 1 ? 'Solution' : 'Solutions'}
                                </span>
                            </div>

                            {subscribedSolutions.length > 0 ? (
                                <div className="subscribed-solution-list">
                                    {subscribedSolutions.map((sol, idx) => {
                                        const statusStyle = getStatusStyle(sol.status);
                                        return (
                                            <div 
                                                key={sol._id || idx} 
                                                className="subscribed-solution-item"
                                            >
                                                <div className="d-flex align-items-center gap-2.5 overflow-hidden">
                                                    <div className="subscribed-item-icon">
                                                        <FontAwesomeIcon icon={getServiceIcon(sol.serviceName || sol.name || '')} />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div 
                                                            className="fw-semibold text-truncate" 
                                                            style={{ color: 'var(--cp-text-main)', fontSize: '0.84rem' }} 
                                                            title={sol.serviceName || sol.name}
                                                        >
                                                            {sol.serviceName || sol.name || 'Enterprise Solution'}
                                                        </div>
                                                        <div className="text-truncate" style={{ color: 'var(--cp-text-muted)', fontSize: '0.72rem' }}>
                                                            {sol.institution || sol.pricingType || 'Standard Tier'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span 
                                                    className="subscribed-badge-pill"
                                                    style={{
                                                        backgroundColor: statusStyle.bg,
                                                        color: statusStyle.text,
                                                        borderColor: statusStyle.border
                                                    }}
                                                >
                                                    ● {sol.status || 'Pending'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div 
                                    className="text-center p-3.5 rounded-4"
                                    style={{
                                        backgroundColor: 'var(--cp-card-subtle)',
                                        border: '1.5px dashed var(--cp-border)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faFileContract} style={{ fontSize: '1.8rem', color: 'var(--cp-text-light)' }} className="mb-2 mt-1" />
                                    <h6 className="fw-bold mb-1 small" style={{ color: 'var(--cp-text-main)' }}>No Active Subscriptions Yet</h6>
                                    <p className="small mb-0" style={{ color: 'var(--cp-text-muted)', fontSize: '0.74rem' }}>
                                        Once submitted, your booked solutions and implementation milestones will be tracked here.
                                    </p>
                                </div>
                            )}

                            <div className="d-flex align-items-center justify-content-between mt-3 pt-2.5 border-top" style={{ borderColor: 'var(--cp-border)' }}>
                                <Link 
                                    to="/client/bookings" 
                                    className="d-flex align-items-center justify-content-between w-100 text-decoration-none fw-semibold small"
                                    style={{ color: 'var(--cp-primary)', fontSize: '0.82rem' }}
                                >
                                    <span>Manage All Subscriptions</span>
                                    <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.75rem' }} />
                                </Link>
                            </div>
                        </div>

                        {/* Direct contact note */}
                        <div className="text-center">
                            <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>
                                Need a custom SLA? Email <a href="mailto:support@koshercode.com" style={{ color: 'var(--cp-primary)', fontWeight: 600 }}>support@koshercode.com</a>
                            </small>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Book;
