const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.authenticateToken);

router.post('/', taskController.create);
router.get('/', taskController.getAllByProject);
router.get('/:taskId', taskController.getById);
router.patch('/:taskId', taskController.update);
router.delete('/:taskId', taskController.delete);

module.exports = router;