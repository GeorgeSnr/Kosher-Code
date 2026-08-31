import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
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
    faFileContract
} from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../../../../context';
import { getUserOrders, deleteStoredOrder, subscribeToUserOrders, getUserOrdersAsync } from '../../../../services/storageService';

const BookList = () => {
    const { state: { user } } = useAppContext();
    const [bookings, setBookings] = useState(() => getUserOrders(user?.email));

    useEffect(() => {
        // Initial load
        getUserOrdersAsync(user?.email).then(orders => {
            if (orders && orders.length > 0) setBookings(orders);
        });

        // Real-time Firestore listener
        const unsubscribe = subscribeToUserOrders(
            user?.email,
            (cloudOrders) => {
                if (cloudOrders && cloudOrders.length > 0) {
                    setBookings(cloudOrders);
                }
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
                            className="d-flex align-items-center gap-2 fw-semibold"
                            style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '4px', fontSize: '0.88rem' }}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Book Another Solution
                        </Button>
                    </Link>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-5 cp-card p-4">
                    <FontAwesomeIcon icon={faFileContract} style={{ fontSize: '3rem', color: 'var(--cp-text-light)' }} className="mb-3" />
                    <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>No Active Engagements Found</h5>
                    <p className="small mb-3" style={{ color: 'var(--cp-text-muted)' }}>You haven't submitted any solution booking requests yet.</p>
                    <Link to="/client/book">
                        <Button style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '4px' }}>
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
                                            className="px-2.5 py-1 fw-bold"
                                            style={{
                                                fontSize: '0.78rem',
                                                borderRadius: '3px',
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.text,
                                                border: `1px solid ${statusStyle.border}`
                                            }}
                                        >
                                            ● {booking.status}
                                        </span>
                                        <span className="small d-flex align-items-center gap-1" style={{ color: 'var(--cp-text-muted)' }}>
                                            <FontAwesomeIcon icon={faCalendarAlt} /> {booking.date || 'Active'}
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center gap-3.5 mb-3.5">
                                        <div 
                                            className="d-flex align-items-center justify-content-center flex-shrink-0 rounded"
                                            style={{ 
                                                width: '40px', 
                                                height: '40px', 
                                                backgroundColor: 'var(--cp-primary-subtle)',
                                                color: 'var(--cp-primary)',
                                                border: '1px solid var(--cp-border)'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={icon} style={{ fontSize: '1rem' }} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)', fontSize: '1.02rem' }}>
                                                {booking.serviceName}
                                            </h6>
                                            <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>
                                                {booking.timeline || '1-3 months delivery'}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="p-2.5 rounded mb-3 small" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
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

                                    <p className="small flex-grow-1 mb-3" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.5 }}>
                                        {booking.description || 'Enterprise software architecture configured for your operational scale.'}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'var(--cp-border)' }}>
                                        <div>
                                            <small className="d-block" style={{ fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>Pricing Model</small>
                                            <span className="fw-bold small" style={{ color: 'var(--cp-text-main)' }}>{booking.pricingType?.split('(')[0] || `$${booking.price || 48}`}</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => handleDelete(booking._id, booking.status)}
                                            className="btn btn-sm btn-outline-danger py-1 px-2.5 d-flex align-items-center gap-1"
                                            style={{ borderRadius: '4px', fontSize: '0.78rem' }}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} /> {booking.status === 'Done' ? 'Remove' : 'Cancel'}
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default BookList;
