const cleanupService = require('../services/cleanupService');

const activityTracker = async (req, res, next) => {
  try {
    // Extract userId from request
    let userId = null;

    // Try to get userId from different possible sources
    if (req.params.userId) {
      userId = req.params.userId;
    } else if (req.query.userId) {
      userId = req.query.userId;
    } else if (req.body.userId) {
      userId = req.body.userId;
    }

    // If we have a userId, update their activity
    if (userId) {
      await cleanupService.updateUserActivity(userId);
    }

    next();
  } catch (error) {
    // Don't block the request if activity tracking fails
    next();
  }
};

module.exports = activityTracker;
