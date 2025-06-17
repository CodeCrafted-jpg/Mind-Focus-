import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  sessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Chat=mongoose.model.Chat||mongoose.model('Chat',ChatMessageSchema)
export default Chat