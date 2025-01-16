import { useRef, useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import "./styles/MessagingBox.css";

function MessagingBox({ userId, receiverId }) {
    const messagesEndRef = useRef(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/ws`);
        setSocket(ws);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Incoming WebSocket message:", message); // Debug

            setMessageHistory((prevHistory) => [...prevHistory, message]);
        };


        return () => ws.close();
    }, []);

    useEffect(() => {
        if (receiverId) {
            fetch(`http://localhost:8080/messages?sender_id=${userId}&receiver_id=${receiverId}`)
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
                        setMessageHistory(sortedData);
                    } else {
                        console.error("Unexpected response:", data);
                        setMessageHistory([]);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching chat history:", error);
                    setMessageHistory([]);
                });
        }
    }, [receiverId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messageHistory]);

    return (
        <div className="messaging-box">
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
                            {`${message.sender_id === userId ? "You" : `User ${message.sender_id}`}: ${message.content
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
