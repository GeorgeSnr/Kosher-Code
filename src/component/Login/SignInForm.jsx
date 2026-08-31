import React from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { checkIsAdmin } from '../../services/storageService';

const SignInForm = ({ handleResponse }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = ({ email, password }) => {
        const loading = toast.loading('Authenticating credentials...');
        const isAdmin = checkIsAdmin(email);
        
        setTimeout(() => {
            toast.dismiss(loading);
            const userObj = {
                isSignedIn: true,
                name: email.split('@')[0].toUpperCase(),
                email: email,
                img: isAdmin 
                    ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
                    : 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
                role: isAdmin ? 'admin' : 'client'
            };
            localStorage.setItem('kosher_current_user', JSON.stringify(userObj));
            handleResponse(userObj);
        }, 350);
    };

    const handleFillSample = (sampleEmail, samplePass) => {
        setValue('email', sampleEmail);
        setValue('password', samplePass);
        toast('Sample credentials populated', { icon: '🔑' });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
            <h2 className="title" style={{ color: '#070120', fontWeight: 700, marginBottom: '0.4rem' }}>Portal Sign In</h2>
            <p className="text-muted small mb-4 text-center" style={{ maxWidth: '340px' }}>
                Enter your authorized credentials to access your Kosher Code workspace.
            </p>

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faEnvelope}/></span>
                <input 
                    type="email" 
                    placeholder="Corporate / Personal Email" 
                    {...register("email", { required: true })} 
                />
            </div>
            {errors.email && <span className="text-danger small">Email address is required</span>}

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faLock}/></span>
                <input 
                    type="password" 
                    placeholder="Password" 
                    {...register("password", { required: true })} 
                />
            </div>
            {errors.password && <span className="text-danger small">Password is required</span>}

            <button 
                type="submit" 
                className="iBtn d-flex align-items-center justify-content-center gap-2 text-white" 
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

            {/* Sample Credentials Card */}
            <div className="w-100 mt-4 pt-3 border-top" style={{ maxWidth: '360px' }}>
                <div className="p-2.5 rounded border" style={{ backgroundColor: '#FAF8FF', borderColor: '#E5E0FA', fontSize: '0.78rem' }}>
                    <div className="d-flex align-items-center gap-1.5 fw-bold text-dark mb-1.5">
                        <FontAwesomeIcon icon={faKey} style={{ color: '#7355F7' }} /> Sample Access Credentials:
                    </div>
                    <div className="d-flex flex-column gap-1">
                        <div 
                            onClick={() => handleFillSample('client@koshercode.com', 'password123')}
                            className="d-flex justify-content-between align-items-center p-1.5 rounded cursor-pointer"
                            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E0FA', cursor: 'pointer' }}
                            title="Click to auto-fill"
                        >
                            <span className="text-muted">Client: <strong>client@koshercode.com</strong></span>
                            <span className="badge text-primary" style={{ backgroundColor: '#F4F0FF', fontSize: '0.7rem' }}>Use</span>
                        </div>
                        <div 
                            onClick={() => handleFillSample('admin@koshercode.com', 'admin123')}
                            className="d-flex justify-content-between align-items-center p-1.5 rounded cursor-pointer"
                            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E0FA', cursor: 'pointer' }}
                            title="Click to auto-fill"
                        >
                            <span className="text-muted">Admin: <strong>admin@koshercode.com</strong></span>
                            <span className="badge text-dark" style={{ backgroundColor: '#F3F4F6', fontSize: '0.7rem' }}>Use</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SignInForm;
