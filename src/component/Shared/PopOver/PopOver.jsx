import React, { useState, useRef } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import './PopOver.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { SET_USER, SET_ADMIN, useAppContext } from '../../../context';
import userImg from '../../../Assets/user.svg';
import UserAvatar from '../UserAvatar/UserAvatar';

const PopOver = () => {
    const { state: { user, admin }, dispatch } = useAppContext();
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

    const signOut = () => {
        sessionStorage.removeItem('kosher_client_session');
        localStorage.removeItem('kosher_current_user');
        localStorage.removeItem('token');
        dispatch({ type: SET_USER, payload: { isSignedIn: false, email: '', name: '' } });
        dispatch({ type: SET_ADMIN, payload: false });
        setShow(false);
        toast.success('Logged out successfully');
        navigate('/client/login');
    };

    const displayName = user?.name || (admin ? 'Administrator' : 'Client');
    const displayEmail = user?.email || (admin ? 'admin@koshercode.com' : 'client@koshercode.com');
    const displayImg = user?.img || userImg;

    return (
        <div ref={ref} className="d-inline-flex align-items-center">
            <UserAvatar 
                src={displayImg} 
                name={displayName}
                role={admin ? 'admin' : 'client'}
                size="sm"
                showStatus={true}
                ring={true}
                ringType="glow"
                interactive={true}
                onClick={handleClick}
                className="popImg"
            />
            <Overlay
                show={show}
                target={target}
                placement="bottom-end"
                container={ref.current}
                rootClose={true}
                onHide={() => setShow(false)}
            >
                <Popover id="popover-contained" style={{ borderRadius: '8px', border: '1px solid var(--cp-border, #E5E0FA)', backgroundColor: 'var(--cp-card-bg, #FFFFFF)', boxShadow: 'var(--cp-shadow-md, 0 8px 24px rgba(0,0,0,0.1))', minWidth: '220px' }}>
                    <Popover.Body className="text-center p-3">
                        <UserAvatar 
                            src={displayImg} 
                            name={displayName}
                            role={admin ? 'admin' : 'client'}
                            size="lg"
                            showStatus={true}
                            ring={true}
                            ringType="glow"
                            className="popUserImg mb-2.5"
                        />
                        <p className="userName fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{displayName}</p>
                        <p className="userEmail small text-muted mb-2">{displayEmail}</p>
                        <span 
                            className="badge mb-3 d-inline-block"
                            style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', border: '1px solid var(--cp-border-highlight)' }}
                        >
                            {admin ? '🛡️ Admin Portal' : '👤 Client Portal'}
                        </span>
                        <div>
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="w-100" 
                                style={{ borderRadius: '4px', fontWeight: 600 }}
                                onClick={signOut}
                            >
                                Sign Out
                            </Button>
                        </div>
                    </Popover.Body>
                </Popover> 
            </Overlay> 
        </div>
    );
};

export default PopOver;
