import React, { useEffect, useState } from 'react';
import Service from './Service';
import Spinner from '../../Shared/Spinner/Spinner';
import { getStoredServices, fetchServicesAsync, subscribeToServices } from '../../../services/storageService';

const Services = () => {
    const [services, setServices] = useState(() => getStoredServices());
    const [activeFilter, setActiveFilter] = useState('All');
    
    useEffect(() => {
        // Initial fetch from Firestore
        fetchServicesAsync()
            .then(data => {
                if (data && data.length > 0) {
                    setServices(data);
                }
            })
            .catch(() => {
                setServices(getStoredServices());
            });

        // Real-time Firestore sync listener
        const unsubscribe = subscribeToServices((cloudServices) => {
            if (cloudServices && cloudServices.length > 0) {
                setServices(cloudServices);
            }
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, []);

    const categories = ['All', 'Web & Design', 'Digital Marketing & SEO', 'MSMEs & Enterprises', 'SACCOs & MFIs', 'Banking & FinTech'];
    
    const filteredServices = activeFilter === 'All' 
        ? services 
        : services.filter(s => s.category === activeFilter);

    return (
        <section id="services" className="services">
            <h4 className="miniTitle text-center">OUR SERVICES & CAPABILITIES</h4>
            <div className="text-center">
                <h5 className="text-center sectionTitle">
                    COMPREHENSIVE DIGITAL & ENTERPRISE SOLUTIONS FOR EVERY STAGE
                </h5>
                <p className="col-md-8 mx-auto mb-4" style={{ color: 'var(--site-text-muted, #666666)' }}>
                    From website development, UI/UX, branding, and SEO for startups to core banking, SACCO ERPs, and multi-continental enterprise systems.
                </p>
            </div>

            <div className="d-flex justify-content-center flex-wrap gap-2 mb-4 px-3">
                {categories.map((cat, idx) => {
                    const isActive = activeFilter === cat;
                    return (
                        <button
                            key={idx}
                            className="btn btn-sm px-3 py-2 m-1"
                            style={{
                                borderRadius: '4px',
                                fontWeight: 500,
                                fontSize: '0.88rem',
                                transition: 'all 0.25s ease',
                                backgroundColor: isActive ? 'var(--site-primary, #7355F7)' : 'var(--site-card-bg, #FFFFFF)',
                                color: isActive ? '#FFFFFF' : 'var(--site-text-main, #070120)',
                                border: isActive ? '1px solid var(--site-primary, #7355F7)' : '1px solid var(--site-border, #E5E0FA)',
                                boxShadow: isActive ? '0 4px 12px rgba(115, 85, 247, 0.25)' : 'none'
                            }}
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {services.length === 0 && <div className="spinner text-center"><Spinner/></div>}
            <div className="row mt-2 container mx-auto justify-content-center">
                {
                    filteredServices?.map((service, id) => <Service key={service._id || id} service={service}/>)
                }
            </div>
        </section>
    );
};

export default Services;
