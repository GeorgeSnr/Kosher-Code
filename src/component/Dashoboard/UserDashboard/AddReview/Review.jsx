import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import ReviewForm from './ReviewFrom';
import './Review.css';
import userImg from '../../../../Assets/user.svg';
import UserAvatar from '../../../Shared/UserAvatar/UserAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faStar, faQuoteLeft, faCheckCircle, faBuilding, faEdit, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import { useAppContext } from '../../../../context';

const sampleTestimonials = [
    {
        name: 'David Mukasa',
        title: 'General Manager',
        org: 'Victoria SACCO Union (Kampala, Uganda)',
        service: 'SACCO Cloud ERP & Mobile Banking Integration',
        rating: 5,
        description: 'Kosher Code transformed our SACCO operations across 12 regional branches. The automated mobile money loan disbursement and member portal reduced turnaround time from 3 days to under 2 minutes.',
        date: '15 Aug 2026'
    },
    {
        name: 'Amina Hassan',
        title: 'Head of Digital Banking',
        org: 'Equator Financial Group (Nairobi, Kenya)',
        service: 'Core Banking API & Cross-Border Gateway',
        rating: 5,
        description: 'Their core banking integration and cross-border payment gateway gave us the speed, security, and multi-currency capabilities required to scale smoothly across 5 African nations.',
        date: '02 Aug 2026'
    },
    {
        name: 'Christian Gallagher',
        title: 'Chief Operating Officer',
        org: 'Trans-Atlantic Enterprise Logistics (London & JHB)',
        service: 'Multi-Continental Cloud Architecture',
        rating: 5,
        description: 'Kosher Code engineered a custom multi-continental ERP that synchronized our African supply chains with our European distribution hubs in real-time. Exceptional software engineering.',
        date: '28 Jul 2026'
    }
];

const Review = () => {
    const { state: { user } } = useAppContext();
    const [review, setReview] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('kosher_client_review_' + (user?.email || 'default'));
            if (stored) {
                setReview(JSON.parse(stored));
            } else {
                setReview(null);
            }
        } catch (e) {
            setReview(null);
        }
    }, [user?.email, isUpdated]);

    const handleDelete = () => {
        swal({
            title: "Delete Review?",
            text: "Are you sure you want to remove your feedback?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                localStorage.removeItem('kosher_client_review_' + (user?.email || 'default'));
                setReview(null);
                setIsEditing(false);
                setIsUpdated(!isUpdated);
                toast.success('Your review has been removed.');
            }
        });
    };

    return (
        <div className="p-1 p-sm-2">
            {/* Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-4 border-bottom gap-2" style={{ borderColor: 'var(--cp-border)' }}>
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>Client Testimonials & Executive Feedback</h4>
                    <p className="mb-0 small" style={{ color: 'var(--cp-text-muted)' }}>Share your engineering milestone review to be featured on Kosher Code platforms.</p>
                </div>
                <span className="badge rounded-pill px-3.5 py-2 mt-2 mt-sm-0 d-inline-flex align-items-center gap-1.5" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', border: '1px solid var(--cp-border)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <FontAwesomeIcon icon={faCheckCircle} /> Verified Partner Feedback
                </span>
            </div>

            {/* Active Review View or Form */}
            {review?.description && !isEditing ? (
                <div className="cp-card p-4 p-md-5 mx-auto mb-5" style={{ maxWidth: '680px' }}>
                    <div className="d-flex align-items-center justify-content-between mb-3 pb-2.5 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                        <span className="badge rounded-pill px-3 py-1.5" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '0.78rem', fontWeight: 600 }}>
                            <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Published Testimonial
                        </span>
                        <div className="d-flex align-items-center gap-2">
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="rounded-pill d-flex align-items-center gap-1.5 px-3.5 py-1.5 fw-semibold"
                                style={{ fontSize: '0.8rem' }}
                            >
                                <FontAwesomeIcon icon={faEdit} /> Edit Review
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={handleDelete}
                                className="rounded-pill d-flex align-items-center gap-1.5 px-3.5 py-1.5 fw-semibold"
                                style={{ fontSize: '0.8rem' }}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} /> Remove
                            </Button>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <div className="text-warning mb-2.5">
                            {[...Array(review.rating || 5)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} className="mx-0.5" />
                            ))}
                        </div>
                        <div className="d-flex justify-content-center mb-2.5">
                            <UserAvatar 
                                src={user?.img || userImg} 
                                name={review.name || user?.name}
                                size="xl"
                                showStatus={true}
                                ring={true}
                                ringType="glow"
                            />
                        </div>
                        <h5 className="fw-bold mb-0.5" style={{ color: 'var(--cp-text-main)' }}>{review.name}</h5>
                        <div className="small d-flex align-items-center justify-content-center gap-2" style={{ color: 'var(--cp-text-muted)' }}>
                            <span><FontAwesomeIcon icon={faBuilding} className="me-1" /> {review.address || 'Kampala, Uganda'}</span>
                            {review.service && (
                                <span>• <FontAwesomeIcon icon={faLayerGroup} className="me-1" /> {review.service}</span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded-4 mb-3.5 position-relative" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                        <FontAwesomeIcon icon={faQuoteLeft} style={{ color: 'var(--cp-primary)', opacity: 0.35, fontSize: '1.6rem' }} className="mb-2" />
                        <p className="fst-italic small mb-0" style={{ color: 'var(--cp-text-main)', lineHeight: 1.65, fontSize: '0.92rem' }}>
                            "{review.description}"
                        </p>
                    </div>

                    <div className="text-end">
                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>Submitted: {review.date || 'Recently'}</small>
                    </div>
                </div>
            ) : (
                <div className="mb-5">
                    <ReviewForm 
                        setIsUpdated={setIsUpdated} 
                        existingReview={isEditing ? review : null}
                        onCancel={isEditing ? () => setIsEditing(false) : null}
                    />
                </div>
            )}

            {/* Featured Testimonials Showcase */}
            <div className="mt-4 pt-2">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', fontSize: '1.12rem' }}>Featured Enterprise Testimonials</h5>
                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem' }}>Recent verified client testimonials across Africa and global hubs.</small>
                    </div>
                </div>

                <Row className="g-3">
                    {sampleTestimonials.map((t, idx) => (
                        <Col md={4} key={idx}>
                            <div className="p-4 cp-card h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2.5">
                                        <div className="text-warning small">
                                            {[...Array(t.rating)].map((_, rIdx) => (
                                                <FontAwesomeIcon key={rIdx} icon={faStar} className="me-0.5" style={{ fontSize: '0.75rem' }} />
                                            ))}
                                        </div>
                                        <span className="badge rounded-pill px-2.5 py-1" style={{ backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary-text)', fontSize: '0.68rem', fontWeight: 600 }}>
                                            Verified SLA
                                        </span>
                                    </div>

                                    <p className="small mb-3 fst-italic" style={{ color: 'var(--cp-text-main)', lineHeight: 1.55, fontSize: '0.82rem' }}>
                                        "{t.description}"
                                    </p>
                                </div>

                                <div className="pt-2.5 border-top d-flex align-items-center gap-2.5" style={{ borderColor: 'var(--cp-border)' }}>
                                    <UserAvatar 
                                        name={t.name}
                                        size="xs"
                                        ring={false}
                                    />
                                    <div className="overflow-hidden">
                                        <div className="fw-bold text-truncate" style={{ color: 'var(--cp-text-main)', fontSize: '0.86rem' }}>{t.name}</div>
                                        <small className="d-block text-truncate" style={{ color: 'var(--cp-primary)', fontSize: '0.72rem', fontWeight: 600 }}>{t.title}</small>
                                        <small className="d-block text-truncate" style={{ color: 'var(--cp-text-muted)', fontSize: '0.72rem' }}>{t.org}</small>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default Review;
