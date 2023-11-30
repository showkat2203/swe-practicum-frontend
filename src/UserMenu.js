import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = () => {
    const navigate = useNavigate();
    const userName = 'User'; // Replace with actual user's name if available
    const [showSubMenu, setShowSubMenu] = useState(false);
    let hoverTimer;

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    const handleMouseEnter = () => {
        clearTimeout(hoverTimer);
        setShowSubMenu(true);
    };

    const handleMouseLeave = () => {
        hoverTimer = setTimeout(() => {
            setShowSubMenu(false);
        }, 1000); // Delay in ms
    };

    useEffect(() => {
        return () => {
            clearTimeout(hoverTimer); 
        };
    }, []);

    return (
        <div className="custom-user-menu" onMouseLeave={handleMouseLeave}>
            <div className="menu-title" onMouseEnter={handleMouseEnter}>
                {userName}
                <span className="arrow-down"></span> 
            </div>
            {showSubMenu && (
                <div className="custom-submenu">
                    <a onClick={handleLogout} href="#">Logout</a>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
