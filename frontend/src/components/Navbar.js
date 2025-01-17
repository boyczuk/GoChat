import React from "react";
import "./styles/Navbar.css";
import logo from './images/pfptemp.jpg';

function Navbar({ setCurrentPage }) {
    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" className="nav-logo" />
            <button className="nav-item" onClick={() => setCurrentPage("messages")}>
                Messages
            </button>
            <button className="nav-item" onClick={() => setCurrentPage("profile")}>
                Profile
            </button>
            <button className="nav-item" onClick={() => setCurrentPage("logout")}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;
