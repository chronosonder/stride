const projectService = require('../services/projectService');
const asyncHandler = require('../middleware/asyncHandler');
const { getAllByUserId } = require('../repositories/projectRepository');

const projectController = {
    create: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const { name, description } = req.body;

        const project = await projectService.create(userId, name, description);

        res.status(201).json({
            success: true,
            data: project.toPublic()
        });
    }),

    getById: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const projectId = parseInt(req.params.id);

        const project = await projectService.getById(projectId, userId);

        res.json({
            success: true,
            data: project.toPublic()
        });
    }),

    getAllByUserId: asyncHandler(async (req, res) => {
        const userId = req.user.id;

        const projects = await projectService.getAllByUserId(userId);

        res.json({
            success: true,
            data: projects.map(project => project.toPublic())
        });
    }),

    update: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const projectId = parseInt(req.params.id);
        const updates = req.body;

        const updatedProject = await projectService.update(projectId, userId, updates);

        res.json({
            success: true,
            data: updatedProject.toPublic()
        });
    }),

    delete: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const projectId = parseInt(req.params.id);

        await projectService.delete(projectId, userId);

        res.json({
            success: true,
            data: null
        });
    }),
};

module.exports = projectController;