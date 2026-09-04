import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import './BookList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faTrashAlt, 
    faCalendarAlt, 
    faBuilding, 
    faMapMarkerAlt, 
    faUniversity, 
    faPiggyBank, 
    faChartLine, 
    faMobileAlt,
    faFileContract,
    faEye,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../../../../context';
import { getUserOrders, deleteStoredOrder, subscribeToUserOrders, getUserOrdersAsync } from '../../../../services/storageService';

const BookList = () => {
    const { state: { user } } = useAppContext();
    const [bookings, setBookings] = useState(() => getUserOrders(user?.email));
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user?.email) {
            setBookings([]);
            return;
        }

        // Initial load
        getUserOrdersAsync(user.email).then(orders => {
            setBookings(orders || []);
        });

        // Real-time Firestore listener
        const unsubscribe = subscribeToUserOrders(
            user.email,
            (cloudOrders) => {
                setBookings(cloudOrders || []);
            },
            (err) => {
                console.log('Live user orders subscription:', err.message);
            }
        );

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [user?.email]);

    const handleDelete = (id, status) => {
        swal({
            title: status === 'Done' ? "Remove Record?" : "Cancel Booking Request?",
            text: `Are you sure you want to ${status === 'Done' ? "remove this engagement record" : "cancel this request"}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                const updated = deleteStoredOrder(id);
                setBookings(updated.filter(o => !user?.email || o.email?.toLowerCase() === user?.email?.toLowerCase()));
                toast.success('Engagement record updated.');
            }
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'In Review':
                return { bg: 'rgba(139, 92, 246, 0.12)', text: '#8B5CF6', border: 'rgba(139, 92, 246, 0.3)' };
            case 'In Progress':
                return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' };
            case 'Done':
            case 'Completed':
                return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' };
            default: // Pending
                return { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
        }
    };

    const getServiceIcon = (name = '', inst = '') => {
        if (name.includes('Banking') || inst.includes('Banking')) return faUniversity;
        if (name.includes('SACCO') || inst.includes('SACCO')) return faPiggyBank;
        if (name.includes('MSME') || inst.includes('MSME')) return faChartLine;
        return faMobileAlt;
    };

    return (
        <div className="p-1 p-sm-2">
            <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-4 border-bottom gap-2" style={{ borderColor: 'var(--cp-border)' }}>
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>Active Engagements & Bookings</h4>
                    <p className="mb-0 small" style={{ color: 'var(--cp-text-muted)' }}>Track the real-time engineering and review status of your enterprise software requests.</p>
                </div>
                <div>
                    <Link to="/client/book">
                        <Button 
                            className="rounded-pill d-flex align-items-center gap-2 fw-semibold px-4 py-2.5 text-white"
                            style={{ backgroundColor: '#121417', borderColor: '#121417', fontSize: '0.86rem', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)' }}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Book Another Solution
                        </Button>
                    </Link>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-5 cp-card p-5">
                    <FontAwesomeIcon icon={faFileContract} style={{ fontSize: '3rem', color: 'var(--cp-text-light)' }} className="mb-3" />
                    <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>No Active Engagements Found</h5>
                    <p className="small mb-3" style={{ color: 'var(--cp-text-muted)' }}>You haven't submitted any solution booking requests yet.</p>
                    <Link to="/client/book">
                        <Button className="rounded-pill px-4 py-2 text-white" style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', fontSize: '0.85rem' }}>
                            Explore & Book Solutions
                        </Button>
                    </Link>
                </div>
            ) : (
                <Row className="g-4">
                    {bookings.map((booking) => {
                        const statusStyle = getStatusStyle(booking.status);
                        const icon = getServiceIcon(booking.serviceName, booking.institution);
                        return (
                            <Col md={6} lg={4} key={booking._id}>
                                <div className="cp-card d-flex flex-column h-100 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span 
                                            className="px-3 py-1 fw-bold rounded-pill"
                                            style={{
                                                fontSize: '0.78rem',
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.text,
                                                border: `1px solid ${statusStyle.border}`
                                            }}
                                        >
                                            ● {booking.status}
                                        </span>
                                        <span className="small d-flex align-items-center gap-1.5" style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>
                                            <FontAwesomeIcon icon={faCalendarAlt} /> {booking.date || 'Active'}
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center gap-3 mb-3.5">
                                        <div 
                                            className="d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{ 
                                                width: '44px', 
                                                height: '44px', 
                                                borderRadius: '50%', 
                                                backgroundColor: 'var(--cp-primary-subtle)',
                                                color: 'var(--cp-primary)',
                                                border: '1px solid var(--cp-border)'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={icon} style={{ fontSize: '1.05rem' }} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h6 className="fw-bold mb-0.5 text-truncate" style={{ color: 'var(--cp-text-main)', fontSize: '1.02rem' }}>
                                                {booking.serviceName}
                                            </h6>
                                            <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.76rem' }}>
                                                {booking.timeline || '1-3 months delivery'}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-4 mb-3 small" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                        {booking.institution && (
                                            <div className="d-flex align-items-center gap-2 mb-1.5">
                                                <FontAwesomeIcon icon={faBuilding} style={{ color: 'var(--cp-primary)', fontSize: '0.85rem' }} />
                                                <span className="fw-semibold" style={{ color: 'var(--cp-text-main)' }}>{booking.institution}</span>
                                            </div>
                                        )}
                                        {booking.region && (
                                            <div className="d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--cp-text-light)', fontSize: '0.85rem' }} />
                                                <span style={{ color: 'var(--cp-text-muted)' }}>{booking.region}</span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="small flex-grow-1 mb-3" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.55, fontSize: '0.84rem' }}>
                                        {booking.description || 'Enterprise software architecture configured for your operational scale.'}
                                    </p>

                                    <div className="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top gap-2" style={{ borderColor: 'var(--cp-border)' }}>
                                        <div>
                                            <small className="d-block" style={{ fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>Pricing Model</small>
                                            <span className="fw-bold small" style={{ color: 'var(--cp-text-main)' }}>{booking.pricingType?.split('(')[0] || `$${booking.price || 48}`}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <button 
                                                type="button" 
                                                onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                                                className="btn btn-sm btn-outline-primary rounded-pill py-1.5 px-3 d-flex align-items-center gap-1.5 fw-semibold"
                                                style={{ fontSize: '0.78rem' }}
                                            >
                                                <FontAwesomeIcon icon={faEye} /> Inspect
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDelete(booking._id, booking.status)}
                                                className="btn btn-sm btn-outline-danger rounded-pill py-1.5 px-3 d-flex align-items-center gap-1.5 fw-semibold"
                                                style={{ fontSize: '0.78rem' }}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} /> {booking.status === 'Done' ? 'Remove' : 'Cancel'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Engagement Details Inspection Modal */}
            <Modal 
                show={showModal} 
                onHide={() => setShowModal(false)} 
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
                                borderRadius: '50%', 
                                backgroundColor: 'var(--cp-primary-subtle)',
                                color: 'var(--cp-primary)'
                            }}
                        >
                            <FontAwesomeIcon icon={getServiceIcon(selectedBooking?.serviceName, selectedBooking?.institution)} />
                        </div>
                        <div>
                            <Modal.Title className="fw-bold fs-5 mb-0" style={{ color: 'var(--cp-text-main)' }}>
                                {selectedBooking?.serviceName || 'Engagement Details'}
                            </Modal.Title>
                            <small style={{ color: 'var(--cp-text-muted)' }}>ID: {selectedBooking?._id || 'N/A'}</small>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div>
                            <Row className="g-3 mb-4">
                                <Col sm={6}>
                                    <div className="p-3 rounded-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                        <small className="admin-kpi-label">Current Status</small>
                                        <span 
                                            className="px-3 py-1 fw-bold rounded-pill d-inline-flex align-items-center gap-1.5"
                                            style={{
                                                backgroundColor: selectedBooking.status === 'Done' ? 'rgba(16, 185, 129, 0.12)' : selectedBooking.status === 'In Progress' ? 'rgba(59, 130, 246, 0.12)' : selectedBooking.status === 'In Review' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                                color: selectedBooking.status === 'Done' ? '#10B981' : selectedBooking.status === 'In Progress' ? '#3B82F6' : selectedBooking.status === 'In Review' ? '#8B5CF6' : '#F59E0B',
                                                border: `1px solid ${selectedBooking.status === 'Done' ? '#10B98133' : selectedBooking.status === 'In Progress' ? '#3B82F633' : selectedBooking.status === 'In Review' ? '#8B5CF633' : '#F59E0B33'}`,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            ● {selectedBooking.status || 'Pending'}
                                        </span>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="p-3 rounded-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                        <small className="admin-kpi-label">Pricing Model</small>
                                        <div className="fw-bold" style={{ color: 'var(--cp-text-main)', fontSize: '0.95rem' }}>
                                            {selectedBooking.pricingType || `$${selectedBooking.price || 48}`}
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="p-3 rounded-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                        <small className="admin-kpi-label">Institution / Sector</small>
                                        <div className="fw-semibold" style={{ color: 'var(--cp-text-main)', fontSize: '0.9rem' }}>
                                            {selectedBooking.institution || 'Commercial Banking & FinTech'}
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="p-3 rounded-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                        <small className="admin-kpi-label">Delivery Timeline</small>
                                        <div className="fw-semibold" style={{ color: 'var(--cp-text-main)', fontSize: '0.9rem' }}>
                                            {selectedBooking.timeline || 'Immediate (1-3 months)'}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div className="p-3.5 rounded-4 mb-3" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                <small className="admin-kpi-label mb-2">Scope & Project Specifications</small>
                                <p className="mb-0" style={{ color: 'var(--cp-text-main)', fontSize: '0.88rem', lineHeight: 1.6, wordBreak: 'break-word' }}>
                                    {selectedBooking.description || 'Enterprise software architecture configured for your operational scale.'}
                                </p>
                            </div>

                            <div className="p-3 rounded-4" style={{ backgroundColor: 'var(--cp-primary-subtle)', border: '1px solid var(--cp-border)' }}>
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
                        onClick={() => setShowModal(false)}
                        className="rounded-pill px-4 py-2"
                        style={{ fontSize: '0.85rem' }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BookList;
