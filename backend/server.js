const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(__dirname, "users.json");

// Ensure file exists
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

// Register route
app.post("/api/auth/register", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const users = JSON.parse(fs.readFileSync(usersFile));

    // Check duplicate
    if (users.find((u) => u.username === username)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Save new user
    users.push({ username, password });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(usersFile));

    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // For now, fake a token
    res.json({ token: "fake-jwt-token" });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
