import StudySession from "../models/StudySession.js";


//start a session
const startSession = async (req, res) => {
  try {
    const session = new StudySession({
      user: req.userId,
      startTime: new Date(),
      isPomodoro: req.body.isPomodoro || false,
      customPomodoroConfig: req.body.customPomodoroConfig || undefined
    });

    await session.save();
    return res.status(200).json({ success: true, session });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

//end session
const endSession = async (req, res) => {
    try {
        const session = await StudySession.findById(req.params.sessionId)
        if (!session) {
            return res.status(400).json({ message: "Session not found", success: false });
        }

        if (session.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        console.log(session)
        session.endTime = new Date();
        session.duration = Math.floor((session.endTime - session.startTime) / 1000 / 60); // in minutes
        session.completed = true;

        await session.save()
        return res.status(200).json({ success: true, session })

    } catch (error) {
        return res.status(500).json({ message: "Server Error", success: false });
    }
}

//today's sessions
const todaysSessions=async(req,res)=>{
try {
    
     const today = new Date();
    today.setHours(0, 0, 0, 0);

      const sessions = await StudySession.find({
      user: req.userId,
      startTime: { $gte: today }
    }).sort({ startTime: -1 });
    return res.status(200).json({success:true,sessions})

} catch (error) {
     return res.status(500).json({ message: "Server Error", success: false });
}
}

//weekly sessions
const weeklySessions = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // includes today as the 7th day
    sevenDaysAgo.setHours(0, 0, 0, 0); // start of the day

    const sessions = await StudySession.find({
      user: req.userId,
      startTime: { $gte: sevenDaysAgo }
    }).sort({ startTime: -1 });

    return res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

//weeky duration
const weeklyTotalDuration = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      user: req.userId,
      startTime: { $gte: sevenDaysAgo },
      completed: true  
    });

    const totalDuration = sessions.reduce((total, session) => total + (session.duration || 0), 0);

    return res.status(200).json({ success: true, message:'total duration this week', totalDuration }); // totalDuration in minutes
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

const tickFocusTime = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Authorization check
    if (session.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.focusMinutes = (session.focusMinutes || 0) + 1; // increment by 1 minute
    await session.save();

    return res.status(200).json({ success: true, focusMinutes: session.focusMinutes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};





export { startSession, endSession,todaysSessions,weeklySessions,weeklyTotalDuration,tickFocusTime };
