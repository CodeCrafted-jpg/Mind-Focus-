import Chat from "../models/Chat.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

//creating a session
const sendMessage=async(req,res)=>{
  const { message, sessionId } = req.body;
  const currentSessionId = sessionId || uuidv4(); // create sessionId if not provided

  try {
    // Save user message
    await Chat.create({
      user: req.userId,
      role: "user",
      content: message,
      sessionId: currentSessionId,
    });

    // Send message to Groq API (LLaMA 3)
    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192", // or "llama3-70b-8192" if needed
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 
        },
      }
    );

    const reply = groqResponse.data.choices[0].message.content;

   
    await Chat.create({
      user: req.userId,
      role: "assistant",
      content: reply,
      sessionId: currentSessionId,
    });

    return res.status(200).json({
      success: true,
      reply,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error("Chat error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Error communicating with AI",
    });
  }
}



// get previous 5 sessions
 const getUserSessions = async (req, res) => {
  try {
    const sessions = await Chat.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: "$sessionId",
          lastMessageAt: { $max: "$createdAt" }
        }
      },
      { $sort: { lastMessageAt: -1 } },
      { $limit: 5 }
    ]);

    return res.status(200).json({ success: true, sessions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching sessions" });
  }
};


//get message from a session
 const getSessionMessages = async (req, res) => {
  const { sessionId } = req.params;
  if(!sessionId){
    return res.status(400).json({ success: false, message: "SessionId is needed" });
}

  try {
    const messages = await Chat.find({
      user: req.userId,
      sessionId
    }).sort({ createdAt: 1 }); 

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching messages" });
  }
};

//delete a session
const deleteSession = async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: "Session ID is required" });
  }

  try {
    const deleted = await Chat.deleteMany({
      user: req.userId,
      sessionId: sessionId
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "No messages found for this session or not authorized" });
    }

    return res.status(200).json({
      success: true,
      message: `Session '${sessionId}' deleted successfully`
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export {sendMessage,getUserSessions,getSessionMessages,deleteSession}