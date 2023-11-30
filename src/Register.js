import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import CSS for styling

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleNavigateToLogin = () => {
        navigate('/');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/register', { email, password, name });
            console.log('Registration successful:', response.data);
            navigate('/', { state: { fromRegistration: true } }); // Redirect with state
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        }

    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Register</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <button type="submit">Register</button>
                </form>
                <button onClick={handleNavigateToLogin} className="secondary-button">
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
};

export default Register;
