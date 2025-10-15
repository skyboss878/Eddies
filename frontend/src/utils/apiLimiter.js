class APILimiter {
  constructor() {
    this.pendingRequests = new Set();
    this.lastRequestTime = new Map();
    this.minInterval = 100; // Minimum 100ms between same requests
  }

  async makeRequest(url, options = {}) {
    const requestKey = `${options.method || 'GET'}-${url}`;
    
    // Prevent duplicate concurrent requests
    if (this.pendingRequests.has(requestKey)) {
      return Promise.reject(new Error('Request already pending'));
    }

    // Rate limiting
    const lastTime = this.lastRequestTime.get(requestKey) || 0;
    const now = Date.now();
    if (now - lastTime < this.minInterval) {
      return Promise.reject(new Error('Rate limited'));
    }

    this.pendingRequests.add(requestKey);
    this.lastRequestTime.set(requestKey, now);

    try {
      const response = await fetch(url, options);
      return response;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }
}

export const apiLimiter = new APILimiter();
