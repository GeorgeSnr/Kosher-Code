import React from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { checkIsAdmin, authenticateUserAccount } from '../../services/storageService';

const SignInForm = ({ handleResponse }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async ({ email, password }) => {
        const loading = toast.loading('Authenticating credentials...');
        const normalizedEmail = email.toLowerCase().trim();
        
        setTimeout(async () => {
            toast.dismiss(loading);
            const userObj = authenticateUserAccount(normalizedEmail, password);
            handleResponse(userObj);
        }, 350);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
            <h2 className="title loginTitle">Portal Sign In</h2>
            <p className="loginSubtitle text-center">
                Enter your authorized credentials to access your Kosher Code workspace.
            </p>

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faEnvelope}/></span>
                <input 
                    type="email" 
                    placeholder="Corporate / Personal Email" 
                    autoComplete="email"
                    {...register("email", { required: true })} 
                />
            </div>
            {errors.email && <span className="text-danger small">Email address is required</span>}

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faLock}/></span>
                <input 
                    type="password" 
                    placeholder="Password" 
                    autoComplete="current-password"
                    {...register("password", { required: true, minLength: 4 })} 
                />
            </div>
            {errors.password && <span className="text-danger small">Valid password is required</span>}

            <button 
                type="submit" 
                className="iBtn d-flex align-items-center justify-content-center gap-2 text-white mt-3" 
                style={{ 
                    backgroundColor: '#7355F7', 
                    borderRadius: '4px', 
                    height: '46px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(115, 85, 247, 0.3)'
                }}
            >
                <FontAwesomeIcon icon={faSignInAlt} /> Sign In
            </button>
        </form>
    );
};

export default SignInForm;

