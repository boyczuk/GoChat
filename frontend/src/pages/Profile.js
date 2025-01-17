import pfp from "../components/images/pfptemp.jpg";
import "./Profile.css";

function Profile() {
    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-picture">
                    <img src={pfp} alt="Profile" />
                </div>
                <h1 className="profile-name">Your Name</h1>
                <p className="profile-username">@yourusername</p>
            </div>
            <div className="profile-details">
                <div className="detail-item">
                    <p className="detail-label">Email:</p>
                    <p className="detail-value">your.email@example.com</p>
                </div>
                <div className="detail-item">
                    <p className="detail-label">Bio:</p>
                    <p className="detail-value">
                        Hey! My name is x.
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
