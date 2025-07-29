const express = require('express');

const router = express.Router();
const cleanupController = require('../controllers/cleanupController');
const { adminAuth } = require('../middleware/auth');

// Admin dashboard route with authentication
router.get('/dashboard', adminAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard access granted',
    data: {
      dashboardUrl: '/admin/dashboard',
      features: [
        'Cleanup Service Management',
        'User Statistics',
        'Database Monitoring',
        'Service Controls',
      ],
    },
  });
});

// Cleanup service routes (protected by admin auth)
router.get('/cleanup/stats', adminAuth, cleanupController.getCleanupStats);
router.get('/cleanup/status', adminAuth, cleanupController.getServiceStatus);
router.post('/cleanup/trigger', adminAuth, cleanupController.triggerCleanup);
router.post('/cleanup/start', adminAuth, cleanupController.startCleanupService);
router.post('/cleanup/stop', adminAuth, cleanupController.stopCleanupService);

module.exports = router;
