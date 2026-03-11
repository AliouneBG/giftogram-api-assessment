const app = require("./app");
const db = require("./db/connection");

const PORT = 3000;

async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();