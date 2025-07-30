const getDefaultUserData = require('../init/data');
const UserPreferences = require('../models/userPreferencesModel');

let _mainId;

/**
 * Register a new user or get existing user data
 * Creates a new user with default data if they don't exist
 */
module.exports.register = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId in request body',
      });
    }

    _mainId = userId;

    // Check if user already exists
    let user = await UserPreferences.findOne({ userId });

    if (user) {
      }

    if (user) {
      // Check if user has default data, if not, fix it
      if (user.engine.length === 0) {
        const userData = getDefaultUserData(userId);
        user = await UserPreferences.findOneAndUpdate(
          { userId },
          {
            engine: userData.engine,
            updatedAt: new Date(),
            isFirstTimeUser: true,
          },
          { new: true },
        );
        }

      // Check if this is a recently created user (within last 5 seconds)
      // This handles the case where user was created by category endpoint
      const isRecentlyCreated = user.createdAt && (new Date() - new Date(user.createdAt)) < 5000;

      // User exists, return success with appropriate new user status
      return res.json({
        success: true,
        isNewUser: isRecentlyCreated,
        message: isRecentlyCreated ? 'New user created successfully' : 'User already exists',
        user: {
          userId: user.userId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          categoriesCount: user.engine.length,
          totalSites: user.engine.reduce((total, cat) => total + cat.url.length, 0),
        },
      });
    }

    // User doesn't exist, create new user with default data
    const userData = getDefaultUserData(userId);

    // Add additional metadata for new users
    userData.createdAt = new Date();
    userData.updatedAt = new Date();
    userData.isFirstTimeUser = true;

    // Create the new user
    const newUser = await UserPreferences.create(userData);

    res.json({
      success: true,
      isNewUser: true,
      message: 'New user created successfully',
      user: {
        userId: newUser.userId,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        categoriesCount: newUser.engine.length,
        totalSites: newUser.engine.reduce((total, cat) => total + cat.url.length, 0),
      },
    });
  } catch (err) {
    // Handle duplicate key error (shouldn't happen with our logic, but just in case)
    if (err.code === 11000) {
      return res.json({
        success: true,
        isNewUser: false,
        message: 'User already exists (duplicate key)',
        error: 'Duplicate user detected',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: err.message,
    });
  }
};

/**
 * Search for sites in a specific category
 * Creates user if they don't exist (fallback)
 */
module.exports.search = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'Request body is missing',
      });
    }

    const { userId, categoryName } = req.body;

    if (!userId || !categoryName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        received: { userId, categoryName },
        body: req.body,
      });
    }

    // Find user or create if doesn't exist
    let user = await UserPreferences.findOne({ userId });
    if (!user) {
      const userData = getDefaultUserData(userId);
      user = await UserPreferences.create(userData);
    }

    // Find the requested category
    const categoryData = user.engine.find(e => e.categoryName === categoryName);
    if (!categoryData) {
      return res.json({
        success: true,
        categoryData: null,
        message: `Category '${categoryName}' not found`,
        availableCategories: user.engine.map(cat => cat.categoryName),
      });
    }

    // Return category data with enabled sites only
    const enabledSites = categoryData.url.filter(site => site.isChecked !== false);

    res.json({
      success: true,
      categoryData: {
        ...categoryData,
        url: enabledSites,
      },
      totalSites: categoryData.url.length,
      enabledSites: enabledSites.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to process search request',
    });
  }
};

/**
 * Get user categories
 * Creates user with default data if they don't exist
 */
module.exports.category = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId in query parameters',
      });
    }

    // Find user or create if doesn't exist
    let user = await UserPreferences.findOne({ userId });

    if (!user) {
      const userData = getDefaultUserData(userId);
      user = await UserPreferences.create(userData);
    } else if (user.engine.length === 0) {
      // Fix user with missing default data
      const userData = getDefaultUserData(userId);
      user = await UserPreferences.findOneAndUpdate(
        { userId },
        {
          engine: userData.engine,
          updatedAt: new Date(),
          isFirstTimeUser: true,
        },
        { new: true },
      );
      }

    // Extract category names from user's engine array
    const categoryNames = user.engine.map(cat => cat.categoryName);

    res.json({
      success: true,
      categories: categoryNames,
      isNewUser: !user.createdAt || (new Date() - new Date(user.createdAt)) < 5000, // Check if recently created
      totalCategories: categoryNames.length,
      userCreatedAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
};

/**
 * Get user profile and statistics
 */
module.exports.profile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId in path parameters',
      });
    }

    const user = await UserPreferences.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Calculate statistics
    const totalSites = user.engine.reduce((total, cat) => total + cat.url.length, 0);
    const enabledSites = user.engine.reduce((total, cat) =>
      total + cat.url.filter(site => site.isChecked !== false).length, 0,
    );

    res.json({
      success: true,
      profile: {
        userId: user.userId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        categoriesCount: user.engine.length,
        totalSites,
        enabledSites,
        disabledSites: totalSites - enabledSites,
        preferences: user.preferences || {},
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
};
