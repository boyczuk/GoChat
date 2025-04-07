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
                return;
            }

            try {
                const meRes = await axios.get(`${API_URL}/me`, { withCredentials: true });
                const myId = meRes.data.user_id;
                setMyUserId(myId);
                cachedMyId = myId;

                const usersRes = await axios.get(`${API_URL}/users`);
                const rawUsers = usersRes.data;

                const enrichedUsers = await Promise.all(
                    rawUsers.map(async (user) => {
                        try {
                            const res = await axios.get(`${API_URL}/getUser/${user.id}`, {
                                withCredentials: true,
                            });
                            const { profile_picture } = res.data;
                            return {
                                ...user,
                                profile_picture: profile_picture
                                    ? `data:image/jpeg;base64,${profile_picture}`
                                    : pfptemp,
                            };
                        } catch {
                            return { ...user, profile_picture: pfptemp };
                        }
                    })
                );

                setUsers(enrichedUsers);
                cachedUsers = enrichedUsers;
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

    return (

        <div className="user-list">
            <h1>Friends</h1>
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
                                src={user.profile_picture || pfptemp}
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
