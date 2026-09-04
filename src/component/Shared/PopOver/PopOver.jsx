import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './PopOver.css';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { SET_USER, SET_ADMIN, useAppContext } from '../../../context';
import userImg from '../../../Assets/user.svg';
import UserAvatar from '../UserAvatar/UserAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faShieldAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { clearSessionStorage } from '../../../services/sessionService';
import { firebaseSignOut } from '../../../services/firebaseService';

const PopOver = () => {
    const { state: { user, admin }, dispatch } = useAppContext();
    const [show, setShow] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShow(false);
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [show]);

    const signOut = () => {
        clearSessionStorage();
        firebaseSignOut().catch(() => {});
        dispatch({ type: SET_USER, payload: { isSignedIn: false, email: '', name: '' } });
        dispatch({ type: SET_ADMIN, payload: false });
        setShow(false);
        toast.success('Logged out successfully');
        navigate('/client/login');
    };

    const displayName = user?.name || (admin ? 'Super Administrator' : 'Client User');
    const displayEmail = user?.email || (admin ? 'admin@koshercode.com' : 'user@organization.com');
    const displayImg = user?.img || userImg;

    return (
        <div ref={containerRef} className="position-relative d-inline-flex align-items-center">
            <UserAvatar 
                src={displayImg} 
                name={displayName}
                role={admin ? 'admin' : 'client'}
                size="sm"
                showStatus={true}
                ring={true}
                ringType="glow"
                interactive={true}
                onClick={() => setShow(prev => !prev)}
                className="popImg cursor-pointer"
            />

            {show && (
                <div 
                    className="shadow-lg p-3"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        right: 0,
                        zIndex: 9999,
                        minWidth: '240px',
                        borderRadius: '0',
                        border: '1px solid var(--cp-border, #E5E0FA)',
                        backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <div className="text-center">
                        <div className="d-flex justify-content-center mb-2">
                            <UserAvatar 
                                src={displayImg} 
                                name={displayName}
                                role={admin ? 'admin' : 'client'}
                                size="lg"
                                showStatus={true}
                                ring={true}
                                ringType="glow"
                            />
                        </div>
                        <p className="userName fw-bold mb-0 text-truncate" style={{ color: 'var(--cp-text-main, #0F172A)', fontSize: '0.95rem' }}>{displayName}</p>
                        <p className="userEmail small text-muted mb-2 text-truncate" style={{ fontSize: '0.78rem' }}>{displayEmail}</p>
                        <div className="mb-2.5">
                            <span 
                                className="badge px-2.5 py-1"
                                style={{ 
                                    backgroundColor: 'var(--cp-primary-subtle, rgba(115, 85, 247, 0.12))', 
                                    color: 'var(--cp-primary-text, #7355F7)', 
                                    border: '1px solid var(--cp-border-highlight, rgba(115, 85, 247, 0.25))',
                                    borderRadius: '0',
                                    fontSize: '0.72rem'
                                }}
                            >
                                <FontAwesomeIcon icon={admin ? faShieldAlt : faUser} className="me-1" />
                                {admin ? 'Administrator' : 'Enterprise Client'}
                            </span>
                        </div>
                        
                        <div className="d-flex flex-column gap-2.5 pt-2.5 border-top">
                            <Link 
                                to={admin ? "/admin" : "/client"} 
                                onClick={() => setShow(false)}
                                className="btn btn-sm btn-light text-start d-flex align-items-center justify-content-between fw-semibold py-1.5"
                                style={{ fontSize: '0.82rem', borderRadius: '0' }}
                            >
                                <span><FontAwesomeIcon icon={admin ? faShieldAlt : faUser} className="me-1.5" /> Workspace</span>
                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                            </Link>
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="w-100 d-flex align-items-center justify-content-center gap-1.5 py-1.5" 
                                style={{ borderRadius: '0', fontWeight: 600, fontSize: '0.82rem' }}
                                onClick={signOut}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopOver;
