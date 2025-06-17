import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  totalStudyTime: {
    type: Number,
    default: 0 // in minutes
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Group=mongoose.model.Group||mongoose.model('Group',groupSchema)
export default Group