const db=require('../db/connection')
async function sendMessage(req,res){
    try{
        const {sender_id,receiver_id,message_body}=req.body;
        if(sender_id==null||receiver_id==null||message_body==null){
            return res.status(400).json({
                error_code:100,
                error_title:"Validation Error",
                error_message:"sender_id, receiver_id, and message_body are required"
            });
        }
         const [sender] = await db.query(
            "SELECT id FROM users WHERE id = ?",
            [sender_id]
        );

        if(sender.length === 0){
            return res.status(404).json({
                error_code:101,
                error_title:"Sender Not Found",
                error_message:"Sender does not exist"
            });
        }

        const [receiver] = await db.query(
            "SELECT id FROM users WHERE id = ?",
            [receiver_id]
        );

        if(receiver.length === 0){
            return res.status(404).json({
                error_code:102,
                error_title:"Receiver Not Found",
                error_message:"Receiver does not exist"
            });
        }
        const [result] = await db.query(
      "INSERT INTO messages (sender_id, receiver_id, message_body) VALUES (?, ?, ?)",
      [sender_id, receiver_id, message_body]
    );

    return res.status(201).json({
      message: "Message sent successfully",
      message_id: result.insertId
    });

  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }

}

async function viewMessages(req, res) {
  try {
    const { user_id_1, user_id_2 } = req.query;

    if (user_id_1 == null || user_id_2 == null) {
      return res.status(400).json({
        error_code: 100,
        error_title: "Validation Error",
        error_message: "user_id_1 and user_id_2 are required"
      });
    }

    const [messages] = await db.query(
      `
      SELECT
        id AS message_id,
        sender_id AS sender_user_id,
        message_body AS message,
        UNIX_TIMESTAMP(created_at) AS epoch
      FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
      `,
      [user_id_1, user_id_2, user_id_2, user_id_1]
    );

    return res.status(200).json({
      messages
    });
  } catch (error) {
    console.error("View messages error:", error);
    return res.status(500).json({
      error_code: 500,
      error_title: "Server Error",
      error_message: "Internal server error"
    });
  }
}

module.exports={sendMessage,viewMessages}