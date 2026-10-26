const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'USER') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'safewo_jwt_super_secret_key_2026_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

module.exports = { generateToken };
