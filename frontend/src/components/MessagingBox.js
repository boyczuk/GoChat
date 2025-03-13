import { useRef, useEffect, useState } from "react";
import axios from 'axios';
import MessageInput from "./MessageInput";
import pfp from "../components/images/pfptemp.jpg";
import "./styles/MessagingBox.css";

const WS_API_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8080";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function MessagingBox({ userId, receiverId }) {
    const messagesEndRef = useRef(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [socket, setSocket] = useState(null);
    const [receiverName, setReceiverName] = useState(null);
    const [profilePicture, setProfilePicture] = useState(pfp);

    useEffect(() => {
        const ws = new WebSocket(`${WS_API_URL}/ws`);
        setSocket(ws);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Incoming WebSocket message:", message); // Debug

            setMessageHistory((prevHistory) => {
                const messageExists = prevHistory.some(
                    (msg) =>
                        msg.sender_id === message.sender_id &&
                        msg.receiver_id === message.receiver_id &&
                        msg.content === message.content &&
                        msg.timestamp === message.timestamp
                );

                if (!messageExists) {
                    return [...prevHistory, message];
                }

                return prevHistory; // Avoid duplicate

            });
        };


        return () => ws.close();
    }, []);

    useEffect(() => {
        if (receiverId) {
            fetch(`${API_URL}/messages?sender_id=${userId}&receiver_id=${receiverId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (Array.isArray(data)) {
                        const sortedData = data.sort(
                            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                        );
                        setMessageHistory((prevHistory) => {
                            const uniqueMessages = sortedData.filter(
                                (msg) =>
                                    !prevHistory.some(
                                        (prevMsg) =>
                                            prevMsg.sender_id === msg.sender_id &&
                                            prevMsg.receiver_id === msg.receiver_id &&
                                            prevMsg.content === msg.content &&
                                            prevMsg.timestamp === msg.timestamp
                                    )
                            );

                            return [...prevHistory, ...uniqueMessages]; // Merge history
                        });
                    } else {
                        console.error("Unexpected response:", data);
                        setMessageHistory([]);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching chat history:", error);
                    setMessageHistory([]);
                });
            axios.get(`${API_URL}/getUser/${receiverId}`, { withCredentials: true })
                .then((response) => {
                    console.log(response.data);
                    setReceiverName(response.data.username); // Assuming your API returns { id, name, email }
                    setProfilePicture(
                        response.data.profile_picture ? `data:image/jpeg;base64,${response.data.profile_picture}` : pfp
                    );
                })
                .catch((error) => {
                    console.error("Error fetching receiver's name:", error);
                    setReceiverName(`User ${receiverId}`); // Fallback
                });
        }
    }, [receiverId, userId]);



    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messageHistory]);

    return (
        <div className="messaging-box">
            <div className="receiver-info">
                <img src={profilePicture} alt="Profile" className="receiver-image" />
                <h1 className="receiver-name">{receiverName}</h1>
            </div>
            <div className="sent-messages">
                {messageHistory
                    .filter(
                        // Filters messages to ensure correct user messages are recieved
                        // Do something smarter later
                        (message) =>
                            (message.sender_id === userId && message.receiver_id === receiverId) ||
                            (message.sender_id === receiverId && message.receiver_id === userId)
                    )
                    .map((message, index) => (
                        <p
                            key={index}
                            className={message.sender_id === userId ? "right-aligned" : "left-aligned"}
                        >
                            {`${message.sender_id === userId ? "You" : receiverName}: ${message.content
                                }`}
                        </p>
                    ))}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput socket={socket} senderId={userId} receiverId={receiverId} />
        </div>
    );
}

export default MessagingBox;
