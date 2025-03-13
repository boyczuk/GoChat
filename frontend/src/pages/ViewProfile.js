import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function viewProfile({ id }) {
    console.log(id);

    return (
        <div className="user-page">
            <h1>User {id}</h1>
        </div>
    )
}

export default viewProfile;