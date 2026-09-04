import React from 'react';
import { Col, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import userimg from '../../Assets/user.svg';
import UserAvatar from '../Shared/UserAvatar/UserAvatar';
import { SET_USER, SET_ADMIN, useAppContext } from '../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShieldAlt, faEnvelope, faList, faPlus, faUserShield, faServer } from '@fortawesome/free-solid-svg-icons';
import { getStoredAdmins, getStoredOrders } from '../../services/storageService';
import { clearSessionStorage } from '../../services/sessionService';
import { firebaseSignOut } from '../../services/firebaseService';

const AdminProfile = () => {
    const { state: { user }, dispatch } = useAppContext();
    const navigate = useNavigate();
    const admins = getStoredAdmins();
    const orders = getStoredOrders();

    const signOut = () => {
        clearSessionStorage();
        firebaseSignOut().catch(() => {});
        dispatch({ type: SET_USER, payload: { isSignedIn: false } });
        dispatch({ type: SET_ADMIN, payload: false });
        toast.success('Administrator session closed');
        navigate('/admin/login');
    };

    const displayName = user?.name || 'Super Administrator';
    const displayEmail = user?.email || 'georgewilliamochole@gmail.com';
    const displayImg = user?.img || userimg;

    return (
        <div className="p-1 p-sm-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="row justify-content-center">
                <Col md={9} lg={8} xl={7} className="my-2">
                    <div 
                        className="p-4 p-md-5"
                        style={{
                            backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                            borderRadius: '0',
                            border: '1px solid var(--cp-border-subtle, rgba(0, 0, 0, 0.06))',
                            boxShadow: '0 4px 24px -2px rgba(15, 23, 42, 0.05)'
                        }}
                    >
                        <div className="text-center mb-4 pb-2">
                            <div className="d-flex justify-content-center mb-3">
                                <UserAvatar 
                                    src={displayImg} 
                                    name={displayName}
                                    role="admin"
                                    size="2xl"
                                    showStatus={true}
                                    ring={true}
                                    ringType="glow"
                                />
                            </div>
                            <div className="mb-2">
                                <span 
                                    className="badge px-3.5 py-1.5 fw-semibold"
                                    style={{
                                        backgroundColor: 'var(--cp-primary-subtle)',
                                        color: 'var(--cp-primary-text)',
                                        border: '1px solid var(--cp-border-highlight)',
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.02em',
                                        borderRadius: '0'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faShieldAlt} className="me-1.5" style={{ color: 'var(--status-pending-text)' }} />
                                    Executive Superadministrator
                                </span>
                            </div>
                            <h3 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.02em' }}>
                                {displayName}
                            </h3>
                            <p className="small mb-0 d-flex align-items-center justify-content-center gap-1.5" style={{ color: 'var(--cp-text-muted)' }}>
                                <FontAwesomeIcon icon={faEnvelope} /> {displayEmail}
                            </p>
                        </div>

                        <div 
                            className="p-4 mb-4" 
                            style={{ 
                                backgroundColor: 'var(--cp-card-subtle)', 
                                borderRadius: '0',
                                border: '1px solid var(--cp-border)'
                            }}
                        >
                            <h6 className="fw-bold mb-3.5 small text-uppercase" style={{ color: 'var(--cp-text-main)', letterSpacing: '0.05em' }}>
                                System & Infrastructure Telemetry
                            </h6>
                            <div className="d-flex justify-content-between align-items-center mb-2.5 pb-2 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Platform Clearance</span>
                                <span className="small fw-bold" style={{ color: 'var(--cp-text-main)' }}>Full Superuser Clearance</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2.5 pb-2 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Active Inbound Pipeline</span>
                                <span className="small fw-bold" style={{ color: 'var(--cp-primary)' }}>{orders.length} Requests Logged</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2.5 pb-2 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Admin Team Size</span>
                                <span className="small fw-bold" style={{ color: 'var(--cp-text-main)' }}>{admins.length} Active Admins</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center pt-0.5">
                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Data Infrastructure</span>
                                <span className="small fw-bold d-flex align-items-center gap-1.5" style={{ color: 'var(--status-done-text)' }}>
                                    <FontAwesomeIcon icon={faServer} /> Cloud Sync & Storage (100% Operational)
                                </span>
                            </div>
                        </div>

                        <div className="d-grid gap-2.5">
                            <Link 
                                to="/admin/orders" 
                                className="btn text-white py-2.5 d-flex align-items-center justify-content-center gap-2 border-0" 
                                style={{ 
                                    backgroundColor: '#121417', 
                                    fontWeight: 600, 
                                    fontSize: '0.88rem',
                                    borderRadius: '0'
                                }}
                            >
                                <FontAwesomeIcon icon={faList} /> Review Inbound Inquiries Table
                            </Link>
                            <Link 
                                to="/admin/add-service" 
                                className="btn btn-outline-secondary py-2.5 d-flex align-items-center justify-content-center gap-2" 
                                style={{ 
                                    fontWeight: 600, 
                                    color: 'var(--cp-text-main)', 
                                    borderColor: 'var(--cp-border)',
                                    fontSize: '0.88rem',
                                    borderRadius: '0'
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Publish New Solution to Catalog
                            </Link>
                            <Link 
                                to="/admin/team" 
                                className="btn btn-outline-secondary py-2.5 d-flex align-items-center justify-content-center gap-2" 
                                style={{ 
                                    fontWeight: 600, 
                                    color: 'var(--cp-text-main)', 
                                    borderColor: 'var(--cp-border)',
                                    fontSize: '0.88rem',
                                    borderRadius: '0'
                                }}
                            >
                                <FontAwesomeIcon icon={faUserShield} /> Manage Administrator Privileges
                            </Link>
                            <Button 
                                variant="outline-danger" 
                                className="py-2.5 d-flex align-items-center justify-content-center gap-2 mt-1"
                                style={{ fontWeight: 600, fontSize: '0.88rem', borderRadius: '0' }}
                                onClick={signOut}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out of Admin Command Center
                            </Button>
                        </div>
                    </div>
                </Col>
            </div>
        </div>
    );
};

export default AdminProfile;
