import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart, 
    faCommentAlt, 
    faUserPlus, 
    faCog, 
    faFileMedical, 
    faList, 
    faUserCircle,
    faInbox,
    faCalendarCheck,
    faShieldAlt,
    faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { faBuffer } from '@fortawesome/free-brands-svg-icons';
import { useAppContext } from '../../../context';

const Sidebar = ({ setTitle }) => {
    const { state: { admin } } = useAppContext();

    return (
        <div>
            <div className="sideBrand">
                <div className="sideBrnIcon">
                    <FontAwesomeIcon icon={faBuffer} />
                </div>
                <h2>Kosher <span className="navHighlight">Code</span></h2>
            </div>

            {/* Role indicator pill */}
            <div className="px-3 mb-3">
                <div 
                    className="p-2 text-center small fw-semibold"
                    style={{
                        borderRadius: '4px',
                        backgroundColor: admin ? '#FAF8FF' : '#F4F0FF',
                        color: '#7355F7',
                        border: '1px solid #E5E0FA',
                        fontSize: '0.8rem'
                    }}
                >
                    <FontAwesomeIcon icon={admin ? faShieldAlt : faUserTie} className="me-1.5" />
                    {admin ? 'Administrator Portal' : 'Client Portal'}
                </div>
            </div>

            <nav id="sideNavbar">
                <ul>    
                    <li>
                        <NavLink onClick={() => setTitle('Profile')} className={({ isActive }) => isActive ? "activePage" : ""} end to="/dashboard/profile">
                            <FontAwesomeIcon icon={faUserCircle} className="iconC"/> 
                            Profile
                        </NavLink>
                    </li>
                    {admin ? (
                        <>
                            <li>
                                <NavLink onClick={() => setTitle('Incoming Requests')} className={({ isActive }) => isActive ? "activePage" : ""} to="/dashboard/orderList">
                                    <FontAwesomeIcon icon={faInbox} className="iconC"/> 
                                    Incoming Requests
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('Add Solution')} className={({ isActive }) => isActive ? "activePage" : ""} to="/dashboard/addService">
                                    <FontAwesomeIcon icon={faFileMedical} className="iconC"/> 
                                    Add Solution
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('Make Admin')} className={({ isActive }) => isActive ? "activePage" : ""} to="/dashboard/makeAdmin">
                                    <FontAwesomeIcon icon={faUserPlus} className="iconC"/> 
                                    Make Admin
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('Manage Solutions')} className={({ isActive }) => isActive ? "activePage" : ""} to="/dashboard/manageServices">
                                    <FontAwesomeIcon icon={faCog} className="iconC"/>
                                    Manage Solutions
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink onClick={() => setTitle('Book Solution')} className={({ isActive }) => isActive ? "activePage" : ""} end to="/dashboard/book">
                                    <FontAwesomeIcon icon={faShoppingCart} className="iconC"/> 
                                    Book Solution
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('My Bookings')} className={({ isActive }) => isActive ? "activePage" : ""} to="/dashboard/booking">
                                    <FontAwesomeIcon icon={faCalendarCheck} className="iconC"/> 
                                    My Bookings
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('Review & Feedback')} className={({ isActive }) => isActive ? "activePage" : ""} to="/dashboard/review">
                                    <FontAwesomeIcon icon={faCommentAlt} className="iconC"/>
                                    Feedback & Review
                                </NavLink>
                            </li>
                        </>
                    )} 
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
