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
module.exports={sendMessage}