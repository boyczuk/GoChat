import { useRef, useEffect } from 'react';
import MessageInput from './MessageInput';
import './MessagingBox.css';

function MessagingBox() {
    const messageHistory = [["user1", "Hey!"], ["user1", "How's it going?"], ["user2", "Not bad what about you?"], ["user1", "Eh could be better..."], ["user2", "Why what's wrong"], ["user1", "Don't worry about it."], ["user1", "Hey!"], ["user1", "How's it going?"], ["user2", "Not bad what about you?"], ["user1", "Eh could be better..."], ["user2", "Why what's wrong"], ["user1", "Don't worry about it."], ["user1", "Hey!"], ["user1", "How's it going?"], ["user2", "Not bad what about you?"], ["user1", "Eh could be better..."], ["user2", "Why what's wrong"], ["user1", "Don't worry about it."]];

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messageHistory]);

    return (
        <div className="messaging-box">
            <div className='sent-messages' ref={messagesEndRef}>
                {messageHistory.slice().reverse().map((message, index) => (
                    <p key={index} className={message[0] === "user1" ? "right-aligned" : "left-aligned"}>
                        {`${message[0]}: ${message[1]}`}
                    </p>
                ))}
            </div>
            <MessageInput />
        </div>
    );
}

export default MessagingBox;
