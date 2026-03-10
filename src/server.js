const db = require("./db/connection");

async function testDB() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("Database connected");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}

testDB();