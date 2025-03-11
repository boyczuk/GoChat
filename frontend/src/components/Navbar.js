import React from "react";
import "./styles/Navbar.css";
import logo from './images/Logo.png';
import { MessageCircle, User, LogOut, Menu } from "lucide-react"; // Import icons
import { useState } from "react";

function Navbar({ setCurrentPage, setIsUserPopupOpen }) {
    return (
        <nav className="navbar">
            <button className="nav-item menu-button" onClick={() => {setIsUserPopupOpen((prev) => !prev); setCurrentPage("messages")}}>
                <Menu size={25} />
                <span>Friends</span>
            </button>

            <div className="nav-buttons">
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
            </div>
        </nav>
    );
}

export default Navbar;
