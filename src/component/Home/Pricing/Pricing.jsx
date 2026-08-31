import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import PricingCard from './PricingCard';
import './Pricing.css';
import sPic1 from '../../../Assets/s1.png';
import sPic2 from '../../../Assets/s2.png';
import sPic3 from '../../../Assets/s3.png';
import sPic4 from '../../../Assets/s4.png';
import sPic5 from '../../../Assets/s5.png';
import sPic6 from '../../../Assets/s6.png';
import Spinner from '../../Shared/Spinner/Spinner';
import { getStoredPricing, fetchPricingAsync, subscribeToPricing } from '../../../services/storageService';

const Pricing = () => {
    const [pricingPlans, setPricingPlans] = useState(() => getStoredPricing());

    useEffect(() => {
        // Initial fetch from Firestore
        fetchPricingAsync().then(data => {
            if (data && data.length > 0) {
                setPricingPlans(data);
            }
        });

        // Real-time Firestore sync listener
        const unsubscribe = subscribeToPricing((cloudPlans) => {
            if (cloudPlans && cloudPlans.length > 0) {
                setPricingPlans(cloudPlans);
            }
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, []);

    return (
        <section className="pricing">
            <h4 className="miniTitle text-center">FLEXIBLE & SCALABLE PLANS</h4>
            <div className="text-center">
                <h2 className="sectionTitle">PACKAGES FOR EVERY BUDGET & STAGE</h2>
                <p className="col-md-8 mx-auto mb-4" style={{ color: 'var(--site-text-muted, #666666)' }}>
                    Transparent pricing options designed for startups, growing businesses, MSMEs, SACCOs, and financial enterprises.
                </p>
            </div>
            <Container>
                <Tab.Container defaultActiveKey="1"> 
                    <Row>
                        <Col md={10} className="mx-auto">
                            <Nav className="pricingNav">
                                <Nav.Item className="priceLink1 text-center">
                                    <Nav.Link eventKey="1" title="Web & Mobile Development">
                                        <img src={`${sPic1}`} alt="" />
                                    </Nav.Link>
                                    <small className="d-block mt-1 fw-bold" style={{ fontSize: '11px', color: 'var(--site-text-muted, #555555)' }}>Web & Apps</small>
                                </Nav.Item>
                                <Nav.Item className="priceLink2 text-center">
                                    <Nav.Link eventKey="2" title="Digital Marketing & SEO">
                                        <img src={`${sPic2}`} alt="" />
                                    </Nav.Link>
                                    <small className="d-block mt-1 fw-bold" style={{ fontSize: '11px', color: 'var(--site-text-muted, #555555)' }}>SEO & Marketing</small>
                                </Nav.Item>
                                <Nav.Item className="priceLink3 text-center">
                                    <Nav.Link eventKey="3" title="MSME Enterprise ERP">
                                        <img src={`${sPic3}`} alt="" />
                                    </Nav.Link>
                                    <small className="d-block mt-1 fw-bold" style={{ fontSize: '11px', color: 'var(--site-text-muted, #555555)' }}>MSME ERP</small>
                                </Nav.Item>
                                <Nav.Item className="priceLink4 text-center">
                                    <Nav.Link eventKey="4" title="SACCO & Microfinance">
                                        <img src={`${sPic4}`} alt="" />
                                    </Nav.Link>
                                    <small className="d-block mt-1 fw-bold" style={{ fontSize: '11px', color: 'var(--site-text-muted, #555555)' }}>SACCOs</small>
                                </Nav.Item>
                                <Nav.Item className="priceLink5 text-center">
                                    <Nav.Link eventKey="5" title="Banking & FinTech">
                                        <img src={`${sPic5}`} alt="" />
                                    </Nav.Link>
                                    <small className="d-block mt-1 fw-bold" style={{ fontSize: '11px', color: 'var(--site-text-muted, #555555)' }}>Banking</small>
                                </Nav.Item>
                                <Nav.Item className="priceLink6 text-center">
                                    <Nav.Link eventKey="6" title="Cloud & Security">
                                        <img src={`${sPic6}`} alt="" />
                                    </Nav.Link>
                                    <small className="d-block mt-1 fw-bold" style={{ fontSize: '11px', color: 'var(--site-text-muted, #555555)' }}>Cloud/Security</small>
                                </Nav.Item>
                            </Nav>
                       </Col>
                        <Tab.Content>
                        {
                            pricingPlans.length === 0 ?
                            <div className="spinner text-center mt-3"><Spinner/></div>:
                            pricingPlans.map((data, index) => <PricingCard id={index} data={data} key={index}/>)
                        }
                        </Tab.Content>
                    </Row>
                </Tab.Container>
            </Container>
        </section>
    );
};

export default Pricing;
