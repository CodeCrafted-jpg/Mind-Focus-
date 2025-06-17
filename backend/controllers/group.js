import Group from "../models/Group.js";
import User from "../models/user.js";
import StudySession from "../models/StudySession.js";

//create a group
const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body
        if (!name) {
            return res.status(400).json({ success: false, message: "Group name is required" });
        }
        const newGroup = new Group({
            name,
            description,
            creator: req.userId,
            members: [req.userId]
        });

        await newGroup.save();

        const populatedGroup = await Group.findById(newGroup._id)
            .populate('creator', 'username email')
            .populate('members', 'username email');
        return res.status(200).json({ success: true, group: populatedGroup })


    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}


//joining a group 
const joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId)
        if (!group) {
            return res.status(402).json({ success: false, message: "Cant find group" })

        }
        if (group.members.includes(req.userId)) {
            return res.status(400).json({ message: 'Already a member of this group' });
        }

        group.members.push(req.userId);
        await group.save();

        const populatedGroup = await Group.findById(group._id)
            .populate('creator', 'username email')
            .populate('members', 'username email');
        return res.status(200).json({ success: true, group: populatedGroup })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}
//leave Group
const leaveGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        group.members = group.members.filter(memberId => memberId.toString() !== req.userId);
        await group.save();

        return res.status(200).json({ success: true, message: "Left group successfully", group });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

//Study session of members
const groupFeed = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        const sessions = await StudySession.find({
            user: { $in: group.members },
            completed: true
        }).sort({ startTime: -1 });

        return res.status(200).json({ success: true, sessions });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

//group status
const groupStatus = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId)
        if (!group) {
            return res.status(402).json({ success: false, message: "Cant find group" })

        }
        const populatedGroup = await Group.findById(group._id)
            .populate('creator', 'username email')
            .populate('members', 'username email');
        return res.status(200).json({ success: true, group: populatedGroup })


    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}

//get groups user is in
const myGroups=async (req,res)=>{
    try {
    const groups = await Group.find({
      $or: [
        { creator: req.userId },
        { members: req.userId }
      ]
    }).populate('creator', 'username email')
      .populate('members', 'username email')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ message: 'Error fetching groups' });
  }
}
//get all available groups
const allGroupsUserisNotaPartOf = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.userId;

    console.log("Search:", search);
    console.log("User ID:", userId);

    let query = {
      members: { $ne: userId }
    };

    if (search && search.trim() !== "") {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    console.log("Final MongoDB Query:", query);

    const groups = await Group.find(query)
      .populate("creator", "username email")
      .populate("members", "username email")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    console.error("Error fetching available groups:", err);
    res.status(500).json({ message: "Error fetching groups" });
  }
};

const searchGroups = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== "") {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const groups = await Group.find(query)
      .populate("creator", "username email")
      .populate("members", "username email")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ message: 'Error fetching groups' });
  }
};;

// controller: get weekly study durations
const groupWeeklyStats = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId).populate('members', 'username email');
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7); // next Sunday

        const sessions = await StudySession.find({
            user: { $in: group.members },
            completed: true,
            startTime: { $gte: startOfWeek, $lt: endOfWeek }
        });

        const memberDurations = {};
        let totalGroupDuration = 0;

        sessions.forEach(session => {
            const userId = session.user.toString();
            const duration = session.duration || 0;

            if (!memberDurations[userId]) {
                memberDurations[userId] = 0;
            }

            memberDurations[userId] += duration;
            totalGroupDuration += duration;
        });

        const memberStats = group.members.map(member => ({
            _id: member._id,
            username: member.username,
            email: member.email,
            weeklyDuration: memberDurations[member._id.toString()] || 0
        }));

        res.status(200).json({
            success: true,
            memberStats,
            totalGroupWeeklyDuration: totalGroupDuration
        });
    } catch (err) {
        console.error("Error getting group weekly stats:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};





export { createGroup, joinGroup, leaveGroup, groupFeed, groupStatus,myGroups,allGroupsUserisNotaPartOf,searchGroups,groupWeeklyStats}