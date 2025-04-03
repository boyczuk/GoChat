import React from "react";
import "./styles/Navbar.css";
import logo from './images/Logo.png';
import { MessageCircle, User, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ setIsUserPopupOpen, onLogoutClick }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <button
                className="nav-item menu-button"
                onClick={() => {
                    setIsUserPopupOpen((prev) => !prev);
                    navigate("/");
                }}
            >
                <Menu size={25} />
                <span>Friends</span>
            </button>

            <div className="nav-title">Tangle Chat</div>

            <div className="nav-buttons">
                <button className="nav-item" onClick={() => navigate("/")}>
                    <MessageCircle size={25} />
                    <span>Home</span>
                </button>
                <button className="nav-item" onClick={() => navigate("/profile")}>
                    <User size={25} />
                    <span>Profile</span>
                </button>
                <button className="nav-item" onClick={onLogoutClick}>
                    <LogOut size={25} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
