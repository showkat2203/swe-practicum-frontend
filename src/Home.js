import React from 'react';
import UserMenu from './UserMenu';

const Home = () => {
    const userId = localStorage.getItem('userId');

    return (
        <div className="home-container">
          
            {userId && <UserMenu />}
        </div>
    );
};

export default Home;
