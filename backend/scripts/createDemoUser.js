const mongoose = require('mongoose');

const getDefaultUserData = require('../init/data');
const UserPreferences = require('../models/userPreferencesModel');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Remove any existing demo user
  await UserPreferences.deleteOne({ userId: 'demo' });

  // Get default data for demo user
  const demoData = getDefaultUserData('demo');

  // Build icon map from all users in DB
  const users = await UserPreferences.find();
  const iconMap = {};
  for (const user of users) {
    for (const category of user.engine) {
      for (const urlObj of category.url) {
        if (urlObj.icon && urlObj.icon.public_id && urlObj.icon.url && urlObj.icon.url.startsWith('http')) {
          iconMap[urlObj.icon.public_id] = { ...urlObj.icon };
        }
      }
    }
  }

  // If iconMap is empty, try to guess Cloudinary URLs from public_id
  function guessCloudinaryUrl(public_id) {
    // You may want to adjust this pattern to match your Cloudinary account/folder
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/coshot_icons/${public_id}.png`;
  }

  // Update demoData's icon URLs to Cloudinary URLs if possible
  for (const category of demoData.engine) {
    for (const urlObj of category.url) {
      if (iconMap[urlObj.icon.public_id]) {
        urlObj.icon = { ...iconMap[urlObj.icon.public_id] };
      } else {
        // Fallback: guess Cloudinary URL
        urlObj.icon.url = guessCloudinaryUrl(urlObj.icon.public_id);
      }
    }
  }

  // Save to DB
  await UserPreferences.create(demoData);

  mongoose.disconnect();
}

main();
