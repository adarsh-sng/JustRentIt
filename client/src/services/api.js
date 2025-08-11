const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('API Request:', url, options);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (options.body && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API Response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PUT', body, ...options });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  postFormData(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        ...options.headers,
      },
      ...options,
    });
  }

  putFormData(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: formData,
      headers: {
        ...options.headers,
      },
      ...options,
    });
  }
}

export const apiService = new ApiService();

export const authAPI = {
  register: (userData) => apiService.post('/auth/register', userData),
  login: (credentials) => apiService.post('/auth/login', credentials),
  logout: () => apiService.post('/auth/logout'),
  getCurrentUser: () => apiService.get('/auth/me'),
  updateProfile: (formData) => apiService.putFormData('/auth/profile', formData),
  refreshToken: () => apiService.post('/auth/refresh-token'),
};

export const productAPI = {
  getAllProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.get(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getProductById: (id) => apiService.get(`/products/${id}`),
  createProduct: (formData) => apiService.postFormData('/products', formData),
  updateProduct: (id, formData) => apiService.putFormData(`/products/${id}`, formData),
  deleteProduct: (id) => apiService.delete(`/products/${id}`),
  getMyProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.get(`/products/my/products${queryString ? `?${queryString}` : ''}`);
  },
  getUserProducts: (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.get(`/products/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },
  getCategories: () => apiService.get('/products/categories'),
};

export const orderAPI = {
  createOrder: (orderData) => apiService.post('/orders', orderData),
  createCartOrder: (cartOrderData) => apiService.post('/orders/cart', cartOrderData),
  getMyOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.get(`/orders/my${queryString ? `?${queryString}` : ''}`);
  },
  getOrderById: (id) => apiService.get(`/orders/${id}`),
  returnItem: (id, data = {}) => apiService.put(`/orders/${id}/return`, data),
  cancelOrder: (id, data = {}) => apiService.put(`/orders/${id}/cancel`, data),
  getOrdersForMyProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.get(`/orders/my-products${queryString ? `?${queryString}` : ''}`);
  },
};

export default apiService;