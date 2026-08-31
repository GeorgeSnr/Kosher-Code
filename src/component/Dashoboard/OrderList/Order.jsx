import React, { useState } from 'react';
import { Dropdown, Modal, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuilding, 
    faMapMarkerAlt, 
    faPhone, 
    faEnvelope, 
    faTrashAlt, 
    faEye, 
    faDollarSign, 
    faShieldAlt,
    faCheckDouble,
    faSpinner,
    faClock,
    faFileAlt,
    faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import UserAvatar from '../../Shared/UserAvatar/UserAvatar';
import './Order.css';

const Order = ({ order, handleAction, handleDelete }) => {
    const [showDetails, setShowDetails] = useState(false);

    const { 
        _id, 
        name, 
        email, 
        phone, 
        institution, 
        region, 
        serviceName, 
        price, 
        pricingType, 
        status, 
        date,
        description,
        img
    } = order;

    const getStatusBadge = (st) => {
        switch (st) {
            case 'In Progress':
                return { 
                    bg: 'var(--status-progress-bg)', 
                    text: 'var(--status-progress-text)', 
                    border: 'var(--status-progress-border)', 
                    icon: faSpinner 
                };
            case 'In Review':
                return { 
                    bg: 'var(--cp-primary-subtle)', 
                    text: 'var(--cp-primary-text)', 
                    border: 'var(--cp-border-highlight)', 
                    icon: faShieldAlt 
                };
            case 'Done':
            case 'Completed':
                return { 
                    bg: 'var(--status-done-bg)', 
                    text: 'var(--status-done-text)', 
                    border: 'var(--status-done-border)', 
                    icon: faCheckDouble 
                };
            default: // Pending
                return { 
                    bg: 'var(--status-pending-bg)', 
                    text: 'var(--status-pending-text)', 
                    border: 'var(--status-pending-border)', 
                    icon: faClock 
                };
        }
    };

    const currentStyle = getStatusBadge(status);

    return (
        <>
            <tr>
                {/* Client Info */}
                <td className="align-middle">
                    <div className="d-flex align-items-center gap-2">
                        <UserAvatar 
                            name={name}
                            size="xs"
                            ring={false}
                        />
                        <div className="overflow-hidden">
                            <div 
                                className="fw-bold text-truncate" 
                                style={{ color: 'var(--cp-text-main)', cursor: 'pointer', maxWidth: '200px' }}
                                onClick={() => setShowDetails(true)}
                                title="Click to view full request details"
                            >
                                {name}
                            </div>
                            {institution && (
                                <div className="small d-flex align-items-center gap-1 mt-0.5" style={{ color: 'var(--cp-text-muted)' }}>
                                    <FontAwesomeIcon icon={faBuilding} style={{ color: 'var(--cp-primary)', fontSize: '11px' }} />
                                    <span className="text-truncate" style={{ maxWidth: '180px' }}>{institution}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </td>

                {/* Contact Details */}
                <td className="align-middle">
                    <div className="small d-flex align-items-center gap-1.5" style={{ color: 'var(--cp-text-main)' }}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ color: 'var(--cp-text-muted)', fontSize: '11px' }} />
                        <a href={`mailto:${email}`} className="text-decoration-none text-truncate" style={{ color: 'inherit', maxWidth: '190px' }}>{email}</a>
                    </div>
                    {phone && (
                        <div className="small d-flex align-items-center gap-1.5 mt-0.5" style={{ color: 'var(--cp-text-muted)' }}>
                            <FontAwesomeIcon icon={faPhone} style={{ color: 'var(--status-done-text)', fontSize: '10px' }} />
                            <a href={`tel:${phone}`} className="text-decoration-none" style={{ color: 'inherit' }}>{phone}</a>
                        </div>
                    )}
                </td>

                {/* Service & Region */}
                <td className="align-middle">
                    <div className="fw-semibold text-truncate" style={{ color: 'var(--cp-primary)', maxWidth: '220px' }}>{serviceName}</div>
                    <div className="small d-flex align-items-center gap-1 mt-0.5" style={{ color: 'var(--cp-text-muted)' }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: '11px', color: 'var(--cp-text-muted)' }} />
                        <span>{region || 'Uganda & Global'}</span>
                    </div>
                </td>

                {/* Budget / Pricing */}
                <td className="align-middle">
                    <div className="fw-bold" style={{ color: 'var(--cp-text-main)' }}>{price ? `$${price}` : 'Quotation'}</div>
                    <div className="small" style={{ fontSize: '11px', color: 'var(--cp-text-muted)' }}>{pricingType || date || 'Direct'}</div>
                </td>

                {/* Status Dropdown */}
                <td className="align-middle">
                    <Dropdown id={`dropdown-${_id}`}>
                        <Dropdown.Toggle 
                            size="sm"
                            className="border shadow-none"
                            style={{
                                backgroundColor: currentStyle.bg,
                                color: currentStyle.text,
                                borderColor: currentStyle.border,
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                padding: '4px 10px'
                            }}
                        >
                            ● {status}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ borderRadius: '6px', backgroundColor: 'var(--cp-card-bg)', border: '1px solid var(--cp-border)', boxShadow: 'var(--cp-shadow-md)' }}>
                            <Dropdown.Item onClick={() => handleAction(_id, "Pending")}>
                                <span style={{ color: 'var(--status-pending-text)', fontWeight: 700 }}>● Pending</span> <span className="small text-muted">(New)</span>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction(_id, "In Review")}>
                                <span style={{ color: 'var(--cp-primary)', fontWeight: 700 }}>● In Review</span> <span className="small text-muted">(Assessing)</span>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction(_id, "In Progress")}>
                                <span style={{ color: 'var(--status-progress-text)', fontWeight: 700 }}>● In Progress</span> <span className="small text-muted">(Active)</span>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction(_id, "Done")}>
                                <span style={{ color: 'var(--status-done-text)', fontWeight: 700 }}>● Done</span> <span className="small text-muted">(Completed)</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>

                {/* Actions */}
                <td className="align-middle text-end">
                    <div className="d-inline-flex gap-1.5">
                        <button
                            className="btn btn-sm p-1.5"
                            style={{ 
                                borderRadius: '4px',
                                backgroundColor: 'var(--cp-card-subtle)',
                                border: '1px solid var(--cp-border)',
                                color: 'var(--cp-primary)'
                            }}
                            title="Inspect Request Details"
                            onClick={() => setShowDetails(true)}
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                            className="btn btn-outline-danger btn-sm p-1.5"
                            style={{ borderRadius: '4px' }}
                            title="Delete / Archive Request"
                            onClick={() => handleDelete(_id)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* INBOUND REQUEST DETAILS MODAL (100% Theme Synchronized) */}
            <Modal 
                show={showDetails} 
                onHide={() => setShowDetails(false)} 
                centered 
                size="lg"
                className="order-details-modal"
            >
                <Modal.Header closeButton style={{ backgroundColor: 'var(--cp-card-subtle)', borderBottom: '1px solid var(--cp-border)' }}>
                    <div className="d-flex align-items-center gap-2.5">
                        <div 
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--cp-primary-subtle)',
                                color: 'var(--cp-primary)'
                            }}
                        >
                            <FontAwesomeIcon icon={faFileAlt} />
                        </div>
                        <div>
                            <Modal.Title className="fs-5 fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>
                                Inbound Request Details
                            </Modal.Title>
                            <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem' }}>ID: {_id} &bull; Received on {date || 'Recent'}</small>
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body className="p-4" style={{ backgroundColor: 'var(--cp-card-bg)', color: 'var(--cp-text-main)' }}>
                    {/* Header Client Snapshot */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between p-3.5 mb-4 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                        <div className="d-flex align-items-center gap-3">
                            <UserAvatar 
                                name={name}
                                size="md"
                                ring={true}
                                ringType="glow"
                            />
                            <div>
                                <span className="small d-block fw-bold text-uppercase" style={{ color: 'var(--cp-text-muted)', fontSize: '0.72rem', letterSpacing: '0.04em' }}>REPRESENTATIVE & INSTITUTION</span>
                                <h4 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{name}</h4>
                                <span className="fw-semibold" style={{ color: 'var(--cp-primary)', fontSize: '0.9rem' }}>{institution || 'Independent Enterprise'}</span>
                            </div>
                        </div>
                        <div className="mt-2 mt-sm-0">
                            <span 
                                className="badge px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                                style={{
                                    backgroundColor: currentStyle.bg,
                                    color: currentStyle.text,
                                    border: `1px solid ${currentStyle.border}`,
                                    fontSize: '0.85rem'
                                }}
                            >
                                <FontAwesomeIcon icon={currentStyle.icon} />
                                Status: {status}
                            </span>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <Row className="g-3 mb-4">
                        <Col md={6}>
                            <div className="p-3.5 h-100 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>
                                    <FontAwesomeIcon icon={faEnvelope} className="me-1.5" style={{ color: 'var(--cp-primary)' }} /> Contact Channels
                                </h6>
                                <div className="mb-2.5">
                                    <small className="d-block fw-semibold" style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>Corporate Email</small>
                                    <a href={`mailto:${email}`} className="fw-semibold text-decoration-none d-inline-flex align-items-center gap-1" style={{ color: 'var(--cp-primary)' }}>
                                        {email} <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '10px' }} />
                                    </a>
                                </div>
                                {phone && (
                                    <div className="mb-2.5">
                                        <small className="d-block fw-semibold" style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>Phone / Direct Line</small>
                                        <a href={`tel:${phone}`} className="fw-semibold text-decoration-none" style={{ color: 'var(--status-done-text)', fontSize: '0.92rem' }}>
                                            {phone}
                                        </a>
                                    </div>
                                )}
                                <div>
                                    <small className="d-block fw-semibold" style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>Deployment Location / Region</small>
                                    <span className="fw-semibold" style={{ color: 'var(--cp-text-main)' }}>{region || 'Uganda (Nationwide & Global)'}</span>
                                </div>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="p-3.5 h-100 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                                <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>
                                    <FontAwesomeIcon icon={faDollarSign} className="me-1.5" style={{ color: 'var(--status-done-text)' }} /> Scope & Commercial Tier
                                </h6>
                                <div className="mb-2.5 d-flex align-items-center gap-2">
                                    {img && <img src={img} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />}
                                    <div>
                                        <small className="d-block fw-semibold" style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>Target Solution</small>
                                        <span className="fw-bold" style={{ color: 'var(--cp-text-main)' }}>{serviceName}</span>
                                    </div>
                                </div>
                                <div className="mb-2.5">
                                    <small className="d-block fw-semibold" style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>Pricing Tier / Plan</small>
                                    <span className="fw-semibold" style={{ color: 'var(--cp-primary)' }}>{pricingType || 'Enterprise Tier'}</span>
                                </div>
                                <div>
                                    <small className="d-block fw-semibold" style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>Projected Budget / Price</small>
                                    <span className="fw-bold fs-5" style={{ color: 'var(--status-done-text)' }}>${price || '99'} <span className="small fw-normal" style={{ color: 'var(--cp-text-muted)' }}>USD</span></span>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Client RFP / Scope Description */}
                    <div className="p-3.5 mb-4 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                        <h6 className="fw-bold mb-2 small text-uppercase" style={{ color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>
                            Client Requirements & Scope Description
                        </h6>
                        <p className="mb-0" style={{ color: 'var(--cp-text-main)', lineHeight: 1.65, fontSize: '0.92rem' }}>
                            {description || 'Full solution deployment requested with custom institutional workflows, security compliance protocols, and technical staff onboarding support.'}
                        </p>
                    </div>

                    {/* Live Status Management Strip */}
                    <div className="p-3.5 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                        <small className="fw-bold text-uppercase d-block mb-2.5" style={{ color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>
                            Update Live Project Status:
                        </small>
                        <div className="d-flex flex-wrap gap-2">
                            {['Pending', 'In Review', 'In Progress', 'Done'].map(st => {
                                const isCurrent = status === st;
                                return (
                                    <Button
                                        key={st}
                                        size="sm"
                                        variant={isCurrent ? "primary" : "outline-secondary"}
                                        className="px-3 py-1.5 fw-semibold"
                                        style={{
                                            borderRadius: '4px',
                                            backgroundColor: isCurrent ? 'var(--cp-primary)' : 'transparent',
                                            borderColor: isCurrent ? 'var(--cp-primary)' : 'var(--cp-border)',
                                            color: isCurrent ? '#FFFFFF' : 'var(--cp-text-main)'
                                        }}
                                        onClick={() => {
                                            handleAction(_id, st);
                                        }}
                                    >
                                        ● {st}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer style={{ backgroundColor: 'var(--cp-card-subtle)', borderTop: '1px solid var(--cp-border)' }}>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            className="d-flex align-items-center gap-1.5"
                            style={{ borderRadius: '4px' }}
                            onClick={() => {
                                setShowDetails(false);
                                handleDelete(_id);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} /> Archive Request
                        </Button>

                        <Button 
                            variant="secondary" 
                            size="sm"
                            style={{ borderRadius: '4px', backgroundColor: 'var(--cp-card-hover)', color: 'var(--cp-text-main)', border: '1px solid var(--cp-border)' }}
                            onClick={() => setShowDetails(false)}
                        >
                            Close Details
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Order;
