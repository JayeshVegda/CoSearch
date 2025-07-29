const cleanupService = require('../services/cleanupService');
const logger = require('../utils/logger');

// Get cleanup statistics
const getCleanupStats = async (req, res) => {
  try {
    const stats = await cleanupService.getCleanupStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting cleanup stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cleanup statistics',
    });
  }
};

// Manually trigger cleanup
const triggerCleanup = async (req, res) => {
  try {
    await cleanupService.manualCleanup();
    res.json({
      success: true,
      message: 'Manual cleanup completed successfully',
    });
  } catch (error) {
    logger.error('Error during manual cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger cleanup',
    });
  }
};

// Start cleanup service
const startCleanupService = async (req, res) => {
  try {
    cleanupService.start();
    res.json({
      success: true,
      message: 'Cleanup service started successfully',
    });
  } catch (error) {
    logger.error('Error starting cleanup service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start cleanup service',
    });
  }
};

// Stop cleanup service
const stopCleanupService = async (req, res) => {
  try {
    cleanupService.stop();
    res.json({
      success: true,
      message: 'Cleanup service stopped successfully',
    });
  } catch (error) {
    logger.error('Error stopping cleanup service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop cleanup service',
    });
  }
};

// Get service status
const getServiceStatus = async (req, res) => {
  try {
    const stats = await cleanupService.getCleanupStats();
    res.json({
      success: true,
      data: {
        isRunning: cleanupService.isRunning,
        inactivityDays: cleanupService.INACTIVITY_DAYS,
        cleanupInterval: cleanupService.CLEANUP_INTERVAL,
        stats,
      },
    });
  } catch (error) {
    logger.error('Error getting service status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get service status',
    });
  }
};

module.exports = {
  getCleanupStats,
  triggerCleanup,
  startCleanupService,
  stopCleanupService,
  getServiceStatus,
};
