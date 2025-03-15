import axios from "axios";
import pfp from "../components/images/pfptemp.jpg";
import { useEffect, useState } from "react";
import './ViewProfile.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function ViewProfile({ id }) {
    const [profileName, setProfileName] = useState("Loading...");
    const [profilePicture, setProfilePicture] = useState(pfp);
    const [profileBio, setProfileBio] = useState("No bio yet!");

    console.log(id);

    useEffect(() => {
        axios.get(`${API_URL}/getUser/${id}`, { withCredentials: true })
            .then((response) => {
                const { username, bio, profile_picture } = response.data;
                console.log("bio:",bio);
                setProfileName(username || "Loading...");
                setProfileBio(bio);
                setProfilePicture(profile_picture ? `data:image/jpeg;base64,${profile_picture}` : pfp)
            })
            .catch((error) => console.error("Error fetching user info:", error));
    }, []);

    return (
        <div className="user-page">

            <div className="user-headboard">
                <div className="user-profilepicture">

                    <img src={profilePicture} alt="Profile" />
                </div>

                <div className="user-info">
                    <div className="name-interaction">
                        <h1>{profileName}</h1>
                    </div>

                    <div className="user-stats">
                        <p>Followers will go here!</p>
                    </div>

                    <div className="user-bio">
                        {profileBio}
                    </div>
                </div>
            </div>
            <h1>Posts coming soon!</h1>
            <div className="user-posts">

            </div>

        </div>
    )
}

export default ViewProfile;