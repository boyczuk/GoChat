package main

import (
	"database/sql"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Creating map to store websocket clients and their associated IDs
var clients = make(map[*websocket.Conn]int)

// Channel for sending messages between clients
var broadcast = make(chan Message)

type Message struct {
	SenderID   int    `json:"sender_id"`
	ReceiverID int    `json:"receiver_id"`
	Content    string `json:"content"`
	Timestamp  string `json:"timestamp"`
}

func initDB() {
	var err error
	db, err = sql.Open(
		"postgres",
		"host=localhost user=postgres password=temppassword dbname=chat_app sslmode=disable",
	)
	if err != nil {
		panic(err)
	}
}

// WebSocket handler to manage new connections (w - sending, r - info received)
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer conn.Close()

	// Get session token from cookies
	sessionToken, err := r.Cookie("session_token")
	if err != nil {
		conn.WriteMessage(websocket.CloseMessage, []byte("Unauthorized: No session token"))
		return
	}

	// Retrieve the user Id assocaited with session token
	var userID int
	err = db.QueryRow(
		"SELECT user_id FROM sessions WHERE session_token = $1", sessionToken.Value,
	).Scan(&userID)
	if err != nil {
		conn.WriteMessage(websocket.CloseMessage, []byte("Unauthorized: Invalid session"))
		return
	}

	// Add the connection to the clients map
	clients[conn] = userID
	fmt.Printf("User connected: %d\n", userID)

	// Wait for messages from client
	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Printf("Error reading message: %v\n", err)
			// Delete the element using key: conn from map clients
			delete(clients, conn)
			break
		}

		// Add sender id to message
		msg.SenderID = userID
		msg.Timestamp = time.Now().Format("2006-01-02 15:04:05")
		// Save the message to DB
		saveMessageToDB(msg)
		// Send message to other user
		sendMessageToReceiver(msg)
	}
}

func saveMessageToDB(msg Message) {
	_, err := db.Exec(
		"INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)",
		msg.SenderID, msg.ReceiverID, msg.Content,
	)
	if err != nil {
		fmt.Printf("Error saving message to DB: %v\n", err)
	}
}

func sendMessageToReceiver(msg Message) {
	for client, id := range clients {
		if id == msg.ReceiverID {
			// Send to Receiver
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Printf("Error sending to receiver (User %d): %v\n", msg.ReceiverID, err)
				client.Close()
				delete(clients, client)
			} else {
				fmt.Printf("Message sent to receiver (User %d).\n", msg.ReceiverID)
			}
		}

		if id == msg.SenderID {
			// Send back to Sender
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Printf("Error sending to sender (User %d): %v\n", msg.SenderID, err)
				client.Close()
				delete(clients, client)
			} else {
				fmt.Printf("Message sent to sender (User %d).\n", msg.SenderID)
			}
		}
	}
}

func broadcaster() {
	for {
		// Wait for message from broadcast channel
		msg := <-broadcast

		// Iterate through all connected clients (maybe not the best way to do this)
		for client, userID := range clients {
			// Send message only to intended receiver
			if userID == msg.ReceiverID {
				err := client.WriteJSON(msg)
				if err != nil {
					fmt.Printf("Error sending message to client: %v\n", err)
					client.Close()
					delete(clients, client)
				}
			}
		}
	}
}

// Inside getLoggedInUser
func getLoggedInUser(c *gin.Context) {
	sessionToken, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not logged in"})
		return
	}

	var userID int
	var username, bio string
	var profilePicture []byte

	// Fetch user details, including the profile picture
	err = db.QueryRow(
		"SELECT users.id, users.username, users.bio, users.profile_picture FROM sessions JOIN users ON sessions.user_id = users.id WHERE session_token = $1",
		sessionToken,
	).Scan(&userID, &username, &bio, &profilePicture)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
		return
	}

	var encodedProfilePicture string
	if profilePicture != nil {
		encodedProfilePicture = base64.StdEncoding.EncodeToString(profilePicture)
	}

	// Send data to the client
	c.JSON(http.StatusOK, gin.H{
		"user_id":         userID,
		"username":        username,
		"bio":             bio,
		"profile_picture": encodedProfilePicture, // Base64 encoded string
	})
}

func logoutUser(c *gin.Context) {
	sessionToken, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(
			http.StatusUnauthorized,
			gin.H{"error": "You are not logged in."},
		)
		return
	}

	_, err = db.Exec("DELETE FROM sessions WHERE session_token = $1", sessionToken)
	if err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": "Failed to log out."},
		)
		return
	}

	c.SetCookie("session_token", "", -1, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully."})
}

func loginUser(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(
			http.StatusBadRequest,
			gin.H{"error": "Invalid input."},
		)
		return
	}

	var dbPasswordHash string
	var userID int

	err := db.QueryRow(
		"SELECT id, password_hash FROM users WHERE username = $1", req.Username,
	).Scan(&userID, &dbPasswordHash)

	if err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": "Invalid username or password."},
		)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbPasswordHash), []byte(req.Password))
	if err != nil {
		c.JSON(
			http.StatusUnauthorized,
			gin.H{"error": "Invalid username or password."},
		)
		return
	}

	// Random string that acts as session token
	sessionToken := uuid.New().String()

	// 24 hours from now it expires
	expiresAt := time.Now().Add(24 * time.Hour)

	_, err = db.Exec(
		"INSERT INTO sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)",
		userID, sessionToken, expiresAt,
	)

	if err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": "Failed to create session for user."},
		)
		return
	}

	c.SetCookie(
		"session_token",
		sessionToken,
		3600*24,
		"/",
		"localhost",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{"message": "Login successful."})
}

// 'c' contains req http request information
func registerUser(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// set req struct equal to info in http request
	if err := c.BindJSON(&req); err != nil {
		// Returns JSON formatted response
		c.JSON(
			http.StatusBadRequest,
			gin.H{"error": "Invalid input."},
		)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": "Failed to hash password."},
		)
		return
	}
	_, err = db.Exec(
		"INSERT INTO users (username, password_hash) VALUES ($1, $2)",
		req.Username,
		hashedPassword,
	)
	if err != nil {
		c.JSON(http.StatusConflict,
			gin.H{"error": "User already exists."},
		)
		return
	}

	// If no errors raised user successfully registered!
	c.JSON(
		http.StatusOK,
		gin.H{"message": "User registered successfully!"},
	)
}

type User struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	ProfilePicture string `json:"profile_picture"`
}

func getUsers(c *gin.Context) {
	rows, err := db.Query("SELECT id, username FROM users")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users."})
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning user data."})
			return
		}
		user.ProfilePicture = "/static/images/pfptemp.jpg"
		users = append(users, user)
	}

	c.JSON(http.StatusOK, users)
}

func saveMessage(c *gin.Context) {
	var msg Message
	if err := c.BindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := db.Exec(
		"INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES ($1, $2, $3, $4)",
		msg.SenderID, msg.ReceiverID, msg.Content, msg.Timestamp,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message saved successfully"})
}

func getChatHistory(c *gin.Context) {
	senderID := c.Query("sender_id")
	receiverID := c.Query("receiver_id")

	if senderID == "" || receiverID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing sender_id or receiver_id"})
		return
	}

	rows, err := db.Query(`
        SELECT sender_id, receiver_id, content, timestamp 
        FROM messages 
        WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
        ORDER BY timestamp ASC
    `, senderID, receiverID)

	if err != nil {
		fmt.Printf("Error fetching chat history: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat history"})
		return
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		if err := rows.Scan(&msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.Timestamp); err != nil {
			fmt.Printf("Error scanning message data: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning message data"})
			return
		}
		messages = append(messages, msg)
	}

	c.JSON(http.StatusOK, messages)
}

func updateUsername(c *gin.Context) {
	sessionToken, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized."})
		return
	}

	var userID int
	err = db.QueryRow(
		"SELECT user_id FROM sessions WHERE session_token = $1",
		sessionToken,
	).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
		return
	}

	var req struct {
		Username string `json:"username"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err = db.Exec("UPDATE users SET username = $1 WHERE id = $2", req.Username, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update username"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Username updated"})
}

func updateBio(c *gin.Context) {
	sessionToken, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var userID int
	err = db.QueryRow(
		"SELECT user_id FROM sessions WHERE session_token = $1",
		sessionToken,
	).Scan(&userID)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invaid session"})
		return
	}

	var req struct {
		Bio string `json:"bio"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err = db.Exec("UPDATE users SET bio = $1 WHERE id = $2", req.Bio, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update bio"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "bio updated"})

}

func updateProfilePicture(c *gin.Context) {
	sessionToken, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var userID int
	err = db.QueryRow(
		"SELECT user_id FROM sessions WHERE session_token = $1",
		sessionToken,
	).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid session"})
		return
	}

	file, _, err := c.Request.FormFile("profile_picture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse file"})
		return
	}
	defer file.Close()

	imageData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read file"})
		return
	}

	_, err = db.Exec("UPDATE users SET profile_picture = $1 WHERE id = $2", imageData, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile picture"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile picture updated successfully"})

}

func main() {
	// Connect to DB
	initDB()

	// Create gin middleware
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Route for registering user
	r.POST("/register", registerUser)
	r.POST("/login", loginUser)
	r.POST("/logout", logoutUser)
	r.GET("/me", getLoggedInUser)
	r.GET("/users", getUsers)
	r.POST("/messages", saveMessage)
	r.GET("/messages", getChatHistory)
	r.POST("/update-username", updateUsername)
	r.POST("/update-bio", updateBio)
	r.POST("/update-profile-picture", updateProfilePicture)

	r.Static("/static", "./frontend/public")

	r.GET("/ws", func(c *gin.Context) {
		handleWebSocket(c.Writer, c.Request)
	})

	go broadcaster()

	r.Run(":8080")
}
