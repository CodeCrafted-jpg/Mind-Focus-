import api from './api'


export const messageService = {

    async sendMessage(content, groupId) {
        try {
            const res = await api.post(`/message/send/${groupId}`, { content })
            return res.data
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    async getAllMessage(groupId) {
        try {
            const res = await api.post(`/message/get/${groupId}`)
            return res.data
        } catch (error) {
            console.error('Error getting message:', error);
            throw error;
        }
    },

    async deleteMessage(messageId) {
        try {
            const res = await api.delete(`/message/del/${messageId}`)
            return res.data
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }


}