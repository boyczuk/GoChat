import { useState } from 'react';
import axios from 'axios';
import './styles/LoginForm.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";


function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                `${API_URL}/login`,
                { username, password },
                { withCredentials: true }
            );
            // Set login to successful when post request successfully sent
            onLoginSuccess();
        } catch (err) {
            setError(err.response?.data?.error || "An unexpected error occurred.");
        }
    };

    return (
        <div className="login-form-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='submit-button' type="submit">Log In</button>
            </form>
        </div>
    )
}

export default LoginForm;
