import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="user-menu" style={{ position: 'absolute', top: 0, right: 0, margin: '10px' }}>
            <div onClick={() => setShowMenu(!showMenu)}>
                {user.name}
            </div>
            {showMenu && (
                <div className="submenu" style={{ position: 'absolute', right: 0, backgroundColor: 'white', boxShadow: '0px 0px 5px #aaa', padding: '5px' }}>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
