import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import './Auth.css'; 

const Login = () => {
    const location = useLocation();
    const [showSuccess, setShowSuccess] = useState(false);
    const { setUser } = useContext(UserContext);


    useEffect(() => {
        if (location.state?.fromRegistration) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const navigate = useNavigate();

    const handleNavigateToRegister = () => {
        navigate('/register');
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:8080/login', { email, password });
          console.log('Login successful:', response.data);
          setUser(response.data); // Set the user in context
          navigate('/home');
        } catch (err) {
          setError(err.response?.data || 'Login failed');
        }
      };

    return (
        <div className="auth-container">
            <div className="auth-form">
            {showSuccess && <div className="success">Registration successful!</div>}

                <h2>Login</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <button type="submit">Login</button>
                </form>
                <button onClick={handleNavigateToRegister} className="secondary-button">
                    Don't have an account? Register
                </button>
            </div>
        </div>
    );
};

export default Login;