import React from "react";
import "./styles/Navbar.css";

function Navbar({ setCurrentPage }) {
    return (
        <nav className="navbar">
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
