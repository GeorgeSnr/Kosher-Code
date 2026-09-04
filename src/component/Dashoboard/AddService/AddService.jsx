import { faCloudUploadAlt, faPlusCircle, faCheckCircle, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import './AddService.css';
import { saveService } from '../../../services/storageService';

const AddService = ({ edit, setEdit, services }) => {
    const { register, handleSubmit, reset } = useForm();
    const [imgURL, setImgURL] = useState(null);
    const [service, setService] = useState({});
    const [category, setCategory] = useState('Enterprise & Financial');
    const { name, price, description, img } = service || {};

    useEffect(() => {
        const getService = services?.find(({ _id, id }) => (_id === edit || id === edit));
        setService(getService);
        if (getService?.category) setCategory(getService.category);
    }, [edit, services]);

    const onSubmit = data => {
        const loading = toast.loading('Saving solution...');
        const serviceInfo = {
            ...data,
            category: category,
            price: Number(data.price) || 99,
            img: imgURL || img || 'https://assets.maccarianagency.com/svg/illustrations/developer.svg'
        };

        setTimeout(() => {
            saveService(serviceInfo);
            toast.dismiss(loading);
            swal('Solution Saved!', `"${data.name}" is now updated in the Kosher Code solution catalog.`, 'success');
            reset();
            if (setEdit) setEdit(null);
        }, 400);
    };

    const handleImgUpload = event => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImgURL(url);
            toast.success('Illustration loaded successfully');
        }
    };

    const currentImg = imgURL || img;

    return (
        <div className="p-1 p-sm-2">
            <div className="add-service-card p-4 p-md-5">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1.5">
                            <span 
                                className="badge px-3 py-1"
                                style={{ 
                                    backgroundColor: 'var(--cp-primary-subtle)', 
                                    color: 'var(--cp-primary-text)',
                                    borderRadius: '0',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {edit ? 'Editing Solution' : 'Service Architect Studio'}
                            </span>
                        </div>
                        <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.02em' }}>
                            {edit ? 'Update Solution Architecture' : 'Publish New Solution / Service'}
                        </h4>
                        <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>
                            Configure capability scopes, pricing tiers, and client deliverables for the digital marketplace.
                        </p>
                    </div>

                    {edit && setEdit && (
                        <button 
                            type="button"
                            className="btn btn-outline-secondary px-4 py-2 d-inline-flex align-items-center gap-2"
                            style={{ fontSize: '0.84rem', fontWeight: 600, borderRadius: '0' }}
                            onClick={() => setEdit(null)}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Catalog
                        </button>
                    )}
                </div>

                <Form onSubmit={handleSubmit(onSubmit)} className="addServiceForm">
                    <Row className="g-4">
                        <Form.Group as={Col} md={6}>
                            <Form.Label className="form-label">Solution / Service Name *</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={name}
                                className="cp-input"
                                {...register("name", { required: true })}
                                placeholder="e.g. AI-Powered Fraud Detection Engine" 
                            />
                        </Form.Group>

                        <Form.Group as={Col} md={3}>
                            <Form.Label className="form-label">Domain Category *</Form.Label>
                            <select 
                                className="form-select cp-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Enterprise & Financial">Enterprise & Financial</option>
                                <option value="SACCO & Microfinance">SACCO & Microfinance</option>
                                <option value="MSME & SME Solutions">MSME & SME Solutions</option>
                                <option value="Digital Foundation">Digital Foundation</option>
                                <option value="Cloud & Multi-Continental">Cloud & Multi-Continental</option>
                            </select>
                        </Form.Group>

                        <Form.Group as={Col} md={3}>
                            <Form.Label className="form-label">Starting Price ($ USD) *</Form.Label>
                            <Form.Control
                                type="number"
                                defaultValue={price || 299}
                                className="cp-input"
                                {...register("price", { required: true })}
                                placeholder="Starting Price USD" 
                            />
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                            <Form.Label className="form-label">Description & Architectural Scope *</Form.Label>
                            <Form.Control
                                style={{ minHeight: "8rem", resize: "vertical" }}
                                defaultValue={description}
                                as="textarea"
                                className="cp-input"
                                {...register("description", { required: true })}
                                placeholder="Detail the core capability, integrations supported, security protocols, API endpoints, and target market..." 
                            />
                        </Form.Group>

                        <Col md={12}>
                            <Form.Label className="form-label">
                                {edit ? "Update Vector Graphic / Illustration" : "Custom Vector Graphic / Illustration"}
                            </Form.Label>

                            {currentImg ? (
                                <div className="upload-preview-box flex-wrap justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <img 
                                            src={currentImg} 
                                            alt="Service Illustration Preview" 
                                            className="upload-preview-img"
                                        />
                                        <div>
                                            <div className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>Current Illustration Attached</div>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Vector graphic rendered across client catalog cards</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <label 
                                            htmlFor="upload-input" 
                                            className="btn btn-sm btn-outline-primary px-3 py-1.5 mb-0"
                                            style={{ fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', borderRadius: '0' }}
                                        >
                                            Change Graphic
                                        </label>
                                        {imgURL && (
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-danger px-2.5 py-1"
                                                style={{ borderRadius: '0' }}
                                                onClick={() => setImgURL(null)}
                                                title="Reset uploaded graphic"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <label htmlFor="upload-input" className="upload-dropzone w-100 mb-0">
                                    <div className="upload-icon-circle">
                                        <FontAwesomeIcon icon={faCloudUploadAlt} />
                                    </div>
                                    <div className="fw-bold small" style={{ color: 'var(--cp-text-main)' }}>
                                        Click to browse vector illustration
                                    </div>
                                    <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                                        Supports SVG, PNG, or WEBP (transparent background recommended)
                                    </small>
                                </label>
                            )}

                            <Form.Control
                                id="upload-input"
                                hidden="hidden"
                                type="file"
                                accept="image/*"
                                onChange={handleImgUpload}
                            />
                        </Col>
                    </Row>

                    <div className="mt-4 pt-3.5 border-top d-flex flex-wrap justify-content-end align-items-center gap-3" style={{ borderColor: 'var(--cp-border)' }}>
                        {edit && setEdit && (
                            <button 
                                type="button"
                                className="btn btn-outline-secondary px-4 py-2.5"
                                style={{ fontWeight: 600, fontSize: '0.88rem', borderRadius: '0' }}
                                onClick={() => setEdit(null)}
                            >
                                Discard Changes
                            </button>
                        )}
                        <Button 
                            type="submit" 
                            className="px-5 py-2.5 text-white d-inline-flex align-items-center gap-2 border-0"
                            style={{ 
                                backgroundColor: '#121417', 
                                fontWeight: 600, 
                                fontSize: '0.88rem',
                                letterSpacing: '0.01em',
                                borderRadius: '0'
                            }}
                        >
                            <FontAwesomeIcon icon={edit ? faCheckCircle : faPlusCircle} /> 
                            {edit ? 'Save Changes' : 'Publish Solution'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddService;
