const UserPreferences = require("../models/userPreferencesModel");
const getDefaultUserData = require('../init/data');

// =========================
// User Controller
// =========================

// GET /api/setting/users/:userId
// Get user data
module.exports.userData = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId in params" });
        }
        const user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found", userId });
        }
        res.status(200).json({ success: true, user });
    } catch (e) {
        console.error('User Data Error :', e);
        res.status(500).json({ error: "Internal server error", message: e.message });
    }
};

// =========================
// Category Controllers
// =========================

// GET /api/setting/users/:userId/categories
// Get all category names for a user
module.exports.categoryList = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId in params" });
        }
        
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in settings: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        
        const categoryNames = user.engine.map(category => category.categoryName);
        res.status(200).json({ success: true, categories: categoryNames, userId });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// POST /api/setting/users/:userId/categories
// Add a new category
module.exports.addCategory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { categoryName, description = '' } = req.body;
        if (!userId || !categoryName) {
            return res.status(400).json({ error: "Missing required fields", required: ["userId", "categoryName"] });
        }
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in addCategory: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        const existingCategory = user.engine.find(category => category.categoryName === categoryName);
        if (existingCategory) {
            return res.status(409).json({ error: "Category already exists", message: `Category '${categoryName}' already exists for this user`, existingCategory });
        }
        const newCategory = { categoryName, description, url: [] };
        const updatedUser = await UserPreferences.findOneAndUpdate(
            { userId: userId },
            { $push: { engine: newCategory } },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to add category" });
        }
        res.status(201).json({ success: true, message: "Category added successfully", category: newCategory, userId });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// PATCH /api/setting/users/:userId/categories/:catName
// Edit a category (name or description)
module.exports.editCategory = async (req, res) => {
    try {
        const { userId, catName } = req.params;
        const { newCategoryName, newDescription } = req.body;
        if (!userId || !catName) {
            return res.status(400).json({ error: "Missing required fields", required: ["userId", "catName"] });
        }
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in editCategory: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        const categoryIndex = user.engine.findIndex(category => category.categoryName === catName);
        if (categoryIndex === -1) {
            return res.status(404).json({ error: "Category not found", catName, userId });
        }
        // Check if new category name already exists (if changing name)
        if (newCategoryName && newCategoryName !== catName) {
            const existingCategory = user.engine.find(category => category.categoryName === newCategoryName);
            if (existingCategory) {
                return res.status(409).json({ error: "Category name already exists", message: `Category '${newCategoryName}' already exists for this user` });
            }
        }
        const updateFields = {};
        if (newCategoryName) updateFields[`engine.${categoryIndex}.categoryName`] = newCategoryName;
        if (newDescription) updateFields[`engine.${categoryIndex}.description`] = newDescription;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No changes provided", message: "Provide newCategoryName or newDescription to update" });
        }
        const updatedUser = await UserPreferences.findOneAndUpdate(
            { userId: userId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to update category" });
        }
        const updatedCategory = updatedUser.engine[categoryIndex];
        res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory, userId });
    } catch (error) {
        console.error('Error editing category:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// DELETE /api/setting/users/:userId/categories/:catName
// Delete a category
module.exports.delCategory = async (req, res) => {
    try {
        const { userId, catName } = req.params;
        if (!userId || !catName) {
            return res.status(400).json({ error: "Missing required fields", required: ["userId", "catName"] });
        }
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in delCategory: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        const categoryExists = user.engine.find(category => category.categoryName === catName);
        if (!categoryExists) {
            return res.status(404).json({ error: "Category not found", catName, userId });
        }
        const updatedUser = await UserPreferences.findOneAndUpdate(
            { userId: userId },
            { $pull: { engine: { categoryName: catName } } },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to delete category" });
        }
        res.status(200).json({ success: true, message: "Category deleted successfully", deletedCategory: catName, userId, remainingCategories: updatedUser.engine.length });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// =========================
// URL Controllers
// =========================

// GET /api/setting/users/:userId/categories/:catName/urls
// Get all URLs in a category
module.exports.urlList = async (req, res) => {
    try {
        const { userId, catName } = req.params;
        if (!userId || !catName) {
            return res.status(400).json({ error: "Missing required fields", required: ["userId", "catName"] });
        }
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in urlList: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        const category = user.engine.find(cat => cat.categoryName === catName);
        if (!category) {
            return res.status(404).json({ error: "Category not found", catName, userId });
        }
        res.status(200).json({ success: true, urls: category.url, userId, categoryName: catName });
    } catch (error) {
        console.error('Error fetching URLs:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// POST /api/setting/users/:userId/categories/:catName/urls
// Add a new URL to a category
module.exports.addNewUrl = async (req, res) => {
    try {
        const { userId, catName } = req.params;
        const { siteName, siteUrl, icon, isChecked } = req.body;
        if (!userId || !catName || !siteName || !siteUrl) {
            return res.status(400).json({ error: "Missing required fields", required: ["userId", "catName", "siteName", "siteUrl"] });
        }
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in addNewUrl: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        const categoryIndex = user.engine.findIndex(category => category.categoryName === catName);
        if (categoryIndex === -1) {
            return res.status(404).json({ error: "Category not found", catName, userId });
        }
        const existingUrl = user.engine[categoryIndex].url.find(url => url.siteName === siteName);
        if (existingUrl) {
            return res.status(409).json({ error: "Site already exists", message: `Site '${siteName}' already exists in category '${catName}'` });
        }
        // Use provided icon or default icon
        const defaultIcon = {
            public_id: 'default-icon',
            url: '/temp/search.png'
        };
        
        const newUrl = {
            siteName,
            siteUrl,
            icon: icon && icon.public_id && icon.url ? icon : defaultIcon,
            isChecked: typeof isChecked === 'boolean' ? isChecked : true
        };
        const updatedUser = await UserPreferences.findOneAndUpdate(
            { userId: userId },
            { $push: { [`engine.${categoryIndex}.url`]: newUrl } },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to add URL" });
        }
        res.status(201).json({ success: true, message: "URL added successfully", url: newUrl, categoryName: catName, userId });
    } catch (error) {
        console.error('Error adding URL:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// PATCH /api/setting/users/:userId/categories/:catName/urls/:siteName
// Edit a URL (partial update)
module.exports.editNewUrl = async (req, res) => {
    try {
        const { userId, catName, siteName } = req.params;
        const { newSiteName, siteUrl, icon, isChecked } = req.body;
        if (!userId || !catName || !siteName) {
            return res.status(400).json({ error: "Missing required fields", required: ["userId", "catName", "siteName"] });
        }
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in editNewUrl: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        const categoryIndex = user.engine.findIndex(cat => cat.categoryName === catName);
        if (categoryIndex === -1) {
            return res.status(404).json({ error: "Category not found", catName });
        }
        const urlIndex = user.engine[categoryIndex].url.findIndex(url => url.siteName === siteName);
        if (urlIndex === -1) {
            return res.status(404).json({ error: "URL not found", siteName });
        }
        const updateFields = {};
        if (newSiteName) updateFields[`engine.${categoryIndex}.url.${urlIndex}.siteName`] = newSiteName;
        if (siteUrl) updateFields[`engine.${categoryIndex}.url.${urlIndex}.siteUrl`] = siteUrl;
        if (icon && icon.public_id && icon.url) {
            updateFields[`engine.${categoryIndex}.url.${urlIndex}.icon`] = icon;
        }
        if (typeof isChecked === 'boolean') {
            updateFields[`engine.${categoryIndex}.url.${urlIndex}.isChecked`] = isChecked;
        }
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No changes provided" });
        }
        const updatedUser = await UserPreferences.findOneAndUpdate(
            { userId: userId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to update URL" });
        }
        const updatedUrl = updatedUser.engine[categoryIndex].url[urlIndex];
        res.status(200).json({ success: true, message: "URL updated successfully", url: updatedUrl, categoryName: catName, userId });
    } catch (error) {
        console.error('Error editing URL:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// DELETE /api/setting/users/:userId/categories/:catName/urls/:siteName
// Delete a URL
module.exports.delNewUrl = async (req, res) => {
    try {
        const { userId, catName, siteName } = req.params;
        if (!userId || !catName || !siteName) {
            return res.status(400).json({ error: "Missing required fields", required: ["userId", "catName", "siteName"] });
        }
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in delNewUrl: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        const categoryIndex = user.engine.findIndex(cat => cat.categoryName === catName);
        if (categoryIndex === -1) {
            return res.status(404).json({ error: "Category not found", catName });
        }
        const urlIndex = user.engine[categoryIndex].url.findIndex(url => url.siteName === siteName);
        if (urlIndex === -1) {
            return res.status(404).json({ error: "URL not found", siteName });
        }
        const updatedUser = await UserPreferences.findOneAndUpdate(
            { userId: userId },
            { $pull: { [`engine.${categoryIndex}.url`]: { siteName } } },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to delete URL" });
        }
        res.status(200).json({ success: true, message: "URL deleted successfully", siteName, categoryName: catName, userId });
    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// PATCH /api/setting/users/:userId/categories/:catName/urls/:siteName/toggle
// Toggle isChecked for a URL
module.exports.toggleUrl = async (req, res) => {
    try {
        const { userId, catName, siteName } = req.params;
        if (!userId || !catName || !siteName) {
            return res.status(400).json({ error: "Missing required fields", required: ["userId", "catName", "siteName"] });
        }
        // Find user or create if doesn't exist
        let user = await UserPreferences.findOne({ userId: userId });
        if (!user) {
            console.log(`🆕 Creating new user in toggleUrl: ${userId}`);
            const userData = getDefaultUserData(userId);
            user = await UserPreferences.create(userData);
        }
        const categoryIndex = user.engine.findIndex(category => category.categoryName === catName);
        if (categoryIndex === -1) {
            return res.status(404).json({ error: "Category not found", catName, userId });
        }
        const urlIndex = user.engine[categoryIndex].url.findIndex(url => url.siteName === siteName);
        if (urlIndex === -1) {
            return res.status(404).json({ error: "URL not found", siteName });
        }
        const currentUrl = user.engine[categoryIndex].url[urlIndex];
        const newIsChecked = !currentUrl.isChecked;
        const updatedUser = await UserPreferences.findOneAndUpdate(
            { userId: userId },
            { $set: { [`engine.${categoryIndex}.url.${urlIndex}.isChecked`]: newIsChecked } },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to toggle URL" });
        }
        const updatedUrl = updatedUser.engine[categoryIndex].url[urlIndex];
        res.status(200).json({ success: true, message: `URL ${newIsChecked ? 'enabled' : 'disabled'} successfully`, url: updatedUrl, categoryName: catName, userId, isChecked: newIsChecked });
    } catch (error) {
        console.error('Error toggling URL:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// POST /api/setting/users/:userId/reset-to-default
// Reset user data to default values
module.exports.resetToDefault = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId in params" });
        }
        
        // Get default data for this user
        const defaultData = getDefaultUserData(userId);
        
        // Update user with default data
        const updatedUser = await UserPreferences.findOneAndUpdate(
            { userId: userId },
            { 
                engine: defaultData.engine,
                updatedAt: new Date(),
                lastActivity: new Date()
            },
            { new: true, runValidators: true, upsert: true }
        );
        
        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to reset user data" });
        }
        
        console.log(`✅ User ${userId} data reset to default with ${updatedUser.engine.length} categories`);
        
        res.status(200).json({ 
            success: true, 
            message: "User data reset to default successfully",
            userId,
            categoriesCount: updatedUser.engine.length,
            totalSites: updatedUser.engine.reduce((total, cat) => total + cat.url.length, 0)
        });
    } catch (error) {
        console.error('Error resetting user data:', error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

