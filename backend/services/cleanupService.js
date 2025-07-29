const UserPreferences = require('../models/userPreferencesModel');
const logger = require('../utils/logger');

class CleanupService {
  constructor() {
    this.INACTIVITY_DAYS = 25;
    this.CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
    this.isRunning = false;
  }

  // Start the cleanup service
  start() {
    if (this.isRunning) {
      logger.info('Cleanup service is already running');
      return;
    }

    this.isRunning = true;
    logger.info(`Cleanup service started. Will run every 24 hours and delete users inactive for ${this.INACTIVITY_DAYS} days`);

    // Run initial cleanup
    this.performCleanup();

    // Schedule regular cleanup
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, this.CLEANUP_INTERVAL);
  }

  // Stop the cleanup service
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.isRunning = false;
    logger.info('Cleanup service stopped');
  }

  // Perform the actual cleanup
  async performCleanup() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.INACTIVITY_DAYS);

      logger.info(`Starting cleanup for users inactive since ${cutoffDate.toISOString()}`);

      // Find and delete inactive users
      const result = await UserPreferences.deleteMany({
        lastActivity: { $lt: cutoffDate },
      });

      logger.info(`Cleanup completed. Deleted ${result.deletedCount} inactive user(s)`);

      // Log additional statistics
      const totalUsers = await UserPreferences.countDocuments();
      const activeUsers = await UserPreferences.countDocuments({
        lastActivity: { $gte: cutoffDate },
      });

      logger.info(`Database statistics: Total users: ${totalUsers}, Active users: ${activeUsers}`);
    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }

  // Update user activity (called when user makes any request)
  async updateUserActivity(userId) {
    try {
      await UserPreferences.findOneAndUpdate(
        { userId },
        {
          lastActivity: new Date(),
          $setOnInsert: { engine: [] }, // Provide default engine array for new documents
        },
        { upsert: true },
      );
    } catch (error) {
      logger.error(`Error updating activity for user ${userId}:`, error);
    }
  }

  // Manual cleanup for testing
  async manualCleanup() {
    logger.info('Manual cleanup triggered');
    await this.performCleanup();
  }

  // Get cleanup statistics
  async getCleanupStats() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.INACTIVITY_DAYS);

      const totalUsers = await UserPreferences.countDocuments();
      const activeUsers = await UserPreferences.countDocuments({
        lastActivity: { $gte: cutoffDate },
      });
      const inactiveUsers = await UserPreferences.countDocuments({
        lastActivity: { $lt: cutoffDate },
      });

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        inactivityDays: this.INACTIVITY_DAYS,
        nextCleanup: new Date(Date.now() + this.CLEANUP_INTERVAL),
      };
    } catch (error) {
      logger.error('Error getting cleanup stats:', error);
      throw error;
    }
  }
}

module.exports = new CleanupService();
