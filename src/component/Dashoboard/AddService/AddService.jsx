import { faCloudUploadAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
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
        const getService = services?.find(({ _id }) => _id === edit);
        setService(getService);
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
            swal('Solution Added!', `"${data.name}" is now part of the Kosher Code solution catalog.`, 'success');
            reset();
            if (setEdit) setEdit(null);
        }, 400);
    };

    const handleImgUpload = event => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImgURL(url);
            toast.success('Illustration uploaded successfully');
        }
    };

    return (
        <div className="p-1 p-sm-2">
            <div className="cp-card p-4 p-md-5" style={{ borderRadius: '8px' }}>
                <h5 className="fw-bold mb-1.5" style={{ color: 'var(--cp-text-main)' }}>{edit ? 'Update Solution' : 'Add New Solution / Service'}</h5>
                <p className="text-muted small mb-4">Configure service metadata, categories, pricing, and capability scopes.</p>

                <Form onSubmit={handleSubmit(onSubmit)} className="addServiceForm">
                    <Row className="g-3.5">
                        <Form.Group as={Col} md={6}>
                            <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--cp-text-main)' }}>Solution / Service Name *</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={name}
                                className="cp-input"
                                style={{ padding: '0.85rem 1rem', borderRadius: '6px' }}
                                {...register("name", { required: true })}
                                placeholder="e.g. AI-Powered Fraud Detection Engine" />
                        </Form.Group>

                        <Form.Group as={Col} md={3}>
                            <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--cp-text-main)' }}>Category *</Form.Label>
                            <select 
                                className="form-select cp-input"
                                style={{ padding: '0.85rem 1rem', borderRadius: '6px' }}
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
                            <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--cp-text-main)' }}>Starting Price ($ USD)</Form.Label>
                            <Form.Control
                                type="number"
                                defaultValue={price || 299}
                                className="cp-input"
                                style={{ padding: '0.85rem 1rem', borderRadius: '6px' }}
                                {...register("price", { required: true })}
                                placeholder="Starting Price USD" />
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                            <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--cp-text-main)' }}>Description & Architectural Scope *</Form.Label>
                            <Form.Control
                                style={{ height: "7rem", padding: '0.85rem 1rem', borderRadius: '6px' }}
                                type="text"
                                defaultValue={description}
                                as="textarea"
                                className="cp-input"
                                {...register("description", { required: true })}
                                placeholder="Detail the core capability, integrations supported, security protocols, and target market..." />
                        </Form.Group>

                        <Col md={6}>
                            <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--cp-text-main)' }}>{edit ? "Update Vector Graphic" : "Upload Custom Icon / Illustration"}</Form.Label>
                            <Button
                                as={"label"}
                                htmlFor="upload"
                                className="d-flex align-items-center justify-content-center gap-2.5 p-3 w-100 uploadBtn"
                                style={{ borderRadius: '6px', backgroundColor: 'var(--cp-card-subtle)', color: 'var(--cp-primary)', border: '1px dashed var(--cp-primary)', cursor: 'pointer' }}
                            >
                                <FontAwesomeIcon icon={faCloudUploadAlt} style={{ fontSize: '1.2rem' }} />
                                <span className="fw-semibold">{imgURL ? 'Change Vector Image' : 'Select Illustration (SVG / PNG)'}</span>
                            </Button>
                            <Form.Control
                                hidden="hidden"
                                id="upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImgUpload}
                            />
                        </Col>
                    </Row>

                    <div className="mt-4 pt-3.5 border-top text-end" style={{ borderColor: 'var(--cp-border)' }}>
                        <Button 
                            type="submit" 
                            className="px-4 py-2.5 text-white d-inline-flex align-items-center gap-2"
                            style={{ backgroundColor: 'var(--cp-primary)', borderColor: 'var(--cp-primary)', borderRadius: '6px', fontWeight: 600, fontSize: '0.92rem' }}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} /> {edit ? 'Update Solution' : 'Publish Solution'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddService;
