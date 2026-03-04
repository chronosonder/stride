const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.authenticateToken); // All routes are protected

router.post('/', projectController.create);
router.get('/:id', projectController.getById);
router.get('/', projectController.getAllByUserId);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

module.exports = router;