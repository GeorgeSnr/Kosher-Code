import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, 
    faInbox, 
    faClock, 
    faSpinner, 
    faCheckDouble, 
    faPlus, 
    faUserShield, 
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import Order from '../Dashoboard/OrderList/Order';
import { 
    getStoredOrders, 
    updateOrderStatus, 
    deleteStoredOrder, 
    getStoredAdmins,
    subscribeToOrders,
    fetchOrdersAsync 
} from '../../services/storageService';

const AdminLanding = () => {
    const [orders, setOrders] = useState(() => getStoredOrders());
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [admins] = useState(() => getStoredAdmins());

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
        toast.success(`Booking status updated to "${newStatus}"!`);
    };

    const handleDelete = (id) => {
        swal({
            title: "Archive Request?",
            text: "Are you sure you want to remove this incoming client booking record?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                const updated = deleteStoredOrder(id);
                setOrders(updated);
                toast.success('Request archived.');
            }
        });
    };

    const filteredOrders = orders.filter(o => {
        const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
        const matchesSearch = !searchQuery || 
            o.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.institution?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const progressCount = orders.filter(o => o.status === 'In Progress').length;
    const doneCount = orders.filter(o => o.status === 'Done' || o.status === 'Completed').length;

    return (
        <div className="p-1 p-sm-2">
            {/* Executive Admin Banner */}
            <div className="p-4 p-md-4.5 mb-4 admin-hero-banner">
                <Row className="align-items-center g-4">
                    <Col md={8}>
                        <div className="admin-hero-badge mb-3">
                            <FontAwesomeIcon icon={faShieldAlt} style={{ color: '#A78BFA' }} /> Executive Operations & Command
                        </div>
                        <h3 className="fw-bold mb-2.5 text-white" style={{ letterSpacing: '-0.02em' }}>Kosher Code Administration Hub</h3>
                        <p className="mb-4 small" style={{ color: '#E2E8F0', maxWidth: '580px', lineHeight: 1.65 }}>
                            Supervise inbound enterprise requests across Uganda, East Africa, and multi-continental markets. Manage system catalog solutions and administrator access.
                        </p>
                        <div className="d-flex flex-wrap gap-3 gap-sm-3.5 mt-2">
                            <Link to="/admin/add-service" className="text-decoration-none">
                                <Button 
                                    className="px-4 py-2.5 fw-semibold text-white d-inline-flex align-items-center gap-2 border-0"
                                    style={{ backgroundColor: '#7355F7', borderRadius: '6px', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(115, 85, 247, 0.4)' }}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Publish Solution
                                </Button>
                            </Link>
                            <Link to="/admin/team" className="text-decoration-none">
                                <Button 
                                    variant="outline-light" 
                                    className="px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2"
                                    style={{ 
                                        borderRadius: '6px', 
                                        fontSize: '0.9rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: 'rgba(255, 255, 255, 0.25)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserShield} /> Admin Team ({admins.length})
                                </Button>
                            </Link>
                        </div>
                    </Col>
                    <Col md={4} className="d-none d-md-block text-end pe-3">
                        <div 
                            className="p-3.5 text-start" 
                            style={{ 
                                width: '240px', 
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.16)',
                                backdropFilter: 'blur(8px)',
                                display: 'inline-block'
                            }}
                        >
                            <small className="d-block mb-1 fw-semibold text-uppercase" style={{ color: '#94A3B8', fontSize: '0.72rem', letterSpacing: '0.04em' }}>System Status</small>
                            <div className="fw-bold mb-3 d-flex align-items-center gap-1.5" style={{ color: '#34D399', fontSize: '0.95rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34D399', display: 'inline-block' }}></span>
                                99.9% Uptime Active
                            </div>
                            <small className="d-block mb-1 fw-semibold text-uppercase" style={{ color: '#94A3B8', fontSize: '0.72rem', letterSpacing: '0.04em' }}>Active Pipeline</small>
                            <div className="fw-bold text-white fs-6">{orders.length} Inbound Inquiries</div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Executive KPI Stats Bar */}
            <Row className="g-3.5 mb-4">
                <Col xs={6} md={3}>
                    <div className="p-4 admin-kpi-card h-100">
                        <div className="admin-kpi-bar" style={{ backgroundColor: '#7355F7' }}></div>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary)', fontSize: '1.15rem' }}>
                                <FontAwesomeIcon icon={faInbox} />
                            </div>
                            <span className="badge px-2.5 py-1" style={{ backgroundColor: 'var(--cp-card-subtle)', color: 'var(--cp-text-muted)', border: '1px solid var(--cp-border)', fontSize: '0.72rem' }}>Total</span>
                        </div>
                        <span className="admin-kpi-label">TOTAL INQUIRIES</span>
                        <h3 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{orders.length}</h3>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-4 admin-kpi-card h-100">
                        <div className="admin-kpi-bar" style={{ backgroundColor: '#F59E0B' }}></div>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--status-pending-bg)', color: 'var(--status-pending-text)', fontSize: '1.15rem' }}>
                                <FontAwesomeIcon icon={faClock} />
                            </div>
                            <span className="badge px-2.5 py-1 badge-status-pending" style={{ fontSize: '0.72rem' }}>Action Req.</span>
                        </div>
                        <span className="admin-kpi-label">PENDING PROPOSALS</span>
                        <h3 className="fw-bold mb-0" style={{ color: 'var(--status-pending-text)' }}>{pendingCount}</h3>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-4 admin-kpi-card h-100">
                        <div className="admin-kpi-bar" style={{ backgroundColor: '#3B82F6' }}></div>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--status-progress-bg)', color: 'var(--status-progress-text)', fontSize: '1.15rem' }}>
                                <FontAwesomeIcon icon={faSpinner} />
                            </div>
                            <span className="badge px-2.5 py-1 badge-status-progress" style={{ fontSize: '0.72rem' }}>In Sprint</span>
                        </div>
                        <span className="admin-kpi-label">ACTIVE ENGINEERING</span>
                        <h3 className="fw-bold mb-0" style={{ color: 'var(--status-progress-text)' }}>{progressCount}</h3>
                    </div>
                </Col>

                <Col xs={6} md={3}>
                    <div className="p-4 admin-kpi-card h-100">
                        <div className="admin-kpi-bar" style={{ backgroundColor: '#10B981' }}></div>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--status-done-bg)', color: 'var(--status-done-text)', fontSize: '1.15rem' }}>
                                <FontAwesomeIcon icon={faCheckDouble} />
                            </div>
                            <span className="badge px-2.5 py-1 badge-status-done" style={{ fontSize: '0.72rem' }}>Fulfilled</span>
                        </div>
                        <span className="admin-kpi-label">COMPLETED DELIVERIES</span>
                        <h3 className="fw-bold mb-0" style={{ color: 'var(--status-done-text)' }}>{doneCount}</h3>
                    </div>
                </Col>
            </Row>

            {/* Filter and Search Bar */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 cp-card p-3.5">
                <div className="d-flex flex-wrap gap-2.5 gap-sm-3">
                    {['All', 'Pending', 'In Review', 'In Progress', 'Done'].map(st => {
                        const isActive = filterStatus === st;
                        const count = st === 'All' ? orders.length : orders.filter(o => o.status === st).length;
                        return (
                            <button
                                key={st}
                                type="button"
                                className={`admin-filter-pill ${isActive ? 'active' : ''}`}
                                onClick={() => setFilterStatus(st)}
                            >
                                {st} <span style={{ opacity: isActive ? 0.9 : 0.75, fontSize: '0.76rem', marginLeft: '4px' }}>({count})</span>
                            </button>
                        );
                    })}
                </div>

                <div className="input-group" style={{ maxWidth: '320px' }}>
                    <span className="input-group-text cp-input border-end-0 px-3" style={{ borderRadius: '6px 0 0 6px', color: 'var(--cp-text-muted)' }}>
                        <FontAwesomeIcon icon={faSearch} style={{ fontSize: '0.85rem' }} />
                    </span>
                    <input
                        type="text"
                        className="form-control form-control-sm cp-input border-start-0 py-2"
                        style={{ borderRadius: '0 6px 6px 0' }}
                        placeholder="Search client, email, solution..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Inbound Requests Table */}
            <div className="cp-card p-4" style={{ borderRadius: '8px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3.5">
                    <div>
                        <h5 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>Live Inbound Client Requests</h5>
                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.82rem' }}>Update statuses to trigger live client portal notifications</small>
                    </div>
                    {filteredOrders.length > 0 && (
                        <span className="badge px-2.5 py-1" style={{ backgroundColor: 'var(--cp-card-subtle)', color: 'var(--cp-text-muted)', border: '1px solid var(--cp-border)' }}>
                            Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'record' : 'records'}
                        </span>
                    )}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--cp-card-subtle)', color: 'var(--cp-text-muted)' }}>
                            <FontAwesomeIcon icon={faInbox} style={{ fontSize: '1.25rem' }} />
                        </div>
                        <p className="fw-semibold mb-0" style={{ color: 'var(--cp-text-muted)' }}>No booking requests found matching your filter.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 cp-table">
                            <thead>
                                <tr>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Client & Organization</th>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Contact Details</th>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Solution & Region</th>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Pricing Model</th>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Status Update</th>
                                    <th className="py-3 text-uppercase small fw-bold text-end" style={{ letterSpacing: '0.04em' }}>Archive</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <Order 
                                        key={order._id} 
                                        order={order} 
                                        handleAction={handleAction}
                                        handleDelete={handleDelete}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLanding;
