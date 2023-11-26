import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import UserMenu from './UserMenu';
import Header from './components/Header';
import Footer from './components/Footer';
import MainMenu from './components/MainMenu';
import './App.css'

const Home = () => {
    const { user } = useContext(UserContext);
  
    return (
      <div className="home-container">
        <Header />
        {user && <UserMenu />} {/* UserMenu component for logged in users */}
        {/* Additional content and components as needed */}
        <Footer />
      </div>
    );
  };

  
export default Home;
