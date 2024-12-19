package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
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

	// Route for registering user
	r.POST("/register", registerUser)
	r.Run(":8080")
}
