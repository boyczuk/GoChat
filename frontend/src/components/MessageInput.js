import { useState } from "react";
import './styles/MessageInput.css';

function MessageInput({ socket, senderId, receiverId }) {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        console.log("Sender ID:", senderId, "Receiver ID:", receiverId); // Debug
        const message = {
            sender_id: senderId,
            receiver_id: receiverId,
            content: inputValue,
            timestamp: new Date().toISOString(),
        };

        if (socket && inputValue.trim() !== "" && receiverId) {
            socket.send(JSON.stringify(message));
            fetch("http://localhost:8080/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(message),
            }).catch((error) => console.error("Error saving message:", error));

            setInputValue("");
        }
    };



    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="input-container">
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
            />
            <button onClick={handleSubmit} disabled={!receiverId}>
                Send
            </button>
        </div>
    );
}

export default MessageInput;
