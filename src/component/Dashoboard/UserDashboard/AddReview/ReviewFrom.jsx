import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, Col, Form, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { useAppContext } from '../../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { saveReview } from '../../../../services/storageService';

const ReviewForm = ({ setIsUpdated, existingReview, onCancel }) => {
    const { state: { user } } = useAppContext();
    const [rating, setRating] = useState(existingReview?.rating || 5);
    const [hoverRating, setHoverRating] = useState(0);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: existingReview?.name || user?.name || '',
            address: existingReview?.address || 'Kampala, Uganda',
            service: existingReview?.service || 'SACCO ERP & Banking Integration',
            description: existingReview?.description || ''
        }
    });

    const onSubmit = (data) => {
        const loading = toast.loading('Submitting testimonial...');
        const reviewData = {
            name: data.name || user?.name || 'Enterprise Client',
            address: data.address || 'Kampala, Uganda',
            service: data.service || 'Enterprise Solution',
            description: data.description,
            rating: rating,
            email: user?.email || 'client@koshercode.com',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        saveReview(reviewData);

        setTimeout(() => {
            localStorage.setItem('kosher_client_review_' + (user?.email || 'default'), JSON.stringify(reviewData));
            toast.dismiss(loading);
            swal("Feedback Published!", "Thank you for reviewing your engagement with Kosher Code.", "success");
            if (setIsUpdated) setIsUpdated(prev => !prev);
            if (onCancel) onCancel();
            reset();
        }, 400);
    };

    return (
        <div className="cp-card p-4 p-md-5 mx-auto" style={{ maxWidth: '680px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)', fontSize: '1.15rem' }}>
                    {existingReview ? 'Edit Your Testimonial' : 'Share Project Testimonial'}
                </h5>
                {onCancel && (
                    <Button variant="link" size="sm" onClick={onCancel} className="text-muted p-0">
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                )}
            </div>
            <p className="small mb-3.5" style={{ color: 'var(--cp-text-muted)', fontSize: '0.84rem' }}>
                Your feedback directly impacts our engineering roadmaps and highlights successful enterprise deployments.
            </p>

            {/* Interactive Star Rating Selector */}
            <div className="p-3 rounded-4 mb-3.5 d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                <div>
                    <span className="fw-semibold small d-block" style={{ color: 'var(--cp-text-main)', fontSize: '0.84rem' }}>Overall Satisfaction Rating</span>
                    <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.76rem' }}>Click to rate your experience</small>
                </div>
                <div className="d-flex align-items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="btn btn-link p-0 text-decoration-none"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FontAwesomeIcon
                                icon={faStar}
                                style={{
                                    fontSize: '1.3rem',
                                    color: (hoverRating || rating) >= star ? '#F59E0B' : 'var(--cp-border)'
                                }}
                            />
                        </button>
                    ))}
                    <span className="ms-2 fw-bold small" style={{ color: '#F59E0B', fontSize: '0.88rem' }}>{rating}.0</span>
                </div>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="g-3">
                    <Form.Group as={Col} md={6}>
                        <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Your Full Name & Corporate Title *</Form.Label>
                        <Form.Control
                            type="text"
                            className="cp-input"
                            {...register("name", { required: true })}
                            placeholder="e.g. David Mukasa (Chief Technology Officer)" 
                        />
                    </Form.Group>

                    <Form.Group as={Col} md={6}>
                        <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Organization & City *</Form.Label>
                        <Form.Control
                            type="text"
                            className="cp-input"
                            {...register("address", { required: true })}
                            placeholder="e.g. Victoria SACCO Union, Kampala" 
                        />
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                        <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Solution or System Deployed *</Form.Label>
                        <Form.Control
                            type="text"
                            className="cp-input"
                            {...register("service", { required: true })}
                            placeholder="e.g. Core Banking API & SACCO Cloud ERP Deployment" 
                        />
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                        <Form.Label className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Testimonial Content & Engineering Review *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            className="cp-input"
                            {...register("description", { required: true })}
                            placeholder="Describe the business outcomes, turnaround speed, system stability, and engineering collaboration with Kosher Code..." 
                        />
                    </Form.Group>
                </Row>

                <div className="d-flex flex-wrap align-items-center justify-content-between mt-4 pt-3 border-top gap-3" style={{ borderColor: 'var(--cp-border)' }}>
                    <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.76rem' }}>
                        🔒 Reviews are verified by Kosher Code administration.
                    </small>
                    <Button 
                        type="submit" 
                        className="fw-semibold px-4 py-2.5 text-white d-inline-flex align-items-center gap-2 rounded-pill"
                        style={{ backgroundColor: '#121417', borderColor: '#121417', fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)' }}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} /> {existingReview ? 'Update Testimonial' : 'Publish Testimonial'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ReviewForm;
