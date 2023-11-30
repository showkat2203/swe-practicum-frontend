import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = () => {
    const navigate = useNavigate();
    const userName = 'User'; // Replace with the actual user's name if available

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className="custom-user-menu">
            <div className="menu-title">
                {userName}
            </div>
            <div className="custom-submenu">
                <a onClick={handleLogout} href="#">Logout</a>
            </div>
        </div>
    );
};

export default UserMenu;


