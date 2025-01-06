import { useEffect, useState } from "react";
import './styles/UserList.css';

function UserList({ setReceiverId }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/users")
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleUserClick = (userId) => {
        setSelectedUserId(userId);
        setReceiverId(userId);
    };

    return (
        <div className="user-list">
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className={user.id === selectedUserId ? "selected-user" : ""}
                    >
                        <img
                            src={user.profilePicture}
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
