
import React, { useEffect, useState } from 'react';
import ProfileStats from '../../components/profileStats/ProfileStats';
import WeeklyBarGraph from '../../components/WeeklyBarGraph/WeeklyBarGraph';
import { studySession } from '../../service/studySession';
import './profile.css';
import { authService } from '../../service/authService';

const ProfilePage = () => {
  const [todayDuration, setTodayDuration] = useState('0 min');
  const [weekDuration, setWeekDuration] = useState('0 min');
  const [weekData, setWeekData] = useState([]);
  const [user, setUser] = useState(null);
    useEffect(() => {
      const currentUser = authService.getUser();
      setUser(currentUser);
    }, []);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const todaySessions = await studySession.todaysSessions();
        const todayTotal = todaySessions.sessions.reduce((sum, s) => sum + s.duration, 0);
        setTodayDuration(`${todayTotal} min`);

        const weekSessions = await studySession.weeklySessions();
        const sessions = weekSessions.sessions;

        const daysMap = Array(7).fill(0);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        sessions.forEach((session) => {
          const sessionDate = new Date(session.startTime);
          const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
          const diffDays = Math.floor((today - sessionDay) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < 7) {
            daysMap[6 - diffDays] += session.duration;
          }
        });

        const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const startIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
        const rotatedWeekdays = [...weekdays.slice(startIndex + 1), ...weekdays.slice(0, startIndex + 1)];

        const formattedWeekData = rotatedWeekdays.map((day, index) => ({
          day,
          duration: daysMap[index],
        }));

        setWeekData(formattedWeekData);

        const weekDurationRes = await studySession.weeklyTotalDuration();
        setWeekDuration(`${weekDurationRes.totalDuration} min`);
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      }
    };

    fetchStats();
  }, []);
    if (!user) {
    return (
      <div>
        <h1>🔒 Stats page</h1>
        <p>You must <strong>log in</strong> to view your Stats.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1 className="profile-title">📊 My Focus Stats</h1>
      <ProfileStats todayDuration={todayDuration} weekDuration={weekDuration} />
      <WeeklyBarGraph data={weekData} />
    </div>
  );
};

export default ProfilePage;
