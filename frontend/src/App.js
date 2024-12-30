import { useState } from "react";
import HomeLoggedIn from "./pages/HomeLoggedIn";
import HomeLoggedOut from "./pages/HomeLoggedOut";
import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="App">
			{/* If logged in display top, otherwise display logged out until login success and set it to true */}
            {isLoggedIn ? (
                <HomeLoggedIn />
            ) : (
                <HomeLoggedOut onLoginSuccess={() => setIsLoggedIn(true)} />
            )}
        </div>
    );
}

export default App;
