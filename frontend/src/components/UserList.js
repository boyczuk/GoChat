import { useEffect, useState } from "react";
import axios from "axios";
import pfptemp from './images/pfptemp.jpg';
import './styles/UserList.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

let cachedUsers = null;
let cachedMyId = null;


function UserList({ setReceiverId }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [myUserId, setMyUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fake data for mobile testing
    // useEffect(() => {
    //     setMyUserId(1);

    //     // Simulated user list
    //     const fakeUsers = [
    //         { id: 2, name: "Alice" },
    //         { id: 3, name: "Bob" },
    //         { id: 4, name: "Charlie" },
    //         { id: 5, name: "Diana" },
    //         { id: 6, name: "Ethan" },
    //         { id: 7, name: "Fiona" },
    //         { id: 8, name: "George" },
    //         { id: 9, name: "Hannah" },
    //         { id: 10, name: "Isaac" },
    //         { id: 11, name: "Jade" },
    //         { id: 12, name: "Kyle" },
    //         { id: 13, name: "Lana" },
    //         { id: 14, name: "Mason" },
    //         { id: 15, name: "Nina" },
    //         { id: 16, name: "Omar" },
    //         { id: 17, name: "Priya" }
    //     ];

    //     setUsers(fakeUsers);
    // }, []);


    useEffect(() => {
        const fetchData = async () => {
            if (cachedUsers && cachedMyId) {
                setUsers(cachedUsers);
                setMyUserId(cachedMyId);
                setLoading(false);
                return;
            }

            try {
                const [meRes, usersRes] = await Promise.all([
                    axios.get(`${API_URL}/me`, { withCredentials: true }),
                    axios.get(`${API_URL}/users`, { withCredentials: true }),
                ])
                setLoading(false);

                const myId = meRes.data.user_id;
                setMyUserId(myId);
                cachedMyId = myId;

                cachedUsers = usersRes.data;
                setUsers(usersRes.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchData();
    }, []);



    const handleUserClick = (userId) => {
        setSelectedUserId(userId);
        setReceiverId(userId);
    };

    if (loading) {
        return <div className="user-list">Loading users...</div>;
    }
    
    return (
        <div className="user-list">
            <h1>Friends</h1>
            <ul>
                {users
                    .filter((user) => user.id !== myUserId)
                    .map((user) => (
                        <li
                            key={user.id}
                            onClick={() => handleUserClick(user.id)}
                            className={user.id === selectedUserId ? "selected-user" : ""}
                        >
                            <img
                                src={user.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : pfptemp}
                                alt={`${user.name}'s profile`}
                                width="50"
                                height="50"
                                loading="lazy"
                            />
                            <p>{user.name}</p>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default UserList;
