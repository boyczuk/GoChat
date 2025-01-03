package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open(
		"postgres",
		"host=localhost user=postgres password=temppassword dbname=chat_app sslmode=disable",
	)
	if err != nil {
		log.Fatal(err)
	}
}

func getLoggedInUser(c *gin.Context) {
	// get token from cookies
	sessionToken, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized,
			gin.H{"error": "You are not logged in."},
		)
		return
	}

	var userID int

	// Check user_id associated with sessionToken
	err = db.QueryRow(
		"SELECT user_id FROM sessions WHERE session_token = $1", sessionToken,
	).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid session or session expired."})
		return
	}

	var username string
	err = db.QueryRow(
		"SELECT username FROM users WHERE id = $1", userID,
	).Scan(&username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retreive uer info."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"username": username})
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
	r.Run(":8080")
}
