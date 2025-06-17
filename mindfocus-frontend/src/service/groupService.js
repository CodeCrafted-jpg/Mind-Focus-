import api from './api'

export const groupService = {

    async createGroup({ name, description }) {
        try {
            const res = await api.post('/group/create', { name, description })
            return res.data
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    },

    async joinGroup(groupId) {
        try {
            const res = await api.post(`/group/join/${groupId}`)
            return res.data
        } catch (error) {
            console.error('Error joining group:', error);
            throw error;
        }
    },

    async leaveGroup(groupId) {
        try {
            const res = await api.post(`/group/leave/${groupId}`)
            return res.data
        } catch (error) {
            console.error('Error leaving group:', error);
            throw error;
        }
    },

    async groupFreed(groupId) {
        try {
            const res = await api.post(`/group/feed/${groupId}`)
            return res.data

        } catch (error) {
            console.error('Error fetching groupfeed:', error);
            throw error;
        }
    },

    async groupStatus(groupId) {
        try {
            const res = await api.post(`/group/status/${groupId}`)
            console.log(res)
            return res.data

        }
        catch (error) {
            console.error('Error fetching groupStatus:', error);
            throw error;
        }
    },


    async myGroups() {
        try {
            const res = await api.get(`/group/my-groups`)
            return res.data
        } catch (error) {
            console.error('Error fetching my Groups:', error);
            throw error;
        }
    },


    async searchGroups(searchTerm = '') {
        try {
            const res = await api.get(`/group/allGroups?search=${encodeURIComponent(searchTerm)}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching Groups:', error);
            throw error;
        }
    },
    async getWeeklyStats(groupId) {
        try {
            const res = await api.get(`/group/weekly-stats/${groupId}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching weeklyData:', error);
            throw error;
        }
    },
    async groupsUserIsNotaPartOf() {
        try {
            const res = await api.get('/group/all-groups')
            return res.data
        } catch (error) {
            console.error('Error fetching groups:', error);
            throw error;
        }
    }



}