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

            <div className="d-flex justify-content-center flex-wrap gap-2 mb-3 px-3">
                {categories.map((cat, idx) => {
                    const isActive = activeFilter === cat;
                    const count = cat === 'All' ? services.length : services.filter(s => s.category === cat).length;
                    return (
                        <button
                            key={idx}
                            className="btn btn-sm px-3.5 py-1.5 m-1 rounded-pill"
                            style={{
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                transition: 'all 0.18s ease',
                                backgroundColor: isActive ? 'var(--site-primary, #0672CB)' : 'var(--site-card-bg, #FFFFFF)',
                                color: isActive ? '#FFFFFF' : 'var(--site-text-muted, #475569)',
                                border: isActive ? '1px solid var(--site-primary, #0672CB)' : '1px solid var(--site-border, #CBD5E1)',
                                boxShadow: isActive ? '0 2px 8px rgba(6, 114, 203, 0.25)' : 'none'
                            }}
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat} <span style={{ opacity: isActive ? 0.9 : 0.7, fontSize: '0.74rem', marginLeft: '4px' }}>({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Dell-style results metadata bar */}
            <div className="container text-center mb-4">
                <small className="text-muted" style={{ fontSize: '0.78rem', letterSpacing: '0.02em' }}>
                    Showing <strong>{filteredServices.length}</strong> enterprise {filteredServices.length === 1 ? 'capability' : 'capabilities'}
                    {activeFilter !== 'All' && <span> in <strong>{activeFilter}</strong></span>}
                </small>
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
