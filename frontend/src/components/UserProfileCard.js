import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/UserProfileCard.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function UserProfileCard() {
    const [username, setUsername] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // get request to /me
        axios.get(`${API_URL}/me`, { withCredentials: true }).then((response) => {
            setUsername(response.data.username);
        }).catch((error) => {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError("An unexpected error occured.");
            }
        });
    }, []);

    return (
        <div>
            {username ? (
                <p>Welcome, {username}!</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default UserProfileCard;