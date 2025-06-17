import mongoose from "mongoose";

const blockedSiteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BlockSite=mongoose.model.Group||mongoose.model('BlockSite',blockedSiteSchema)
export default BlockSite