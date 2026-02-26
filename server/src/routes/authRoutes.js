const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/account', authMiddleware.authenticateToken, authController.account);
router.post('/logout', authMiddleware.authenticateToken, authController.logout);
router.put('/update', authMiddleware.authenticateToken, authController.update);
router.delete('/delete', authMiddleware.authenticateToken, authController.delete);

module.exports = router;