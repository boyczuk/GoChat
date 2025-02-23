import React from "react";
import ReactDOM from "react-dom/client"; // Note the `/client`
import App from "./App";

// Create the root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);