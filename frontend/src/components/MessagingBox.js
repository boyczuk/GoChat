import { useRef, useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import "./styles/MessagingBox.css";

function MessagingBox({ userId, receiverId }) {
    const messagesEndRef = useRef(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://3.17.175.47:8080/ws`);
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
            fetch(`http://3.17.175.47:8080/messages?sender_id=${userId}&receiver_id=${receiverId}`)
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
