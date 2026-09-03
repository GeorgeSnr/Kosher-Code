import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuffer } from '@fortawesome/free-brands-svg-icons';
import { faUserTie, faSignInAlt, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Container, Nav, Navbar } from 'react-bootstrap';
import PopOver from '../PopOver/PopOver';
import { useAppContext } from '../../../context';
import toast from 'react-hot-toast';

const NavBar = () => {
    const { state: { user, admin } } = useAppContext();
    const [isSticky, setSticky] = useState(false);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('kosher_client_theme') || 'light';
    });

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setSticky(true);
            } else {
                setSticky(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('kosher_client_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        toast(nextTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated', {
            icon: nextTheme === 'dark' ? '🌙' : '☀️',
            style: {
                borderRadius: '4px',
                background: nextTheme === 'dark' ? '#1E293B' : '#FFFFFF',
                color: nextTheme === 'dark' ? '#F8FAFC' : '#0F172A',
                border: '1px solid ' + (nextTheme === 'dark' ? '#334155' : '#E2E8F0'),
            },
        });
    };

    const [expanded, setExpanded] = useState(false);
    const navRef = useRef(null);

    const scrollTop = () => window['scrollTo']({ top: 0, behavior: 'smooth' });

    const handleNavItemClick = (callback) => {
        if (typeof callback === 'function') {
            callback();
        }
        // Micro-delay gives tactile visual confirmation before rolling back
        setTimeout(() => {
            setExpanded(false);
        }, 140);
    };

    // Gently close the dropdown menu when clicking or tapping outside the menu bar, or pressing Escape
    useEffect(() => {
        if (!expanded) return;

        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [expanded]);

    // Reset mobile dropdown if viewport is resized to desktop width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 991 && expanded) {
                setExpanded(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [expanded]);

    return (
        <>
            <Navbar 
                ref={navRef}
                expanded={expanded} 
                onToggle={setExpanded} 
                className={`navbar navbar-expand-lg ${isSticky ? "navStyle" : "navDefault"}`} 
                expand="lg"
            >
            <Container>
                <Navbar.Brand as={Link} to="/" onClick={() => handleNavItemClick(scrollTop)} className="navBrn">
                    <FontAwesomeIcon icon={faBuffer} className="brnIcon" /> Kosher <span className="navHighlight">Code</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto mainNav align-items-center" activeKey="/home">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/" className="nav-link" onClick={() => handleNavItemClick(scrollTop)}>Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#services" className="nav-link" onClick={() => handleNavItemClick()}>Solutions</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#testimonial" className="nav-link" onClick={() => handleNavItemClick()}>Reviews</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#contact" className="nav-link" onClick={() => handleNavItemClick()}>Contact Us</Nav.Link>
                        </Nav.Item>

                        {/* Theme Toggle Button */}
                        <Nav.Item className="ms-lg-2 my-2 my-lg-0">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="site-theme-btn d-flex align-items-center gap-1.5"
                                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                            >
                                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                                <span className="d-inline d-lg-none ms-1">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                        </Nav.Item>

                        {user?.email ? (
                            <>
                                <Nav.Item className="ms-lg-2">
                                    <Nav.Link 
                                        as={Link} 
                                        to={admin ? "/admin" : "/client"} 
                                        className="nav-link fw-semibold"
                                        onClick={() => handleNavItemClick()}
                                        style={{ color: 'var(--site-primary, #7355F7)' }}
                                    >
                                        <FontAwesomeIcon icon={faUserTie} className="me-1" />
                                        {admin ? 'Workspace Portal' : 'Client Portal'}
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="ms-2">
                                    <PopOver />
                                </Nav.Item>
                            </>
                        ) : (
                            <Nav.Item className="ms-lg-2">
                                <Link to="/login" onClick={() => handleNavItemClick()}>
                                    <button className="loginBtn d-flex align-items-center gap-1.5">
                                        <FontAwesomeIcon icon={faSignInAlt} /> Portal Login
                                    </button>
                                </Link>
                            </Nav.Item>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        {/* Gentle backdrop overlay for mobile menu dropdown */}
        <div 
            className={`navbar-mobile-backdrop ${expanded ? 'active' : ''}`}
            onClick={() => setExpanded(false)}
            aria-hidden="true"
        />
        </>
    );
};

export default NavBar;
