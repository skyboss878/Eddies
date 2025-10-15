import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.api.post('/api/auth/login', credentials);
  }

  async register(userData: any) {
    return this.api.post('/api/auth/register', userData);
  }

  async logout() {
    return this.api.post('/api/auth/logout');
  }

  // Add more methods as needed...
  async getCustomers() {
    return this.api.get('/api/auth/customers');
  }

  async healthCheck() {
    return axios.get('http://localhost:5000/api/health');
  }
}

export default new ApiService();
