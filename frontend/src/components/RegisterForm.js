import { useState } from 'react';
import axios from 'axios';
import './styles/RegisterForm.css';

function RegisterForm({ onLoginSuccess }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8080/register",
                { username, password },
                { withCredentials: true }
            );
            console.log(response.data.message);
            // Set login to successful when post request successfully sent
            onLoginSuccess();
        } catch (err) {
            setError(err.response?.data?.error || "An unexpected error occurred.");
        }
    };

    return (
        <div className="register-form-container">
            <h2>Create account</h2>
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
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="birthday">Birthday</label>
                    <input
                        type="date"
                        id="birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
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
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default RegisterForm;