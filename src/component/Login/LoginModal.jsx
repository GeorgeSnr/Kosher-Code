import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './LoginModal.css';
import log from '../../Assets/log.svg';
import desk from '../../Assets/register.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import toast from 'react-hot-toast';
import { SET_USER, SET_ADMIN, useAppContext } from '../../context';
import { checkIsAdmin } from '../../services/storageService';

const Form = () => {
    const { dispatch } = useAppContext();
    const [isSignUp, setSignUp] = useState(false);

    const history = useNavigate();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const handleResponse = (res) => {
        if (!res || res.error) {
            toast.error(res?.error || 'Authentication failed');
            return;
        }
        const isAdmin = checkIsAdmin(res.email) || res.role === 'admin';
        dispatch({ type: SET_USER, payload: res });
        dispatch({ type: SET_ADMIN, payload: isAdmin });

        if (isAdmin) {
            toast.success('Welcome to the Administrator Command Center!');
            history('/admin');
        } else {
            toast.success('Welcome to your Client Portal!');
            history(from.pathname === '/' || from.pathname === '/login' ? '/client' : from);
        }
    };
  
    return (
        <div className={`${isSignUp ? "fContainer sign-up-mode" : "fContainer"}`}>
            <Link to="/">
                <span className="pageCloseBtn"><FontAwesomeIcon icon={faTimes} /></span>
            </Link>
            <div className="forms-container">
                <div className="signIn-singUp">
                    <SignInForm handleResponse={handleResponse} />
                    <SignUpForm handleResponse={handleResponse} />
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>New to Kosher Code?</h3>
                        <p>Create your enterprise account to book custom digital solutions and track project deployments.</p>
                        <button className="iBtn transparent" onClick={() => setSignUp(true)}>Sign Up</button>
                    </div>
                    <img src={`${log}`} alt="" className="pImg"/>
                </div>

                <div className="panel right-panel">
                    <div className="content">
                        <h3>Already Registered?</h3>
                        <p>Sign in to your client workspace or administration control center.</p>
                        <button className="iBtn transparent" onClick={() => setSignUp(false)}>Sign In</button>
                    </div>
                    <img src={`${desk}`} alt="" className="pImg"/>
                </div>
            </div>
        </div>
    );
};

export default Form;
