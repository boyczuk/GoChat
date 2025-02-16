import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import LogoutPopup from "./components/LogoutPopup";
import HomeLoggedIn from "./pages/HomeLoggedIn";
import HomeLoggedOut from "./pages/HomeLoggedOut";
import "./App.css";
import axios from "axios";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState("messages");
    const [isPopupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        // Call to get credentials, if logged in load regular page, if not go to login page
        axios
            .get("http://3.17.175.47:8080/me", { withCredentials: true })
            .then((response) => {
                console.log("User session active:", response.data);
                setIsLoggedIn(true);
            })
            .catch((err) => {
                console.error("No active session:", err);
                setIsLoggedIn(false);
            })
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setPopupOpen(false);
        setCurrentPage("messages");
        console.log("User logged out");
    }

    return (
        <div className="App">
            {/* If logged in display top, otherwise display logged out until login success and set it to true */}
            {isLoggedIn ? (
                <div className="logged-in">

                    <Navbar setCurrentPage={(page) => {
                        if (page === "logout") {
                            setPopupOpen(true);
                        } else {
                            setCurrentPage(page);
                        }
                    }} />

                    {/* Render the selected page */}
                    {currentPage === "messages" && <HomeLoggedIn />}
                    {currentPage === "profile" && <Profile />}
                    <LogoutPopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} onLogout={handleLogout} />
                </div>
            ) : (
                <div className="logged-out">
                    <HomeLoggedOut onLoginSuccess={() => setIsLoggedIn(true)} />
                </div>
            )}

        </div>
    );
}

export default App;
