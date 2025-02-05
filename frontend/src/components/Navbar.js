import React from "react";
import "./styles/Navbar.css";
import logo from './images/Logo.png';
import { MessageCircle, User, LogOut } from 'lucide-react'; // Import icons

function Navbar({ setCurrentPage }) {
    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" className="nav-logo" />
            <button className="nav-item" onClick={() => setCurrentPage("messages")}>
                <MessageCircle size={25} />
                <span>Messages</span> 
            </button>
            <button className="nav-item" onClick={() => setCurrentPage("profile")}>
                <User size={25} />
                <span>Profile</span>
            </button>
            <button className="nav-item" onClick={() => setCurrentPage("logout")}>
                <LogOut size={25} />
                <span>Logout</span>
            </button>
        </nav>
    );
}

export default Navbar;
