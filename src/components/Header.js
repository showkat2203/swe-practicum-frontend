import React, { useState, useEffect } from 'react';
import UserMenu from '../UserMenu'; 

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('userId'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className="header">
            <h1>Inventory Management System</h1>
            {isLoggedIn && <UserMenu onLogout={handleLogout} />}
        </div>
    );
};

export default Header;
