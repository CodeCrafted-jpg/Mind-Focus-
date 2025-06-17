import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService } from '../../service/groupService';
import { authService } from '../../service/authService';
import ChatPanel from '../../components/ChatPanel/ChatPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StudyPieChart from '../../components/DurationpieChat/DurationPieChart.jsx';
import './groupDetails.css';

function GroupDetailsPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = authService.getUser();

    useEffect(() => {
        if (groupId) {
            fetchData(groupId);
        } else {
            console.warn("No groupId found in params");
        }
    }, [groupId]);

    const fetchData = async (id) => {
        try {
            setLoading(true);
            const [groupRes, statsRes] = await Promise.all([
                groupService.groupStatus(id),
                groupService.getWeeklyStats(id)
            ]);
            setGroup(groupRes.group);
            setWeeklyStats(statsRes);
        } catch (err) {
            console.error('Failed to load group details or weekly stats:', err);
            setError('Failed to load group details or stats');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveGroup = async () => {
        try {
            await groupService.leaveGroup(groupId);
            navigate('/groups');
        } catch (err) {
            console.error('Error leaving group:', err);
        }
    };

    const formatMinutes = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!group) return <p>Nothing to show - check logs.</p>;

    return (
        <div className="group-details-page">
            {/* Top Navbar */}
            <div className="top-navbar">{group.creator?.username}-Group</div>

            {/* Group Info + Chart */}
            <div className="group-header-container">
                <div className="group-header">
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>
                    <p>Created by: {group.creator?.username || group.creator?.email || 'Unknown'}</p>
                    <button onClick={handleLeaveGroup} className="btn-red">Leave Group</button>
                </div>

                <div className="group-chart">
                    {weeklyStats && <StudyPieChart data={weeklyStats.memberStats || []} />}
                    <h2>Total Weekly Study Time: {formatMinutes(weeklyStats.totalGroupWeeklyDuration)}</h2>
                </div>
            </div>

            {/* Three Column Layout */}
            <div className="group-content-layout">
                {/* Feed Panel */}
                <div className="panel">
                    <h3>Group Feed</h3>
                    {!weeklyStats ? (
                        <p>Loading stats...</p>
                    ) : (
                        <div>
                            <h4>Total Weekly Study Time: {formatMinutes(weeklyStats.totalGroupWeeklyDuration)}</h4>
                            <ul className="feed-list">
                                {weeklyStats.memberStats.map((member) => (
                                    <li key={member._id}>
                                        {member.username || member.email}: {formatMinutes(member.weeklyDuration)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Chat Panel */}
                <div className="panel">
                    <h3>Group Chat</h3>
                    <ChatPanel groupId={groupId} currentUser={user} />
                </div>

                {/* Members Panel */}
                <div className="panel">
                    <h3>Members</h3>
                    <ul>
                        {(group.members || []).map((member) => (
                            <li key={member._id}>
                                {member.username || member.email}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default GroupDetailsPage;
