import React from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import userImg from '../../Assets/user.svg';
import { saveUserToFirestore } from '../../services/storageService';

const SignUpForm = ({ handleResponse }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = async ({ name, email, password }) => {
        const loading = toast.loading('Creating your client account...');
        const normalizedEmail = email.toLowerCase().trim();
        setTimeout(async () => {
            toast.dismiss(loading);
            const userObj = {
                isSignedIn: true,
                name: name || normalizedEmail.split('@')[0],
                email: normalizedEmail,
                img: userImg,
                role: 'client'
            };
            localStorage.setItem('kosher_current_user', JSON.stringify(userObj));
            try {
                await saveUserToFirestore(userObj);
            } catch (e) {}
            toast.success(`Welcome to Kosher Code, ${userObj.name}!`);
            handleResponse(userObj);
        }, 400);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
            <h2 className="title loginTitle">Create Account</h2>
            <p className="loginSubtitle text-center">
                Join Kosher Code to book custom digital solutions and enterprise systems.
            </p>

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faUser}/></span>
                <input 
                    type="text"
                    placeholder="Full Name / Representative" 
                    autoComplete="name"
                    {...register("name", { required: true })} 
                />
            </div>
            {errors.name && <span className="text-danger small">Name is required</span>}

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faEnvelope}/></span>
                <input 
                    type="email"
                    placeholder="Corporate Email Address" 
                    autoComplete="email"
                    {...register("email", { required: true })} 
                />
            </div>
            {errors.email && <span className="text-danger small">Valid email is required</span>}

            <div className="input-field">
                <span className="fIcon"><FontAwesomeIcon icon={faLock}/></span>
                <input 
                    type="password" 
                    placeholder="Password" 
                    autoComplete="new-password"
                    {...register("password", { required: true, minLength: 6 })} 
                />
            </div>
            {errors.password && <span className="text-danger small">Password (min 6 characters) is required</span>}

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
                <FontAwesomeIcon icon={faUserPlus} /> Register Client Account
            </button>
        </form>
    );
};

export default SignUpForm;

