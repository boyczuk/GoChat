# Use an official lightweight Go image
FROM golang:1.23-alpine

# Set working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum for dependency installation
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application
COPY . .

# Set the database environment variable
ENV DATABASE_URL="host=db user=postgres password=temppassword dbname=chat_app sslmode=disable"

# Build the Go application
RUN go build -o server

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["/app/server"]
