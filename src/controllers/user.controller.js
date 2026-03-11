const db = require("../db/connection");

async function listUsers(req, res) {
  try {
    const { requester_user_id } = req.query;

    if (requester_user_id == null) {
      return res.status(400).json({
        error_code: 100,
        error_title: "Validation Error",
        error_message: "requester_user_id is required"
      });
    }

    const [users] = await db.query(
      "SELECT id, email, first_name, last_name FROM users WHERE id != ?",
      [requester_user_id]
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