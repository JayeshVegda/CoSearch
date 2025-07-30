const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Import controllers
const {
  userData,
  categoryList,
  addCategory,
  editCategory,
  delCategory,
  addNewUrl,
  editNewUrl,
  delNewUrl,
  urlList,
  toggleUrl,
  resetToDefault,
} = require('../controllers/settingController');
const cloudinary = require('../utils/cloudinaryConfig');
const wrapAsync = require('../utils/wrapAsync');

// =========================
// User Routes
// =========================

// Get user data
router.get('/users/:userId', wrapAsync(userData));
// Reset user data to default
router.post('/users/:userId/reset-to-default', wrapAsync(resetToDefault));

// =========================
// Category Routes
// =========================

// Get all categories for a user
router.get('/users/:userId/categories', wrapAsync(categoryList));
// Add a new category
router.post('/users/:userId/categories', wrapAsync(addCategory));
// Edit a category (partial update)
router.patch('/users/:userId/categories/:catName', wrapAsync(editCategory));
// Delete a category
router.delete('/users/:userId/categories/:catName', wrapAsync(delCategory));

// =========================
// URL Routes (within a category)
// =========================

// Get all URLs in a category
router.get('/users/:userId/categories/:catName/urls', wrapAsync(urlList));
// Add a new URL to a category
router.post('/users/:userId/categories/:catName/urls', wrapAsync(addNewUrl));
// Edit a URL (partial update)
router.patch('/users/:userId/categories/:catName/urls/:siteName', wrapAsync(editNewUrl));
// Delete a URL
router.delete('/users/:userId/categories/:catName/urls/:siteName', wrapAsync(delNewUrl));
// Toggle URL isChecked - simplified route to avoid path-to-regexp issues
router.patch('/users/:userId/categories/:catName/urls/:siteName/toggle', wrapAsync(toggleUrl));

// =========================
// Icon Upload Route
// =========================

// Simple category endpoint for main search bar
router.get('/category', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in query' });
    }

    const user = await require('../models/userPreferencesModel').findOne({ userId });
    if (!user) {
      // Return default categories if user not found
      return res.json(['Search', 'AI', 'Video', 'Photo', 'Shopping', 'Social', 'News & Media', 'Finance']);
    }

    // Extract category names from user's engine array
    const categoryNames = user.engine.map(cat => cat.categoryName);
    res.json(categoryNames);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload an icon (for URLs or categories)
router.post('/icons/upload', upload.single('icon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'user-icons' },
      (error, result) => {
        if (error) {
          try {
            res.status(500).json({ error: error.message });
          } catch (e) {
            }
          return;
        }
        try {
          res.json({ public_id: result.public_id, url: result.secure_url });
        } catch (e) {
          }
      },
    );

    stream.on('error', (err) => {
      try {
        res.status(500).json({ error: 'Stream error: ' + err.message });
      } catch (e) {
        }
    });

    stream.end(req.file.buffer);
  } catch (err) {
    try {
      res.status(500).json({ error: err.message });
    } catch (e) {
      }
  }
});

module.exports = router;
