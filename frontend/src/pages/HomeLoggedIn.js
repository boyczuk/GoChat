import UserList from '../components/UserList';
import MessagingBox from '../components/MessagingBox';
import { useEffect, useState } from "react";
import axios from "axios";
import './HomeLoggedIn.css';
import UserProfileCard from '../components/UserProfileCard';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function HomeLoggedIn({ isUserPopupOpen, setIsUserPopupOpen }) {
    const [userId, setUserId] = useState(null);
    const [receiverId, setReceiverId] = useState(null);

    useEffect(() => {
        axios
            .get(`${API_URL}/me`, { withCredentials: true })
            .then((response) => {
                console.log("Fetched userId:", response.data.user_id); // Debug
                setUserId(response.data.user_id);
            })
            .catch((err) => console.error("Error fetching user ID:", err));
    }, []);

    useEffect(() => {
        console.log("Updated userId:", userId, "Updated receiverId:", receiverId); // Debug
    }, [userId, receiverId]);

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
                        <MessagingBox userId={userId} receiverId={receiverId} />
                    ) : (
                        <p>Select a user to start messaging</p>
                    )}
                </div>
            </div>
        </div>
    );
}


export default HomeLoggedIn;
