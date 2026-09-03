import React, { useEffect, useState } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import Order from './Order';
import './OrderList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faClock, faSpinner, faCheckDouble, faSearch } from '@fortawesome/free-solid-svg-icons';
import { 
    getStoredOrders, 
    updateOrderStatus, 
    deleteStoredOrder, 
    subscribeToOrders, 
    fetchOrdersAsync 
} from '../../../services/storageService';

const OrderList = () => {
    const [orders, setOrders] = useState(() => getStoredOrders());
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Initial fetch from cloud
        fetchOrdersAsync().then(cloudList => {
            if (cloudList && cloudList.length > 0) setOrders(cloudList);
        });

        // Real-time Firestore updates
        const unsubscribe = subscribeToOrders(
            (cloudOrders) => {
                if (cloudOrders && cloudOrders.length > 0) {
                    setOrders(cloudOrders);
                }
            },
            (err) => {
                console.log('Live admin orders subscription:', err.message);
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
            title: "Archive / Remove Request?",
            text: "Are you sure you want to delete this incoming client booking record?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                const updated = deleteStoredOrder(id);
                setOrders(updated);
                toast.success('Request removed successfully.');
            }
        });
    };

    // Filter and search
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
            {/* Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-4 border-bottom gap-2" style={{ borderColor: 'var(--cp-border)' }}>
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>Incoming Solution Requests & Engagements</h4>
                    <p className="text-muted mb-0 small">Admin Control Panel: Review client booking inquiries, adjust project statuses, and manage contracts.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge px-3 py-2" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', border: '1px solid var(--cp-border-highlight)', fontSize: '0.85rem' }}>
                        🛡️ Administrator Mode
                    </span>
                </div>
            </div>

            {/* Quick Metrics Cards */}
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
                        <span className="admin-kpi-label">TOTAL REQUESTS</span>
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
                        <span className="admin-kpi-label">PENDING REVIEW</span>
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
                        <span className="admin-kpi-label">IN PROGRESS</span>
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
                        <span className="admin-kpi-label">COMPLETED / DONE</span>
                        <h3 className="fw-bold mb-0" style={{ color: 'var(--status-done-text)' }}>{doneCount}</h3>
                    </div>
                </Col>
            </Row>

            {/* Filter & Search Bar */}
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
                        placeholder="Search client, service, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="cp-card p-4" style={{ borderRadius: '8px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3.5">
                    <div>
                        <h5 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>Pipeline & Inquiries List</h5>
                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.82rem' }}>Detailed breakdown of incoming commercial proposals and status workflows</small>
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
                        <p className="fw-semibold mb-0" style={{ color: 'var(--cp-text-muted)' }}>No booking requests match the selected filter.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 cp-table">
                            <thead>
                                <tr>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Client & Institution</th>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Contact Info</th>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Solution & Region</th>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Budget / Model</th>
                                    <th className="py-3 text-uppercase small fw-bold" style={{ letterSpacing: '0.04em' }}>Live Status</th>
                                    <th className="py-3 text-uppercase small fw-bold text-end" style={{ letterSpacing: '0.04em' }}>Action</th>
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

export default OrderList;
