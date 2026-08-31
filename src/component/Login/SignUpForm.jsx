import React from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import userImg from '../../Assets/user.svg';

const SignUpForm = ({ handleResponse }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = ({ name, email, password }) => {
        const loading = toast.loading('Creating your client account...');
        setTimeout(() => {
            toast.dismiss(loading);
            const userObj = {
                isSignedIn: true,
                name: name || email.split('@')[0],
                email: email,
                img: userImg,
                role: 'client'
            };
            localStorage.setItem('kosher_current_user', JSON.stringify(userObj));
            toast.success(`Welcome to Kosher Code, ${userObj.name}!`);
            handleResponse(userObj);
        }, 400);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
            <h2 className="title" style={{ color: '#070120', fontWeight: 700, marginBottom: '0.4rem' }}>Create Account</h2>
            <p className="text-muted small mb-4 text-center" style={{ maxWidth: '340px' }}>
                Join Kosher Code to book custom digital solutions and enterprise systems.
            </p>

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faUser}/></span>
                <input 
                    type="text"
                    placeholder="Full Name / Representative" 
                    {...register("name", { required: true })} 
                />
            </div>
            {errors.name && <span className="text-danger small">Name is required</span>}

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faEnvelope}/></span>
                <input 
                    type="email"
                    placeholder="Corporate Email Address" 
                    {...register("email", { required: true })} 
                />
            </div>
            {errors.email && <span className="text-danger small">Valid email is required</span>}

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faLock}/></span>
                <input 
                    type="password" 
                    placeholder="Password" 
                    {...register("password", { required: true, minLength: 6 })} 
                />
            </div>
            {errors.password && <span className="text-danger small">Password (min 6 characters) is required</span>}

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
                <FontAwesomeIcon icon={faUserPlus} /> Register Client Account
            </button>
        </form>
    );
};

export default SignUpForm;
