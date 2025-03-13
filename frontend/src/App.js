import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import LogoutPopup from "./components/LogoutPopup";
import HomeLoggedIn from "./pages/HomeLoggedIn";
import HomeLoggedOut from "./pages/HomeLoggedOut";
import ViewProfile from "./pages/ViewProfile";
import "./App.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState("messages");
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
    const [pageData, setPageData] = useState(null);


    useEffect(() => {
        // Call to get credentials, if logged in load regular page, if not go to login page
        axios
            .get(`${API_URL}/me`, { withCredentials: true })
            .then((response) => {
                console.log("User session active:", response.data);
                setIsLoggedIn(true);
            })
            .catch((err) => {
                console.log("No active session:", err);
                setIsLoggedIn(false);
            })
    }, []);

    const navigateToPage = (page, data = null) => {
        setCurrentPage(page);
        setPageData(data);
    }

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
                    }} setIsUserPopupOpen={setIsUserPopupOpen} />

                    {/* Render the selected page */}
                    {currentPage === "messages" && <HomeLoggedIn
                        isUserPopupOpen={isUserPopupOpen}
                        setIsUserPopupOpen={setIsUserPopupOpen}
                        navigateToPage={navigateToPage} />}
                    {currentPage === "profile" && <Profile />}
                    {currentPage === "viewProfile" && <ViewProfile id={pageData?.id} />}
                    {console.log("Navigating to viewProfile with ID:", pageData?.id)}
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
