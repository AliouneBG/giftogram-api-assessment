const db = require("../db/connection");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  try {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({
        error_code: 100,
        error_title: "Validation Error",
        error_message: "All fields are required"
      });
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error_code: 101,
        error_title: "Registration Failure",
        error_message: "User already exists"
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)",
      [email, first_name, last_name, password_hash]
    );

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      error_code: 500,
      error_title: "Server Error",
      error_message: "Internal server error"
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error_code: 100,
        error_title: "Validation Error",
        error_message: "Email and password are required"
      });
    }

    const [users] = await db.query(
      "SELECT id, email, first_name, last_name, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error_code: 102,
        error_title: "Login Failure",
        error_message: "Invalid email or password"
      });
    }

    const user = users[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({
        error_code: 102,
        error_title: "Login Failure",
        error_message: "Invalid email or password"
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error_code: 500,
      error_title: "Server Error",
      error_message: "Internal server error"
    });
  }
}

module.exports = { registerUser, loginUser };