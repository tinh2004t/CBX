// src/api/client.js
import API_CONFIG from './config.js';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.headers = API_CONFIG.HEADERS;
  }

  async request(endpoint, options = {}) {
  let url = `${this.baseURL}${endpoint}`;

  // ✅ build query string nếu có params
  if (options.params) {
    const queryString = new URLSearchParams(options.params).toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    delete options.params; // xoá để fetch không bị lỗi
  }

  // 👉 Lấy token từ sessionStorage trước, rồi đến localStorage
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

  const config = {
    method: options.method || 'GET',
    headers: {
      ...this.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (options.body && config.method !== 'GET') {
    config.body = JSON.stringify(options.body);
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    let data;
    const contentType = response.headers.get('content-type');
    data = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) throw new Error(data?.message || `HTTP error! status: ${response.status}`);

    return { data, status: response.status, headers: response.headers };
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Request timeout');
    throw error;
  }
}


  get(endpoint, options = {}) { return this.request(endpoint, { ...options, method: 'GET' }); }
  post(endpoint, body, options = {}) { return this.request(endpoint, { ...options, method: 'POST', body }); }
  put(endpoint, body, options = {}) { return this.request(endpoint, { ...options, method: 'PUT', body }); }
  patch(endpoint, body, options = {}) { return this.request(endpoint, { ...options, method: 'PATCH', body }); } // ✅ thêm patch
  delete(endpoint, options = {}) { return this.request(endpoint, { ...options, method: 'DELETE' }); }
}

const apiClient = new ApiClient();
export default apiClient;
