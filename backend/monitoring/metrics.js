const os = require('os');

class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        byEndpoint: new Map(),
        responseTimes: [],
      },
      errors: {
        total: 0,
        byType: new Map(),
        recent: [],
      },
      system: {
        startTime: Date.now(),
        memory: [],
        cpu: [],
      },
      database: {
        queries: 0,
        slowQueries: 0,
        errors: 0,
      },
    };

    this.maxHistory = 1000; // Keep last 1000 data points
    this.startPeriodicCollection();
  }

  // Record a request
  recordRequest(endpoint, method, statusCode, responseTime) {
    this.metrics.requests.total++;
    
    if (statusCode >= 200 && statusCode < 400) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }

    // Record by endpoint
    const key = `${method} ${endpoint}`;
    if (!this.metrics.requests.byEndpoint.has(key)) {
      this.metrics.requests.byEndpoint.set(key, {
        total: 0,
        successful: 0,
        failed: 0,
        avgResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
      });
    }

    const endpointStats = this.metrics.requests.byEndpoint.get(key);
    endpointStats.total++;
    
    if (statusCode >= 200 && statusCode < 400) {
      endpointStats.successful++;
    } else {
      endpointStats.failed++;
    }

    // Update response time stats
    endpointStats.avgResponseTime = 
      (endpointStats.avgResponseTime * (endpointStats.total - 1) + responseTime) / endpointStats.total;
    endpointStats.minResponseTime = Math.min(endpointStats.minResponseTime, responseTime);
    endpointStats.maxResponseTime = Math.max(endpointStats.maxResponseTime, responseTime);

    // Store response time for overall stats
    this.metrics.requests.responseTimes.push({
      timestamp: Date.now(),
      responseTime,
      endpoint: key,
    });

    // Keep only recent response times
    if (this.metrics.requests.responseTimes.length > this.maxHistory) {
      this.metrics.requests.responseTimes.shift();
    }
  }

  // Record an error
  recordError(error, context = {}) {
    this.metrics.errors.total++;
    
    const errorType = error.name || 'Unknown';
    if (!this.metrics.errors.byType.has(errorType)) {
      this.metrics.errors.byType.set(errorType, 0);
    }
    this.metrics.errors.byType.set(errorType, this.metrics.errors.byType.get(errorType) + 1);

    // Store recent errors
    this.metrics.errors.recent.push({
      timestamp: Date.now(),
      type: errorType,
      message: error.message,
      stack: error.stack,
      context,
    });

    // Keep only recent errors
    if (this.metrics.errors.recent.length > 100) {
      this.metrics.errors.recent.shift();
    }
  }

  // Record database operation
  recordDatabaseOperation(type, duration, success = true) {
    this.metrics.database.queries++;
    
    if (!success) {
      this.metrics.database.errors++;
    }

    if (duration > 1000) { // Consider queries over 1 second as slow
      this.metrics.database.slowQueries++;
    }
  }

  // Collect system metrics
  collectSystemMetrics() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = os.loadavg();

    const systemMetric = {
      timestamp: Date.now(),
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        systemTotal: os.totalmem(),
        systemFree: os.freemem(),
      },
      cpu: {
        loadAverage: cpuUsage,
        cores: os.cpus().length,
      },
      uptime: process.uptime(),
    };

    this.metrics.system.memory.push(systemMetric.memory);
    this.metrics.system.cpu.push(systemMetric.cpu);

    // Keep only recent metrics
    if (this.metrics.system.memory.length > this.maxHistory) {
      this.metrics.system.memory.shift();
    }
    if (this.metrics.system.cpu.length > this.maxHistory) {
      this.metrics.system.cpu.shift();
    }

    return systemMetric;
  }

  // Start periodic collection
  startPeriodicCollection() {
    setInterval(() => {
      this.collectSystemMetrics();
    }, 60000); // Collect every minute
  }

  // Get current metrics
  getMetrics() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      requests: {
        total: this.metrics.requests.total,
        successful: this.metrics.requests.successful,
        failed: this.metrics.requests.failed,
        successRate: this.metrics.requests.total > 0 
          ? (this.metrics.requests.successful / this.metrics.requests.total * 100).toFixed(2)
          : 0,
        byEndpoint: Object.fromEntries(this.metrics.requests.byEndpoint),
        recentResponseTimes: this.metrics.requests.responseTimes
          .filter(rt => rt.timestamp > oneHourAgo)
          .map(rt => rt.responseTime),
      },
      errors: {
        total: this.metrics.errors.total,
        byType: Object.fromEntries(this.metrics.errors.byType),
        recent: this.metrics.errors.recent
          .filter(err => err.timestamp > oneHourAgo)
          .slice(-10), // Last 10 errors
      },
      database: {
        ...this.metrics.database,
        errorRate: this.metrics.database.queries > 0
          ? (this.metrics.database.errors / this.metrics.database.queries * 100).toFixed(2)
          : 0,
        slowQueryRate: this.metrics.database.queries > 0
          ? (this.metrics.database.slowQueries / this.metrics.database.queries * 100).toFixed(2)
          : 0,
      },
      system: {
        current: this.collectSystemMetrics(),
        memory: {
          average: this.calculateAverage(this.metrics.system.memory, 'heapUsed'),
          peak: Math.max(...this.metrics.system.memory.map(m => m.heapUsed)),
        },
        cpu: {
          average: this.calculateAverage(this.metrics.system.cpu, 'loadAverage'),
          peak: Math.max(...this.metrics.system.cpu.flatMap(c => c.loadAverage)),
        },
      },
    };
  }

  // Calculate average for a specific property
  calculateAverage(array, property) {
    if (array.length === 0) return 0;
    
    if (Array.isArray(array[0][property])) {
      // Handle loadAverage which is an array
      const sum = array.reduce((acc, item) => {
        return acc + item[property].reduce((a, b) => a + b, 0) / item[property].length;
      }, 0);
      return (sum / array.length).toFixed(2);
    } else {
      const sum = array.reduce((acc, item) => acc + item[property], 0);
      return (sum / array.length).toFixed(2);
    }
  }

  // Get performance summary
  getPerformanceSummary() {
    const metrics = this.getMetrics();
    const recentResponseTimes = metrics.requests.recentResponseTimes;

    return {
      responseTime: {
        average: recentResponseTimes.length > 0 
          ? (recentResponseTimes.reduce((a, b) => a + b, 0) / recentResponseTimes.length).toFixed(2)
          : 0,
        min: recentResponseTimes.length > 0 ? Math.min(...recentResponseTimes) : 0,
        max: recentResponseTimes.length > 0 ? Math.max(...recentResponseTimes) : 0,
        p95: this.calculatePercentile(recentResponseTimes, 95),
        p99: this.calculatePercentile(recentResponseTimes, 99),
      },
      throughput: {
        requestsPerMinute: this.calculateRequestsPerMinute(),
        errorsPerMinute: this.calculateErrorsPerMinute(),
      },
      system: {
        memoryUsage: metrics.system.current.memory.heapUsed / metrics.system.current.memory.heapTotal * 100,
        cpuLoad: metrics.system.current.cpu.loadAverage[0],
      },
    };
  }

  // Calculate percentile
  calculatePercentile(array, percentile) {
    if (array.length === 0) return 0;
    
    const sorted = array.slice().sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  // Calculate requests per minute
  calculateRequestsPerMinute() {
    const oneMinuteAgo = Date.now() - (60 * 1000);
    const recentRequests = this.metrics.requests.responseTimes
      .filter(rt => rt.timestamp > oneMinuteAgo).length;
    return recentRequests;
  }

  // Calculate errors per minute
  calculateErrorsPerMinute() {
    const oneMinuteAgo = Date.now() - (60 * 1000);
    const recentErrors = this.metrics.errors.recent
      .filter(err => err.timestamp > oneMinuteAgo).length;
    return recentErrors;
  }

  // Reset metrics (useful for testing)
  reset() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        byEndpoint: new Map(),
        responseTimes: [],
      },
      errors: {
        total: 0,
        byType: new Map(),
        recent: [],
      },
      system: {
        startTime: Date.now(),
        memory: [],
        cpu: [],
      },
      database: {
        queries: 0,
        slowQueries: 0,
        errors: 0,
      },
    };
  }
}

// Create singleton instance
const metricsCollector = new MetricsCollector();

module.exports = metricsCollector; 