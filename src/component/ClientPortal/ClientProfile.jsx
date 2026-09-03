import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import userimg from '../../Assets/user.svg';
import UserAvatar from '../Shared/UserAvatar/UserAvatar';
import { SET_USER, useAppContext } from '../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSignOutAlt, 
    faUserTie, 
    faEnvelope, 
    faShoppingCart, 
    faCalendarCheck, 
    faBolt,
    faLock
} from '@fortawesome/free-solid-svg-icons';
import { getUserOrders } from '../../services/storageService';
import { clearSessionStorage } from '../../services/sessionService';
import { firebaseSignOut } from '../../services/firebaseService';

const ClientProfile = () => {
    const { state: { user }, dispatch } = useAppContext();
    const navigate = useNavigate();

    const bookings = getUserOrders(user?.email);

    const signOut = () => {
        clearSessionStorage();
        firebaseSignOut().catch(() => {});
        dispatch({ type: SET_USER, payload: { isSignedIn: false, email: '', name: '' } });
        toast.success('Client session closed');
        navigate('/client/login');
    };

    const displayName = user?.name || 'Enterprise Client';
    const displayEmail = user?.email || 'client@koshercode.com';
    const displayImg = user?.img || userimg;

    return (
        <div className="p-1 p-sm-2">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="cp-card p-4">
                        {/* Profile Header */}
                        <div className="text-center mb-4">
                            <div className="d-flex justify-content-center mb-3">
                                <UserAvatar 
                                    src={displayImg} 
                                    name={displayName}
                                    role="client"
                                    size="2xl"
                                    showStatus={true}
                                    ring={true}
                                    ringType="glow"
                                />
                            </div>
                            <div className="mt-2.5 mb-1">
                                <span 
                                    className="badge px-3 py-1 fw-semibold"
                                    style={{
                                        backgroundColor: 'var(--cp-primary-subtle)',
                                        color: 'var(--cp-primary-text)',
                                        border: '1px solid var(--cp-border)',
                                        fontSize: '0.78rem'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserTie} className="me-1.5" />
                                    Verified Enterprise Partner
                                </span>
                            </div>
                            <h4 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{displayName}</h4>
                            <p className="small mb-0 d-flex align-items-center justify-content-center gap-1.5" style={{ color: 'var(--cp-text-muted)' }}>
                                <FontAwesomeIcon icon={faEnvelope} /> {displayEmail}
                            </p>
                        </div>

                        {/* Account & Telemetry Details */}
                        <div className="p-3.5 mb-4 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                            <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>Account Telemetry & SLA Status</h6>
                            
                            <div className="d-flex justify-content-between align-items-center mb-2.5 pb-2 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Workspace Mode</span>
                                <span className="small fw-bold" style={{ color: 'var(--cp-text-main)' }}>Dedicated Client Workspace</span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-2.5 pb-2 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>SLA Support Level</span>
                                <span className="small fw-bold text-success">
                                    <FontAwesomeIcon icon={faBolt} className="me-1" /> 24/7 Priority Tier (99.9% Uptime)
                                </span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-2.5 pb-2 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Active Solutions</span>
                                <span className="small fw-bold" style={{ color: 'var(--cp-text-main)' }}>{bookings.length} Registered Project(s)</span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>Engineering HQ Desk</span>
                                <span className="small fw-bold" style={{ color: 'var(--cp-text-main)' }}>Kampala, Uganda</span>
                            </div>
                        </div>

                        {/* Security Session Details */}
                        <div className="p-3 mb-4 rounded d-flex align-items-center gap-2.5" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                            <FontAwesomeIcon icon={faLock} style={{ color: 'var(--cp-primary)' }} />
                            <div>
                                <strong className="d-block small" style={{ color: 'var(--cp-text-main)' }}>Session Protected</strong>
                                <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>Auto-terminates upon tab closure for maximum security.</small>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-grid gap-3">
                            <Link to="/client/book" className="btn py-2.5 text-white fw-semibold" style={{ backgroundColor: 'var(--cp-primary)', borderRadius: '4px' }}>
                                <FontAwesomeIcon icon={faShoppingCart} className="me-2" /> Book New Solution
                            </Link>
                            <Link to="/client/bookings" className="btn btn-outline-secondary py-2.5 fw-semibold" style={{ borderRadius: '4px', borderColor: 'var(--cp-border)', color: 'var(--cp-text-main)' }}>
                                <FontAwesomeIcon icon={faCalendarCheck} className="me-2" /> View My Engagements ({bookings.length})
                            </Link>
                            <button 
                                onClick={signOut} 
                                className="btn btn-outline-danger py-2.5 fw-semibold" 
                                style={{ borderRadius: '4px' }}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Exit Session & Log Out
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ClientProfile;
