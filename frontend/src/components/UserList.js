import { useEffect, useState } from "react";
import axios from "axios";
import pfptemp from './images/pfptemp.jpg';
import './styles/UserList.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function UserList({ setReceiverId }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [myUserId, setMyUserId] = useState(null);

    useEffect(() => {
        // Fetch all users
        axios
            .get(`${API_URL}/users`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => console.error("Error fetching users:", error));

        axios
            .get(`${API_URL}/me`, { withCredentials: true }) 
            .then((response) => {
                setMyUserId(response.data.user_id);
            })
            .catch((error) => console.error("Error fetching user ID:", error));
    }, []);

    const handleUserClick = (userId) => {
        setSelectedUserId(userId);
        setReceiverId(userId); 
    };

    return (
        <div className="user-list">
            <ul>
                {users
                    // Find smarter way to do this later
                    .filter((user) => user.id !== myUserId)
                    .map((user) => (
                        <li
                            key={user.id}
                            onClick={() => handleUserClick(user.id)}
                            className={user.id === selectedUserId ? "selected-user" : ""}
                        >
                            <img
                                src={pfptemp}
                                alt={`${user.name}'s profile`}
                                width="50"
                                height="50"
                            />
                            <p>{user.name}</p>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default UserList;
