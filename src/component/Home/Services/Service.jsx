import React from 'react';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import './Service.css';
import { SET_SELECTED_SERVICE, useAppContext } from '../../../context';
import ServiceIcon from './ServiceIcons';

const Service = ({service}) => {
    const { dispatch } = useAppContext()
    const {name, price, description, category, region, iconType} = service;

    const handleSelectedService = (serviceData) => {
        dispatch({type: SET_SELECTED_SERVICE, payload: serviceData})
    }    
    
    return (
        <div className="col-md-6 col-lg-4 service">
            <Fade bottom duration={2000} distance='40px'>
                <div className="service-card d-flex flex-column h-100">
                    <div className="service-header d-flex align-items-center justify-content-between mb-3">
                        <div className="service-icon-box">
                            <ServiceIcon iconType={iconType} />
                        </div>
                        <div className="service-badge-group text-end">
                            {category && <span className="service-category-badge">{category}</span>}
                        </div>
                    </div>

                    <div className="service-body flex-grow-1">
                        <h4 className="serviceName">{name}</h4>
                        <p className="serviceDes">{description}</p>
                    </div>

                    {region && (
                        <div className="service-region-box mb-3">
                            <span className="service-region-badge">
                                <span className="region-dot"></span> {region}
                            </span>
                        </div>
                    )}

                    <div className="service-footer d-flex align-items-center justify-content-between pt-3 border-top">
                        <div className="price-tag-wrapper">
                            <span className="price-label">Starting at</span>
                            <h5 className="servicePrice mb-0">${price}</h5>
                        </div>
                        <Link 
                            className="serviceLink" 
                            to="/client/book"
                            onClick={() => handleSelectedService(service)}
                        >
                            <button className="bookingBtn">
                                Book Now <span>&rarr;</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </Fade>
        </div>
    );
};

export default Service;