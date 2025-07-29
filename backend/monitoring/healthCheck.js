const mongoose = require('mongoose');
const os = require('os');

class HealthChecker {
  constructor() {
    this.startTime = Date.now();
    this.checks = new Map();
  }

  // Add a health check
  addCheck(name, checkFunction) {
    this.checks.set(name, checkFunction);
  }

  // Get system metrics
  getSystemMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = process.memoryUsage();

    return {
      uptime: process.uptime(),
      memory: {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        usagePercent: ((usedMem / totalMem) * 100).toFixed(2),
        process: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
        },
      },
      cpu: {
        loadAverage: os.loadavg(),
        cores: os.cpus().length,
      },
      platform: {
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
        nodeVersion: process.version,
      },
    };
  }

  // Check database connection
  async checkDatabase() {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      };

      if (state === 1) {
        // Test a simple query
        await mongoose.connection.db.admin().ping();
        return { status: 'healthy', state: states[state] };
      } else {
        return { status: 'unhealthy', state: states[state] };
      }
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  // Check external services
  async checkExternalServices() {
    const checks = {};

    // Check Cloudinary (if configured)
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        // Simple check - you might want to add actual API calls
        checks.cloudinary = { status: 'healthy' };
      } catch (error) {
        checks.cloudinary = { status: 'unhealthy', error: error.message };
      }
    }

    return checks;
  }

  // Run all health checks
  async runHealthChecks() {
    const results = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {},
      system: this.getSystemMetrics(),
    };

    // Run database check
    results.checks.database = await this.checkDatabase();

    // Run external service checks
    results.checks.external = await this.checkExternalServices();

    // Run custom checks
    for (const [name, checkFunction] of this.checks) {
      try {
        results.checks[name] = await checkFunction();
      } catch (error) {
        results.checks[name] = { status: 'unhealthy', error: error.message };
      }
    }

    // Determine overall health
    const allChecks = Object.values(results.checks).flat();
    const unhealthyChecks = allChecks.filter(check => check.status === 'unhealthy');
    
    results.status = unhealthyChecks.length === 0 ? 'healthy' : 'unhealthy';
    results.unhealthyCount = unhealthyChecks.length;

    return results;
  }

  // Get detailed health report
  async getDetailedHealth() {
    const health = await this.runHealthChecks();
    
    return {
      ...health,
      details: {
        database: {
          connection: health.checks.database,
          collections: await this.getDatabaseStats(),
        },
        performance: {
          responseTime: await this.getAverageResponseTime(),
          errorRate: await this.getErrorRate(),
        },
      },
    };
  }

  // Get database statistics
  async getDatabaseStats() {
    try {
      if (mongoose.connection.readyState !== 1) {
        return { error: 'Database not connected' };
      }

      const stats = await mongoose.connection.db.stats();
      return {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Get average response time (placeholder)
  async getAverageResponseTime() {
    // This would typically be implemented with actual metrics collection
    return { average: 'N/A', samples: 0 };
  }

  // Get error rate (placeholder)
  async getErrorRate() {
    // This would typically be implemented with actual metrics collection
    return { rate: 'N/A', totalErrors: 0, totalRequests: 0 };
  }
}

// Create singleton instance
const healthChecker = new HealthChecker();

// Add custom health checks
healthChecker.addCheck('custom', async () => {
  // Add your custom health checks here
  return { status: 'healthy', message: 'Custom check passed' };
});

module.exports = healthChecker; 