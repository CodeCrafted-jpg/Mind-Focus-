import api from './api';

export const blockSiteService = {

  async addSite(url) {
    try {
      const res = await api.post('/blockSites/add', { url });  
      return res.data;
    } catch (error) {
      console.error('Error adding site:', error);
      throw error;
    }
  },

  async removeSite(siteId) {
    try {
      const res = await api.delete(`/blockSites/remove/${siteId}`);
      return res.data;
    } catch (error) {
      console.error('Error removing site:', error);
      throw error;
    }
  },

  async getSites() {
    try {
      const res = await api.get('/blockSites/get');
      return res.data;
    } catch (error) {
      console.error('Error fetching sites:', error);
      throw error;
    }
  }
};
