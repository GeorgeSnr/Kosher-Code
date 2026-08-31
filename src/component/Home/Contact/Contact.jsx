import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import './Contact.css';
import contactImg from '../../../Assets/contact.svg';
import swal from 'sweetalert';
import Fade from 'react-reveal/Fade';
import { saveContactMessage } from '../../../services/storageService';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        institution: '',
        region: '',
        subject: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = event => {
        event.preventDefault();
        saveContactMessage(formData);
        event.target.reset();
        setFormData({
            name: '',
            email: '',
            institution: '',
            region: '',
            subject: '',
            description: ''
        });
        swal("Consultation Request Received!", "Thank you for reaching out. Our engineering leadership team in Kampala will review your request and respond within 24 hours.", "success");
    };
    return (
        <section id="contact">
            <Col md={11} className="mx-auto">
                <Row className="align-items-center">
                    <Col md={6}>
                        <Fade duration={2000} left>
                            <form onSubmit={handleSubmit} className="contactForm">
                                <h4 className="miniTitle">CONTACT KOSHER CODE</h4>
                                <h5 className="sectionTitle">REQUEST AN ENTERPRISE DEMO OR CONSULTATION</h5>
                                <Row>
                                    <Col md={12} lg={6}>
                                        <input 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            placeholder="Your Name *" 
                                            type="text" 
                                            required
                                        />
                                    </Col>
                                    <Col md={12} lg={6}>
                                        <input 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            placeholder="Your Corporate Email *" 
                                            type="email" 
                                            required
                                        />
                                    </Col>
                                    <Col md={12} lg={6}>
                                        <select 
                                            name="institution" 
                                            value={formData.institution} 
                                            onChange={handleChange} 
                                            className="form-select mb-3" 
                                            required
                                        >
                                            <option value="" disabled>Select Institution / Sector *</option>
                                            <option value="Commercial Banking & FinTech">Commercial Banking & FinTech</option>
                                            <option value="SACCO / Microfinance Institution">SACCO / Microfinance Institution</option>
                                            <option value="MSME / SME Business">MSME / SME Business</option>
                                            <option value="Multi-Continental Enterprise">Multi-Continental Enterprise</option>
                                            <option value="Government Agency / NGO">Government Agency / NGO</option>
                                        </select>
                                    </Col>
                                    <Col md={12} lg={6}>
                                        <select 
                                            name="region" 
                                            value={formData.region} 
                                            onChange={handleChange} 
                                            className="form-select mb-3" 
                                            required
                                        >
                                            <option value="" disabled>Select Operational Region *</option>
                                            <option value="Uganda (Kampala & Regional)">Uganda (Kampala & Regional)</option>
                                            <option value="East Africa (Kenya, TZ, RW, SS)">East Africa (Kenya, TZ, RW, SS)</option>
                                            <option value="Pan-African Operations">Pan-African Operations</option>
                                            <option value="Multi-Continental / International">Multi-Continental / International</option>
                                        </select>
                                    </Col>
                                    <Col md={12}>
                                        <input 
                                            name="subject" 
                                            value={formData.subject} 
                                            onChange={handleChange} 
                                            placeholder="Subject / Project Scope *" 
                                            type="text" 
                                            required
                                        />
                                    </Col>
                                    <Col md={12}>
                                        <textarea 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleChange} 
                                            placeholder="Tell us about your system requirements, user volume, and integration needs..." 
                                            required
                                        ></textarea>
                                    </Col>
                                </Row>
                                <button className="branBtn mt-2" type="submit">Schedule Enterprise Consultation</button>
                            </form>
                        </Fade>
                    </Col>
                    <Col md={6}>
                        <Fade duration={2000} right>
                            <img src={`${contactImg}`} alt="" className="img-fluid"/>
                        </Fade>
                    </Col>
                </Row>
            </Col>
        </section>
    );
};

export default Contact;
