import UserList from '../components/UserList';
import MessagingBox from '../components/MessagingBox';
import { useEffect, useState } from "react";
import axios from "axios";
import './HomeLoggedIn.css';
import UserProfileCard from '../components/UserProfileCard';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function HomeLoggedIn({ isUserPopupOpen, setIsUserPopupOpen, navigateToPage }) {
    const [userId, setUserId] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        axios
            .get(`${API_URL}/me`, { withCredentials: true })
            .then((response) => {
                setUserId(response.data.user_id);
            })
            .catch((err) => console.error("Error fetching user ID:", err));
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/total-users`, { withCredentials: true })
            .then((response) => {
                setTotalUsers(response.data.total_users);
            })
            .catch((err) => console.error("Error fetching total users:", err));
    }, [userId]);

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains("popup-backdrop")) {
            setIsUserPopupOpen(false);
        }
    };

    return (
        <div className="main-page">
            <div className="container">
                {isUserPopupOpen && (
                    <>
                        <div className="popup-backdrop active" onClick={handleBackdropClick}></div>
                        <div className="popup">
                            <UserList setReceiverId={setReceiverId} />
                        </div>
                    </>
                )}

                <div className="message-window">
                    {userId && receiverId ? (
                        <MessagingBox userId={userId} receiverId={receiverId} navigateToPage={navigateToPage} />
                    ) : (
                        <div className="no-chat-placeholder">

                            <div className="placeholder-layout">
                                <div className="arrow-instructions">
                                    <div className="arrow-bounce-wrapper">
                                        <div className="arrow">→</div>
                                    </div>
                                    <div className="arrow-text">Click "Friends" to start chatting!</div>
                                </div>

                                <div className="info-cards">
                                    <div className="info-card">
                                        <h3>✨ Recent Features</h3>
                                        <ul>
                                            <li>Real-time messaging</li>
                                            <li>Shareable profiles</li>
                                            <li>Profile customization</li>
                                        </ul>
                                    </div>

                                    <div className="info-card">
                                        <h3>🌐 Total Users</h3>
                                        <p>Total Users: <span className="total-users">{totalUsers}</span></p>
                                    </div>

                                    <div className="info-card">
                                        <h3>🚧 Coming Soon</h3>
                                        <ul>
                                            <li>Photo and text posts</li>
                                            <li>Add/removing friends</li>
                                            <li>Notification system</li>
                                            <li>Enhanced security and encryption</li>
                                        </ul>
                                    </div>

                                    <div className="info-card">
                                        <h3>📱 Follow Us</h3>
                                        <ul>
                                            <li><XIcon /><a href="https://x.com/chat_tangle" target="_blank" rel="noreferrer">Twitter</a></li>
                                            <li><InstagramIcon /><a href="https://www.instagram.com/tangle.chat" target="_blank" rel="noreferrer">Instagram</a></li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


export default HomeLoggedIn;
