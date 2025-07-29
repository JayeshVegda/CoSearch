const Joi = require('joi');

// Validation schemas
const schemas = {
  // User registration
  register: Joi.object({
    userId: Joi.string().min(10).max(50).required()
  }),

  // Search request
  search: Joi.object({
    userId: Joi.string().min(10).max(50).required(),
    categoryName: Joi.string().min(1).max(100).required()
  }),

  // Category operations
  addCategory: Joi.object({
    categoryName: Joi.string().min(1).max(15).pattern(/^[a-zA-Z0-9\s\-_]+$/).required(),
    description: Joi.string().min(1).max(200).optional().default('')
  }),

  editCategory: Joi.object({
    newCategoryName: Joi.string().min(1).max(15).pattern(/^[a-zA-Z0-9\s\-_]+$/).optional(),
    newDescription: Joi.string().min(1).max(200).optional()
  }),

  // URL operations
  addUrl: Joi.object({
    siteName: Joi.string().min(1).max(20).required(),
    siteUrl: Joi.string().uri().required(),
    icon: Joi.object({
      public_id: Joi.string().optional(),
      url: Joi.string().uri().optional()
    }).optional(),
    isChecked: Joi.boolean().default(true)
  }),

  editUrl: Joi.object({
    newSiteName: Joi.string().min(1).max(20).optional(),
    siteUrl: Joi.string().uri().optional(),
    icon: Joi.object({
      public_id: Joi.string().optional(),
      url: Joi.string().uri().optional()
    }).optional(),
    isChecked: Joi.boolean().optional()
  })
};

// Validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({ error: 'Validation schema not found' });
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    // Replace request body with validated data
    req.body = value;
    next();
  };
};

// URL parameter validation
const validateParams = (paramSchema) => {
  return (req, res, next) => {
    const { error } = paramSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        error: 'Invalid parameters',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Common parameter schemas
const paramSchemas = {
  userId: Joi.object({
    userId: Joi.string().min(10).max(50).required()
  }),
  
  category: Joi.object({
    userId: Joi.string().min(10).max(50).required(),
    catName: Joi.string().min(1).max(15).required()
  }),
  
  url: Joi.object({
    userId: Joi.string().min(10).max(50).required(),
    catName: Joi.string().min(1).max(15).required(),
    siteName: Joi.string().min(1).max(20).required()
  })
};

module.exports = {
  validate,
  validateParams,
  paramSchemas
}; 