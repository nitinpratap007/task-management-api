// ==========================================
// AUTH ROUTES — Public (no token required)
// ==========================================

const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { validate, registerRules, loginRules } = require('../validators/validators');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

module.exports = router;
