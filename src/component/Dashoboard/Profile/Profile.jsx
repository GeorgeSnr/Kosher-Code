import React from 'react';
import { Col, Button, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Profile.css';
import userimg from '../../../Assets/user.svg';
import UserAvatar from '../../Shared/UserAvatar/UserAvatar';
import { SET_USER, SET_ADMIN, useAppContext } from '../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShieldAlt, faUserTie, faEnvelope, faList, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const { state: { user, admin }, dispatch } = useAppContext();
    const navigate = useNavigate();

    const signOut = () => {
        localStorage.removeItem('kosher_current_user');
        localStorage.removeItem('token');
        dispatch({ type: SET_USER, payload: { isSignedIn: false } });
        dispatch({ type: SET_ADMIN, payload: false });
        toast.success('Successfully logged out');
        navigate('/login');
    };

    const displayName = user?.name || (admin ? 'Super Administrator' : 'Client Representative');
    const displayEmail = user?.email || (admin ? 'georgewilliamochole@gmail.com' : 'client@organization.com');
    const displayImg = user?.img || userimg;

    return (
        <Col md={6} lg={5} className="mx-auto my-4">
            <div className="bg-white p-4 border text-center" style={{ borderRadius: '8px', borderColor: '#E5E0FA', boxShadow: '0 4px 20px rgba(115, 85, 247, 0.06)' }}>
                <div className="d-flex justify-content-center mb-3">
                    <UserAvatar 
                        src={displayImg} 
                        name={displayName}
                        role={admin ? 'admin' : 'client'}
                        size="2xl"
                        showStatus={true}
                        ring={true}
                        ringType="glow"
                    />
                </div>

                <div className="mb-2">
                    <span 
                        className="badge px-3 py-1.5 fw-semibold"
                        style={{
                            backgroundColor: admin ? '#FAF8FF' : '#F4F0FF',
                            color: '#7355F7',
                            border: '1px solid #E5E0FA',
                            fontSize: '0.82rem'
                        }}
                    >
                        <FontAwesomeIcon icon={admin ? faShieldAlt : faUserTie} className="me-1.5" />
                        {admin ? 'System Administrator' : 'Enterprise Client Account'}
                    </span>
                </div>

                <h4 className="fw-bold text-dark mb-1">{displayName}</h4>
                <p className="text-muted small mb-4 d-flex align-items-center justify-content-center gap-1">
                    <FontAwesomeIcon icon={faEnvelope} /> {displayEmail}
                </p>

                <div className="p-3 mb-4 text-start border" style={{ backgroundColor: '#FAF8FF', borderRadius: '4px', borderColor: '#E5E0FA' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-muted fw-semibold">Workspace Mode</span>
                        <span className="small fw-bold text-dark">{admin ? 'Admin Operations' : 'Client Booking'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted fw-semibold">Headquarters</span>
                        <span className="small fw-bold text-dark">Kampala, Uganda</span>
                    </div>
                </div>

                <div className="d-grid gap-3">
                    {admin ? (
                        <Link to="/admin/orders" className="btn text-white py-2.5" style={{ backgroundColor: '#7355F7', borderRadius: '4px', fontWeight: 600 }}>
                            <FontAwesomeIcon icon={faList} className="me-2" /> View Incoming Requests
                        </Link>
                    ) : (
                        <Link to="/client/book" className="btn text-white py-2.5" style={{ backgroundColor: '#7355F7', borderRadius: '4px', fontWeight: 600 }}>
                            <FontAwesomeIcon icon={faShoppingCart} className="me-2" /> Book New Solution
                        </Link>
                    )}
                    
                    <Button 
                        variant="outline-danger" 
                        className="py-2.5 d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: '4px', fontWeight: 600 }}
                        onClick={signOut}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                    </Button>
                </div>
            </div>
        </Col>
    );
};

export default Profile;
