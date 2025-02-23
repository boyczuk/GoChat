import UserList from '../components/UserList';
import MessagingBox from '../components/MessagingBox';
import { useEffect, useState } from "react";
import axios from "axios";
import './HomeLoggedIn.css';
import UserProfileCard from '../components/UserProfileCard';

function HomeLoggedIn() {
    const [userId, setUserId] = useState(null);
    const [receiverId, setReceiverId] = useState(null);

    useEffect(() => {
        axios
            .get("http://3.17.175.47:8080/me", { withCredentials: true })
            .then((response) => {
                console.log("Fetched userId:", response.data.user_id); // Debug
                setUserId(response.data.user_id);
            })
            .catch((err) => console.error("Error fetching user ID:", err));
    }, []);

    useEffect(() => {
        console.log("Updated userId:", userId, "Updated receiverId:", receiverId); // Debug
    }, [userId, receiverId]);
    
    
    

    console.log("userId:", userId, "receiverId:", receiverId); // Debug

    return (
        <div className="main-page">
            <div className="container">
                <div className="users-window">
                    {/* <UserProfileCard /> */}
                    <UserList setReceiverId={setReceiverId} />
                </div>
                <div className="message-window">
                    {userId && receiverId ? (
                        <MessagingBox userId={userId} receiverId={receiverId} />
                    ) : (
                        <p>Select a user to start messaging</p>
                    )}
                </div>
            </div>
        </div>
    );
}


export default HomeLoggedIn;
