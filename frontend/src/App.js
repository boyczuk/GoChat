import { useState } from "react";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import HomeLoggedIn from "./pages/HomeLoggedIn";
import HomeLoggedOut from "./pages/HomeLoggedOut";
import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState("messages");

    return (
        <div className="App">
            {/* If logged in display top, otherwise display logged out until login success and set it to true */}
            {isLoggedIn ? (
                <div className="logged-in">
                    <Navbar setCurrentPage={setCurrentPage} />

                    {/* Render the selected page */}
                    {currentPage === "messages" && <HomeLoggedIn />}
                    {currentPage === "profile" && <Profile />}
                    {currentPage === "logout" && <h1>Logging out...</h1>}
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
