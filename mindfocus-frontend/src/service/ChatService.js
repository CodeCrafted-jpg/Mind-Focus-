import api from './api';

export const chatService = {

    async send(message, sessionId = null) {
        try {
            const res = await api.post(`/chat/send`, { message, sessionId });
            return res.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    async getSession() {
        try {
            const res = await api.get('/chat/get');
            return res.data;
        } catch (error) {
            console.error('Error getting sessions:', error);
            throw error;
        }
    },

    async getSessionMessages(sessionId) {
        try {
            const res = await api.post(`/chat/messages/${sessionId}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching session messages:', error);
            throw error;
        }
    },

    async deleteSession(sessionId) {
        try {
            const res = await api.delete(`/chat/delete/${sessionId}`);
            return res.data;
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    }

};
