import React from 'react';
import './HappyClient.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPiggyBank, faExchangeAlt, faGlobeAfrica } from '@fortawesome/free-solid-svg-icons';
import CountUp from 'react-countup';

const HappyClient = () => {
    const workDetails = [
        { 
            title: 'Enterprise & SME Clients', 
            number: 245, 
            suffix: '+', 
            icon: faUsers, 
            id: 1 
        },
        { 
            title: 'SACCOs & Banks Deployed', 
            number: 112, 
            suffix: '+', 
            icon: faPiggyBank, 
            id: 2 
        },
        { 
            title: 'Transactions Powered', 
            prefix: '$',
            number: 580, 
            suffix: 'M+', 
            icon: faExchangeAlt, 
            id: 3 
        },
        { 
            title: 'Countries & Continents', 
            number: 18, 
            suffix: '+', 
            icon: faGlobeAfrica, 
            id: 4 
        }
    ];

    return (
        <section className="ourValue">
            <div className="container">
                <div className="row g-4 justify-content-center">
                    {
                        workDetails.map(({ title, number, prefix, suffix, icon, id }) => (
                            <div className="col-md-6 col-lg-3" key={id}>
                                <div className="ourValueDetails">
                                    <div className="valueIcon">
                                        <FontAwesomeIcon icon={icon} />
                                    </div>
                                    <h4 className="ourValueNumber">
                                        {prefix}
                                        <CountUp end={number} start={0} duration={3} />
                                        {suffix}
                                    </h4>
                                    <p className="ourValueTitle">{title}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default HappyClient;
