import { useState, useEffect } from "react";
import HomeLoggedIn from "./pages/HomeLoggedIn";
import HomeLoggedOut from './pages/HomeLoggedOut';
import './App.css';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const sessionToken = document.cookie.includes("session_token");
		setIsLoggedIn(sessionToken);
	}, []);

	return (
		<div className="App">
			{isLoggedIn ? <HomeLoggedIn /> : <HomeLoggedOut />}
		</div>	
  	);
}

export default App;
