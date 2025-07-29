const express = require('express');
const router = express.Router();
const healthChecker = require('../monitoring/healthCheck');
const metricsCollector = require('../monitoring/metrics');

// Basic health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = await healthChecker.runHealthChecks();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json({
      status: health.status,
      timestamp: health.timestamp,
      uptime: health.uptime,
      version: health.version,
      environment: health.environment,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Detailed health check endpoint
router.get('/health/detailed', async (req, res) => {
  try {
    const health = await healthChecker.getDetailedHealth();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Metrics endpoint
router.get('/metrics', (req, res) => {
  try {
    const metrics = metricsCollector.getMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Performance summary endpoint
router.get('/metrics/performance', (req, res) => {
  try {
    const performance = metricsCollector.getPerformanceSummary();
    res.json(performance);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// System metrics endpoint
router.get('/metrics/system', (req, res) => {
  try {
    const systemMetrics = healthChecker.getSystemMetrics();
    res.json(systemMetrics);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Database stats endpoint
router.get('/metrics/database', async (req, res) => {
  try {
    const dbStats = await healthChecker.getDatabaseStats();
    res.json(dbStats);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Reset metrics endpoint (for testing/debugging)
router.post('/metrics/reset', (req, res) => {
  try {
    metricsCollector.reset();
    res.json({
      message: 'Metrics reset successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router; 