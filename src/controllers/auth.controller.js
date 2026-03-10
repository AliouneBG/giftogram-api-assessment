const db=require("../db/connection");
const bcrypt=require("bcrypt");
async function registerUser(req,res){
    try{
        const{email, first_name, last_name, password}=req.body;
        if(!email||!first_name||!last_name||!password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        const[existingUsers]=await db.query("SELECT id FROM users WHERE email=?",[email]);
        if (existingUsers.length>0){
            return res.status(409).json({
                message:"User already exists"
            });
        }
        const password_hash=await bcrypt.hash(password,10);
        const[result]=await db.query(`INSERT INTO users (email, first_name, last_name, password_hash)
       VALUES (?, ?, ?, ?)`,
      [email, first_name, last_name, password_hash]

        );
        return res.status(201).json({
            message:"User registered successfully",
            userId:result.insertId
        });
    }catch(error){
        console.error("Register error:",error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }
}
module.exports={registerUser};