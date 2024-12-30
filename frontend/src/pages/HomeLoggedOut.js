import LoginForm from '../components/LoginForm';
import './HomeLoggedOut.css';

function HomeLoggedOut() {
    return (
        <div className="home-logged-out">
            <h1>Welcome to Adlai's Chat Application!</h1>
            <p>Connect with others using a secure and modern chat platform built with Go and React.</p>
            <div className="login-container">
                <LoginForm />
            </div>
        </div>
    );
}

export default HomeLoggedOut;
