import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  duration: {
    type: Number,  // in minutes
    default: 0
  },
  focusMinutes: {
    type: Number, // ✅ ONLY focus time (excludes breaks)
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  isPomodoro: {
    type: Boolean,
    default: false
  },
  customPomodoroConfig: {
    focusTime: Number,
    shortBreak: Number,
    longBreak: Number,
    totalDuration: Number
  }
});

const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema);
export default StudySession;
