import LoginForm from '../components/LoginForm';
import './HomeLoggedOut.css';

function HomeLoggedOut({ onLoginSuccess }) {
    return (
        <div className="home-logged-out">
            <h1>Welcome to Adlai's Chat Application!</h1>
            <p>Connect with others using a secure and modern chat platform built with Go and React.</p>
            <div className="login-container">
                {/* track whether login is successful */}
                <LoginForm onLoginSuccess={onLoginSuccess} />
            </div>
        </div>
    );
}

export default HomeLoggedOut;
