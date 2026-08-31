import React from 'react';
import teamPic from '../../../Assets/about.svg';
import Fade from 'react-reveal/Fade';

const About = () => {
    return (
        <section id="about" className="about overflow-hidden py-5">
            <div className="row w-100">
                <div className="row col-md-11 mx-auto ">
                    <div className="col-md-6 img">
                        <Fade duration={2000} left>
                            <img src={`${teamPic}`} alt="" className="img-fluid"/>
                        </Fade>
                    </div>
                    <div className="col-md-6 ps-2">
                        <Fade duration={2000} right>
                            <p className="miniTitle">ABOUT KOSHER CODE</p>
                            <h1 className="headerTitle">TECHNOLOGY & SOFTWARE EXCELLENCE FOR <span className="headerHighlight">EVERY STAGE OF GROWTH</span></h1>
                            <p className="headerContent">
                                Headquartered in Kampala, Uganda, Kosher Code is a full-service technology powerhouse. We provide tailored solutions for everyone — from modern website design, mobile apps, and SEO for startups and creators, to comprehensive ERPs for MSMEs, cloud management systems for SACCOs, and core banking integrations for financial enterprises across Africa and worldwide.
                            </p>
                            <a href="#services"><button className="branBtn">Discover Our Services</button></a>
                        </Fade>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;