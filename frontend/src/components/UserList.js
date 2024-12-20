import defaultProfilePicture from './images/pfptemp.jpg';
import './styles/UserList.css'

function UserList() {
    const users = [
        {
            name: "Adlai",
            profilePicture: defaultProfilePicture
        },
        {
            name: "Dylan",
            profilePicture: defaultProfilePicture
        },
        {
            name: "Ella",
            profilePicture: defaultProfilePicture
        },
        {
            name: "Amelia",
            profilePicture: defaultProfilePicture
        },
        {
            name: "Avi",
            profilePicture: defaultProfilePicture
        }
    ];

    return (
        <div className="user-list">
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        <img src={user.profilePicture} alt={`${user.name}'s profile`} width="50" height="50" />
                        <p>{user.name}</p>
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default UserList;