import React from 'react';
import { Col, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';

const PricingCard = ({data, id}) => {
    return (
        <Tab.Pane eventKey={String(id + 1)}>
            <Row className="justify-content-center">
                {
                    data.map(({title, name, price, description, features}, index) => {
                        const isFeatured = index === 1;
                        return(
                            <Col lg={4} md={6} key={index} className="d-flex mb-4">
                                <Fade bottom duration={1800} distance='40px'>
                                    <div className={`pricingCard pricingCard${id + 1} ${isFeatured ? 'featured-card' : ''} d-flex flex-column h-100`}>
                                        {isFeatured && <div className="popular-badge">Recommended</div>}
                                        <div className="pricingBox">
                                            <span className="plan-tier-badge">{title}</span>
                                            <div className="pricePlan my-3">
                                                <span className="currency">$</span>
                                                <span className={`ph${id + 1} price-number`}>{price}</span>
                                                <span className="period">/month</span>
                                            </div>
                                            <h5 className="plan-name">{name}</h5>
                                            <p className="planDescription">{description || 'Enterprise architecture with bank-grade security and dedicated deployment.'}</p>
                                        </div>
                                        <ul className="pricing-features flex-grow-1 p-0 mt-3 mb-4">
                                            {
                                                (features || ['Bank-Grade Security', 'Multi-Continental Cloud Architecture', '24/7 Priority Support SLA']).map((feat, fIdx) => (
                                                    <li key={fIdx} className="d-flex align-items-center mb-2">
                                                        <span className="checkIcon-modern">&#10004;</span>
                                                        <span className="feature-text">{feat}</span>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        <div className="pricing-cta mt-auto pt-3 border-top text-center">
                                            <Link to="/client/book" className="w-100 text-decoration-none">
                                                <button className={`pricingBtn ${isFeatured ? 'btn-featured' : ''}`}>
                                                    Select {title}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </Fade>
                            </Col>
                        )
                    })
                }
            </Row>
        </Tab.Pane>
    );
};

export default PricingCard;