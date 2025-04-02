import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import './HomeLoggedOut.css';

function HomeLoggedOut({ onLoginSuccess }) {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="home-logged-out">
            <h1>Welcome to Tangle!</h1>
            <p>Connect with others using a secure and modern chat platform built with Go and React.</p>
            
            {showLogin ? <LoginForm onLoginSuccess={onLoginSuccess} /> : <RegisterForm onLoginSuccess={onLoginSuccess} />}
            <button className='switch-button' onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? "Create account" : "Log in"}
            </button>
        </div>
    );
}

export default HomeLoggedOut;
