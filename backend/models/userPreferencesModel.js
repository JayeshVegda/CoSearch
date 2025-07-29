const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 50,
    trim: true
  },
  engine: [{
    categoryName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 15,
      trim: true
    },
    description: {
      type: String,
      required: false,
      default: '',
      maxlength: 200,
      trim: true
    },
    url: [{
      siteName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20,
        trim: true
      },
      siteUrl: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function(v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: 'Site URL must be a valid HTTP/HTTPS URL'
        }
      },
      icon: {
        public_id: {
          type: String,
          trim: true
        },
        url: {
          type: String,
          trim: true,
          validate: {
            validator: function(v) {
              return /^\/temp\/.+\.(png|jpg|jpeg|svg|webp)$/.test(v);
            },
            message: 'Icon URL must be a valid image path starting with /temp/'
          }
        }
      },
      isChecked: {
        type: Boolean,
        default: true
      }
    }]
  }],
  lastActivity: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true,
  strict: true
});

// Index for efficient queries (userId already has unique index from schema)
userPreferencesSchema.index({ lastActivity: 1 });

// Pre-save middleware to ensure data consistency
userPreferencesSchema.pre('save', function(next) {
  // Ensure lastActivity is always set
  if (!this.lastActivity) {
    this.lastActivity = new Date();
  }
  
  // Ensure engine array exists
  if (!this.engine) {
    this.engine = [];
  }
  
  next();
});

// Virtual for getting total number of sites
userPreferencesSchema.virtual('totalSites').get(function() {
  return this.engine.reduce((total, category) => total + category.url.length, 0);
});

// Virtual for getting checked sites count
userPreferencesSchema.virtual('checkedSites').get(function() {
  return this.engine.reduce((total, category) => {
    return total + category.url.filter(site => site.isChecked).length;
  }, 0);
});

// Method to get all checked sites
userPreferencesSchema.methods.getCheckedSites = function() {
  const checkedSites = [];
  this.engine.forEach(category => {
    category.url.forEach(site => {
      if (site.isChecked) {
        checkedSites.push({
          categoryName: category.categoryName,
          ...site
        });
      }
    });
  });
  return checkedSites;
};

// Method to get sites by category
userPreferencesSchema.methods.getSitesByCategory = function(categoryName) {
  const category = this.engine.find(cat => cat.categoryName === categoryName);
  return category ? category.url : [];
};

// Static method to find by userId with error handling
userPreferencesSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId }).exec();
};

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);