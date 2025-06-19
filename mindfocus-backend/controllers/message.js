import Group from "../models/Group.js";
import Message from "../models/Message.js";

//sending
const sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ success: false, message: "Not a group member" });
    }

    const message = new Message({
      group: groupId,
      sender: req.userId,
      content
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username email');

    return res.status(201).json({ success: true, message: populatedMessage });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
//get all group messages
const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ success: false, message: "Not a group member" });
    }

    const messages = await Message.find({ group: groupId })
      .populate('sender', 'username email')
      .sort({ timestamp: 1 });

    return res.status(200).json({ success: true, messages });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//removing message 

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    
    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this message" });// Only the sender can delete the message
    }

    await message.deleteOne(); // or message.remove()

    return res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};






export {sendMessage,getGroupMessages,deleteMessage}