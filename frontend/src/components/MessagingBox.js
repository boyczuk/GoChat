import { useRef, useEffect, useState } from 'react';
import MessageInput from './MessageInput';
import './styles/MessagingBox.css';

function MessagingBox({ userId, receiverId }) {
    const messagesEndRef = useRef(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/ws`);
        setSocket(ws);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessageHistory((prevHistory) => [message, ...prevHistory]);
        };

        return () => ws.close();
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messageHistory]);

    return (
        <div className="messaging-box">
            <div className="sent-messages" ref={messagesEndRef}>
                {messageHistory.slice().map((message, index) => (
                    <p
                        key={index}
                        className={message.sender_id === userId ? "right-aligned" : "left-aligned"}
                    >
                        {`${message.sender_id === userId ? "You" : `User ${message.sender_id}`}: ${message.content}`}
                    </p>
                ))}
            </div>

            <MessageInput socket={socket} senderId={userId} receiverId={receiverId} />
        </div>
    );
}

export default MessagingBox;
