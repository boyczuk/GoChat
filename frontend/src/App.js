import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LogoutPopup from "./components/LogoutPopup";
import HomeLoggedIn from "./pages/HomeLoggedIn";
import HomeLoggedOut from "./pages/HomeLoggedOut";
import Profile from "./pages/Profile";
import ViewProfile from "./pages/ViewProfile";
import NotFound from "./pages/404page";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function RouterApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

    useEffect(() => {
        axios
            .get(`${API_URL}/me`, { withCredentials: true })
            .then((res) => {
                console.log("User session active:", res.data);
                setIsLoggedIn(true);
            })
            .catch((err) => {
                console.log("No active session:", err);
                setIsLoggedIn(false);
            });
    }, []);

    if (!isLoggedIn) {
        return <HomeLoggedOut onLoginSuccess={() => setIsLoggedIn(true)} />;
    }

    return (
        <Router>
            <div className="App logged-in">
                <Navbar
                    setCurrentPage={(page) => {
                        if (page === "logout") {
                            setPopupOpen(true);
                        }
                    }}
                    setIsUserPopupOpen={setIsUserPopupOpen}
                />
                <Routes>
                    <Route path="/" element={<HomeLoggedInWrapper isUserPopupOpen={isUserPopupOpen} setIsUserPopupOpen={setIsUserPopupOpen} />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/view/:id" element={<ViewProfileWrapper />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <LogoutPopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} onLogout={() => {
                    setIsLoggedIn(false);
                    setPopupOpen(false);
                }} />
            </div>
        </Router>
    );
}

function HomeLoggedInWrapper({ isUserPopupOpen, setIsUserPopupOpen }) {
    const navigate = useNavigate();
    return (
        <HomeLoggedIn
            isUserPopupOpen={isUserPopupOpen}
            setIsUserPopupOpen={setIsUserPopupOpen}
            navigateToPage={(page, data) => {
                if (page === "viewProfile" && data?.id) {
                    navigate(`/view/${data.id}`);
                } else {
                    navigate(`/${page}`);
                }
            }}
        />
    );
}

function ViewProfileWrapper() {
    const { id } = useParams();
    return <ViewProfile id={id} />;
}

export default RouterApp;
