# Tangle

GoChat is a **real-time messaging application** built with **Go**, **React**, **PostgreSQL**, and **WebSockets**. It allows users to **register, log in, and chat** with each other in a seamless and scalable environment.

The motivation for this project is to learn more about creating APIs in Go, practice cybersecurity implementations, and explore data visualization in the context of social media. I thought it would be really cool to map out peoples' connections as a web. I think the resulting map will show new mutual connections and sub-communities which is really fascinating.

## Features
- **User Authentication**: Secure login and registration system using session-based authentication.
- **Real-Time Messaging**: WebSockets enable real-time text messaging between users.
- **PostgreSQL Database**: Stores user data and chat history.
- **Responsive UI**: Built with React for a clean and intuitive messaging experience.
- **Scalability**: Designed to be hosted on **AWS** for production deployment.

## Photos
![image](https://github.com/user-attachments/assets/493ec0f1-c9e3-4e66-9b3f-d54c8042d967)
User profile

![image](https://github.com/user-attachments/assets/0fb27514-6c85-40f8-8ea3-9138008cb83d)
Messaging a friend

![image](https://github.com/user-attachments/assets/cd7cb9e2-b1d8-46a6-b1cd-41b11156f5ad)
Viewing a friend's profile



## Tech Stack
- **Backend**: Go (`net/http`, `gorilla/websocket`, `gorm`)
- **Frontend**: React (`Vite`, `TypeScript`)
- **Database**: PostgreSQL
- **Authentication**: Session-based auth (cookies)
- **Deployment**: Docker + AWS

## Installation
To run **GoChat** locally:

### Backend (Go)
1. Install Go and PostgreSQL.
2. Clone the repository and navigate to the backend directory.
3. Set up a `.env` file with database credentials.
4. Run the Go server using the `go run` command.

### Frontend (React)
1. Navigate to the frontend directory.
2. Install dependencies using `npm install`.
3. Start the React app using `npm run dev`.

### Containers
Alternatively, you can run `docker-compose up --build -d` to run all the existing containers in the background.

### Note
It is worth mentioning that there is additional setup that I will have to add here later once I have found a more universal way of sharing the configuration details.

## Development
The project is in **active development**, focusing on:
- **Optimizing WebSocket connections** for better performance.
- **Improving UI/UX** for a smoother chat experience.
- **Enhancing authentication** with better session handling.

## API & Authentication
- **Session-based Authentication**: Users log in via sessions, stored in secure cookies.
- **WebSocket Communication**: Handles live chat updates and message delivery.
- **User Management**: Allows account creation, login, and profile updates.

## Future Plans
- **Group Chats & Channels**: Support for multi-user conversations.
- **File Sharing**: Send images, videos, and documents.
- **Notifications**: Real-time updates for new messages and friend requests.
- **Cloud Deployment**: AWS hosting for scalability.

## Contributing
Contributions are welcome! If you'd like to improve **GoChat**, follow these steps:

1. **Fork the repository**.
2. **Create a feature branch** (`feature-new-idea`).
3. **Commit and push** your changes.
4. **Open a pull request** with a description of your update.
