const db = require("../db/connection");

async function listUsers(req, res) {
  try {
    const [users] = await db.query(
      "SELECT id, email, first_name, last_name, created_at FROM users"
    );

    return res.status(200).json({
      users
    });
  } catch (error) {
    console.error("List users error:", error);
    return res.status(500).json({
      error_code: 500,
      error_title: "Server Error",
      error_message: "Internal server error"
    });
  }
}

module.exports = { listUsers };