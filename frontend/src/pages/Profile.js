import { useEffect, useState } from "react";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
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
            .get("http://3.17.175.47:8080/me", { withCredentials: true })
            .then((response) => {
                const { username, bio, profile_picture } = response.data;
                setUsername(username || "Loading...");
                setBio(bio || "Hey there!");
                setProfilePicture(
                    profile_picture ? `data:image/jpeg;base64,${profile_picture}` : pfp
                );
            })
            .catch((error) => console.error("Error fetching user info:", error));
    }, []);

    const handleSaveUsername = () => {
        axios
            .post("http://3.17.175.47:8080/update-username", { username: newUsername }, { withCredentials: true })
            .then(() => {
                setUsername(newUsername);
                setIsEditingUsername(false);
                setSuccessMessage("Username updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => console.error("Error updating username:", error));
    };

    const handleSaveBio = () => {
        axios
            .post("http://3.17.175.47:8080/update-bio", { bio }, { withCredentials: true })
            .then(() => {
                setSuccessMessage("Bio updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => console.error("Error updating bio:", error));
    };

    const handleProfilePictureChange = (event) => {
        const formData = new FormData();
        formData.append("profile_picture", event.target.files[0]);

        axios
            .post("http://3.17.175.47:8080/update-profile-picture", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(() => {
                setProfilePicture(URL.createObjectURL(event.target.files[0]));
                setSuccessMessage("Profile picture updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => console.error("Error updating profile picture:", error));
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <label className="profile-picture">
                    <img src={profilePicture} alt="Profile" />
                    <FaCamera className="upload-icon" />
                    <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                </label>

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
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Enter your bio"
                    />
                    <button onClick={handleSaveBio}>Save Bio</button>
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
