import UserList from '../components/UserList';
import MessagingBox from '../components/MessagingBox';
import { useEffect, useState } from "react";
import axios from "axios";
import './HomeLoggedIn.css';
import UserProfileCard from '../components/UserProfileCard';

function HomeLoggedIn() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/me", { withCredentials: true }).then((response) => {
            setUserId(response.data.user_id);
        }).catch((err) => {
            console.log("Error");
        })
    },[]);
    
    return (
        <div className='main-page'>
            <div className='container'>
                <div className='users-window'>
                    <UserProfileCard />
                    <UserList />
                </div>
                <div className='message-window'>
                    <h1>Person</h1>
                    <MessagingBox userId={userId}/>
                </div>
            </div>
        </div>
    );
}

export default HomeLoggedIn;
