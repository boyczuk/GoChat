import { useEffect, useState } from 'react';
import axios from 'axios';
import pfp from "../components/images/pfptemp.jpg";
import "./Profile.css";

function Profile() {
    const [profilePicture, setProfilePicture] = useState(pfp);
    const [username, setUsername] = useState("Loading...");
    const [bio, setBio] = useState("Hey there!");
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8080/me", { withCredentials: true })
            .then((response) => {
                setUsername(response.data.username);
                console.log(response.data);
            })
            .catch((error) => console.error("Error fetching user info:", error));
    }, []);

    const handleSaveUsername = () => {
        axios
            .post(
                "http://localhost:8080/update-username",
                { username: newUsername },
                { withCredentials: true }
            )
            .then((response) => {
                setUsername(newUsername);
                setIsEditingUsername(false);
                setSuccessMessage("Username updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => console.error("Error updating username:", error));
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-picture">
                    <img src={profilePicture} alt="Profile" />
                </div>
                <h1 className="profile-name">
                    {isEditingUsername ? (
                        <div>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter new username"
                            />
                            <button onClick={handleSaveUsername}>Save</button>
                            <button onClick={() => setIsEditingUsername(false)}>Cancel</button>
                        </div>
                    ) : (
                        <>
                            {username}{" "}
                            <button onClick={() => {
                                setIsEditingUsername(true);
                                setNewUsername(username);
                            }}>
                                Edit
                            </button>
                        </>
                    )}
                </h1>
                <p className="profile-username">@{username}</p>
                {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
            <div className="profile-details">
                <div className="detail-item">
                    <p className="detail-label">Bio:</p>
                    <p className="detail-value">
                        {bio}
                    </p>
                </div>
                <div className="detail-item">
                    <p className="detail-label">Joined:</p>
                    <p className="detail-value">January 2025</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
