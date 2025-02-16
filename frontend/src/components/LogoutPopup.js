import React from 'react';
import axios from "axios";
import './styles/LogoutPopup.css';

function LogoutPopup({ isOpen, onClose, onLogout }) {
    const handleLogout = () => {
        axios
            .post("http://3.17.175.47:8080/logout", {}, { withCredentials: true })
            .then((response) => {
                console.log(response.data.message);
                onLogout();
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }

    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <p>Are you sure you want to log out?</p>
                <div className="options">
                    <button className="logout-button" onClick={handleLogout}>
                        Log out
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutPopup;
