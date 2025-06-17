import api from './api.js';

export const studySession = {
  async startSession({ isPomodoro = false, customPomodoroConfig = null } = {}) {
    try {
      const payload = { isPomodoro };
      if (isPomodoro && customPomodoroConfig) {
        payload.customPomodoroConfig = customPomodoroConfig;
      }

      const res = await api.post('/session/start', payload);
      return res.data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  async endSession(sessionId) {
    try {
      const res = await api.post(`/session/end/${sessionId}`);
      return res.data;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  },

  async todaysSessions() {
    try {
      const res = await api.get('/session/today');
      return res.data;
    } catch (error) {
      console.error('Error fetching today\'s sessions:', error);
      throw error;
    }
  },

  async weeklySessions() {
    try {
      const res = await api.get('/session/weekly');
      return res.data;
    } catch (error) {
      console.error('Error fetching weekly sessions:', error);
      throw error;
    }
  },

  async weeklyTotalDuration() {
    try {
      const res = await api.get('/session/duration');
      return res.data;
    } catch (error) {
      console.error('Error fetching weekly total duration:', error);
      throw error;
    }
  },
  async tickFocusTime(sessionId){
    try {
      const res=await api.patch(`/session/tick-focus-time/${sessionId}`)
      return res.data
    } catch (error) {
       console.error('Error fetching tick focus time:', error);
      throw error;
    }
  }


};
