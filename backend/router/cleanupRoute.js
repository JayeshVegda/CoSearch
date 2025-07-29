const express = require('express');
const router = express.Router();
const {
  getCleanupStats,
  triggerCleanup,
  startCleanupService,
  stopCleanupService,
  getServiceStatus
} = require('../controllers/cleanupController');

// Get cleanup statistics
router.get('/stats', getCleanupStats);

// Get service status
router.get('/status', getServiceStatus);

// Manually trigger cleanup
router.post('/trigger', triggerCleanup);

// Start cleanup service
router.post('/start', startCleanupService);

// Stop cleanup service
router.post('/stop', stopCleanupService);

module.exports = router; 