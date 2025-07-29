const adminAuth = (req, res, next) => {
  const { password } = req.query;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!password || password !== adminPassword) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid admin password.',
    });
  }

  next();
};

module.exports = { adminAuth };
