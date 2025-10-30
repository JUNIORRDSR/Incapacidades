import api from './axios';

// ==================== AUTH API ====================
export const authApi = {
  /**
   * Register a new user
   * @param {Object} data - User registration data
   * @returns {Promise<Object>} User and tokens
   */
  register: (data) => api.post('/auth/register', data),

  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} User and tokens
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<Object>} New tokens
   */
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// ==================== USERS API ====================
export const usersApi = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  getProfile: () => api.get('/users/profile'),

  /**
   * Update user profile
   * @param {string} id - User ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated user
   */
  update: (id, data) => api.patch(`/users/${id}`, data),

  /**
   * Get all users (paginated)
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<Object>} Users list
   */
  getAll: (page = 1, limit = 10) =>
    api.get(`/users?page=${page}&limit=${limit}`),
};

// ==================== DOCUMENTS API ====================
export const documentsApi = {
  /**
   * Get all documents (paginated)
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<Object>} Documents list
   */
  getAll: (page = 1, limit = 10) =>
    api.get(`/documents?page=${page}&limit=${limit}`),

  /**
   * Get document by ID
   * @param {string} id
   * @returns {Promise<Object>} Document
   */
  getById: (id) => api.get(`/documents/${id}`),

  /**
   * Create new document
   * @param {Object} data
   * @returns {Promise<Object>} Created document
   */
  create: (data) => api.post('/documents', data),

  /**
   * Update document
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>} Updated document
   */
  update: (id, data) => api.patch(`/documents/${id}`, data),

  /**
   * Delete document
   * @param {string} id
   * @returns {Promise<void>}
   */
  delete: (id) => api.delete(`/documents/${id}`),

  /**
   * Upload document file
   * @param {File} file
   * @param {Object} metadata
   * @returns {Promise<Object>} Uploaded document
   */
  uploadFile: (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach((key) => {
      formData.append(key, metadata[key]);
    });

    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Download document file
   * @param {string} id
   * @returns {Promise<Blob>} File blob
   */
  downloadFile: (id) =>
    api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    }),
};
