import { useState } from "react";
import './styles/MessageInput.css';

function MessageInput() {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubmit = () => {
        console.log("Input value: ", inputValue);
        setInputValue("");
    }

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
                placeholder="Mesage..."
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    )
}

export default MessageInput;