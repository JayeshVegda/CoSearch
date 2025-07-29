const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const UserPreferences = require('../models/userPreferencesModel');
const cloudinary = require('../utils/cloudinaryConfig');
require('dotenv').config();

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// 2. Helper to upload a single image
async function uploadImage(localPath, publicId) {
  return cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    folder: 'coshot_icons', // optional: organize in a folder
    overwrite: true,
    transformation: [
      { width: 48, height: 48, crop: 'fill' }, // Resize and crop to 48x48
    ],
  });
}

// 3. Main function
async function main() {
  const tempDir = path.join(__dirname, '../public/temp');
  const files = fs.readdirSync(tempDir).filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));

  // Map: filename (without extension) => Cloudinary upload result
  const uploadResults = {};

  for (const file of files) {
    const publicId = path.parse(file).name;
    const localPath = path.join(tempDir, file);
    try {
      const result = await uploadImage(localPath, publicId);
      uploadResults[publicId] = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      console.log(`Uploaded ${file} as ${result.public_id}`);
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err);
    }
  }

  // 4. Update all user preferences in DB
  const users = await UserPreferences.find();
  for (const user of users) {
    let updated = false;
    for (const category of user.engine) {
      for (const urlObj of category.url) {
        const iconId = urlObj.icon.public_id;
        if (uploadResults[iconId]) {
          urlObj.icon.public_id = uploadResults[iconId].public_id;
          urlObj.icon.url = uploadResults[iconId].url;
          updated = true;
        }
      }
    }
    if (updated) {
      await user.save();
      console.log(`Updated user ${user.userId}`);
    }
  }

  mongoose.disconnect();
  console.log('Done!');
}

main();
