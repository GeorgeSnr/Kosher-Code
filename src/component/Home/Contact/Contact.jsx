import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import './Contact.css';
import contactImg from '../../../Assets/contact.svg';
import swal from 'sweetalert';
import Fade from 'react-reveal/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPaperPlane, faPhoneAlt, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { 
    dispatchConsultationRequest, 
    getWhatsAppUrl, 
    getQuickWhatsAppUrl, 
    RECIPIENT_EMAIL, 
    WHATSAPP_NUMBER 
} from '../../../services/contactDispatchService';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        institution: '',
        region: '',
        subject: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const currentData = { ...formData };
        const result = await dispatchConsultationRequest(currentData);

        setIsSubmitting(false);

        setFormData({
            name: '',
            email: '',
            phone: '',
            institution: '',
            region: '',
            subject: '',
            description: ''
        });

        swal({
            title: "Consultation Request Dispatched!",
            text: `Thank you for reaching out! Your inquiry has been sent to our Solutions Director at ${RECIPIENT_EMAIL} and our engineering team in Kampala.\n\nWould you like to also connect immediately on WhatsApp (${WHATSAPP_NUMBER})?`,
            icon: "success",
            buttons: {
                cancel: {
                    text: "Done",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                whatsapp: {
                    text: "💬 Chat on WhatsApp",
                    value: "whatsapp",
                    visible: true,
                    className: "swal-button--whatsapp",
                    closeModal: true
                }
            }
        }).then((value) => {
            if (value === 'whatsapp' && result.whatsAppUrl) {
                window.open(result.whatsAppUrl, '_blank', 'noopener,noreferrer');
            }
        });
    };

    const handleDirectWhatsApp = (e) => {
        e.preventDefault();
        if (!formData.name && !formData.description && !formData.subject) {
            // If empty, open general WhatsApp chat
            window.open(getQuickWhatsAppUrl(), '_blank', 'noopener,noreferrer');
            return;
        }

        // Save in background and open WhatsApp with pre-filled details
        dispatchConsultationRequest(formData);
        window.open(getWhatsAppUrl(formData), '_blank', 'noopener,noreferrer');
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
                                            placeholder="Corporate Email *" 
                                            type="email" 
                                            required
                                        />
                                    </Col>
                                    <Col md={12}>
                                        <input 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            placeholder="Phone / WhatsApp Number (e.g. +256 700 000 000)" 
                                            type="tel" 
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

                                <div className="contactActionGroup">
                                    <button 
                                        className="branBtn" 
                                        type="submit" 
                                        disabled={isSubmitting}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                                        {isSubmitting ? 'Dispatching Request...' : 'Schedule Enterprise Consultation'}
                                    </button>

                                    <button 
                                        type="button" 
                                        className="whatsappBtn"
                                        onClick={handleDirectWhatsApp}
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} className="me-1 fa-lg" />
                                        Send via WhatsApp
                                    </button>
                                </div>

                                <div className="directChannelsContainer">
                                    <div className="channelItem">
                                        <span className="channelIcon email"><FontAwesomeIcon icon={faEnvelope} /></span>
                                        <span>Direct Email: <a href={`mailto:${RECIPIENT_EMAIL}`}>{RECIPIENT_EMAIL}</a></span>
                                    </div>
                                    <div className="channelItem">
                                        <span className="channelIcon wa"><FontAwesomeIcon icon={faWhatsapp} /></span>
                                        <span>Direct WhatsApp / Call: <a href={`https://wa.me/256703275790`} target="_blank" rel="noopener noreferrer">{WHATSAPP_NUMBER}</a></span>
                                    </div>
                                    <div className="channelItem">
                                        <span className="channelIcon"><FontAwesomeIcon icon={faHeadset} /></span>
                                        <span className="text-muted small">Engineering leadership responses within 2-24 hours.</span>
                                    </div>
                                </div>
                            </form>
                        </Fade>
                    </Col>
                    <Col md={6}>
                        <Fade duration={2000} right>
                            <img src={`${contactImg}`} alt="Contact Kosher Code" className="img-fluid"/>
                        </Fade>
                    </Col>
                </Row>
            </Col>
        </section>
    );
};

export default Contact;

