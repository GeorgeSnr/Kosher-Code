import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PopOver from '../../Shared/PopOver/PopOver';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import Sidebar from '../Sidebar/Sidebar';
import UserDashboard from '../UserDashboard/UserDashboard/UserDashboard';
import './Dashboard.css';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SET_ADMIN, useAppContext } from '../../../context';
import { checkIsAdmin } from '../../../services/storageService';

const Dashboard = () => {
    const { state: { user, admin }, dispatch } = useAppContext()
    const [sideToggle, setSideToggle] = useState(false)
    const [title, setTitle] = useState(admin ? 'Order List' : 'Book Solution')

    useEffect(() => {
        if (user && user.email) {
            const isAdminUser = checkIsAdmin(user.email);
            dispatch({ type: SET_ADMIN, payload: isAdminUser });
            setTitle(isAdminUser ? 'Order List' : 'Book Solution');
        }
    }, [dispatch, user?.email]);

    return (
        <div id="dashboard">
            <div id="sidebar" className={ sideToggle ? "active" : "" }>
                <div className="sidebarContent">
                    <Sidebar setTitle={setTitle}/>
                    <div className="backBtnBox">
                        <Link to="/">
                            <button className="backBtn"> 
                            <FontAwesomeIcon icon={faSignOutAlt}/>
                             back to home</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div id="pageContent">
                <div className="dashBoardHeader">
                    <div className="d-flex align-items-center">
                        <div id="nav-icon"
                        className={sideToggle ? "menu-btn" : "menu-btn open"}
                        onClick={() => setSideToggle(!sideToggle)}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <h3>{title}</h3>
                    </div>
                    <PopOver/> 
                </div>
                 {
                    admin ? <AdminDashboard/> : <UserDashboard/>
                } 
            </div>
        </div>
    )
}

export default Dashboard
