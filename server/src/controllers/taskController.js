const taskService = require('../services/taskService');
const asyncHandler = require('../middleware/asyncHandler');

const taskController = {
    create: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const projectId = parseInt(req.params.projectId, 10);
        const { title, description, dueDate, taskType, parentTaskId } = req.body;

        const task = await taskService.create(projectId, userId, title, description, dueDate, taskType, parentTaskId);

        res.status(201).json({
            success: true,
            data: task.toPublic()
        });
    }),

    getById: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const taskId = parseInt(req.params.taskId, 10);

        const task = await taskService.getById(taskId, userId);

        res.json({
            success: true,
            data: task.toPublic()
        });
    }),

    getAllByProject: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const projectId = parseInt(req.params.projectId, 10);

        const tasks = await taskService.getAllByProject(projectId, userId);

        res.json({
            success: true,
            data: tasks.map(task => task.toPublic())
        });
    }),

    update: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const taskId = parseInt(req.params.taskId, 10);
        const updates = req.body;

        const updatedTask = await taskService.update(taskId, userId, updates);

        res.json({
            success: true,
            data: updatedTask.toPublic()
        });
    }),

    delete: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const taskId = parseInt(req.params.taskId, 10);

        await taskService.delete(taskId, userId);

        res.json({
            success: true,
            data: null
        });
    }),
};

module.exports = taskController;