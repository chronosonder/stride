const ProjectRepository = require('../repositories/projectRepository');
const { BadRequestError, NotFoundError } = require('../utils/customErrors');
const { PROJECT_STATUSES } = require('../utils/constants');

const projectService = {

    async create(userId, name, description) {
        if (!name) throw new BadRequestError('Project name is required');

        return await ProjectRepository.create(userId, name, description);
    },

    async getById(projectId, userId) {
        const project = await ProjectRepository.getById(projectId, userId);
        if (!project) throw new NotFoundError('Project not found');

        return project;
    },

    async getAllByUserId(userId) {
        return await ProjectRepository.getAllByUserId(userId);
    },

    async update(projectId, userId, updates) {
        const updateData = {};

        if (updates.name) updateData.name = updates.name;
        if (updates.description) updateData.description = updates.description;
        if (updates.status) {
            if (!Object.values(PROJECT_STATUSES).includes(updates.status)) {
                throw new BadRequestError('Invalid project status');
            } else {
                updateData.status = updates.status;
            }
        }
        if (Object.keys(updateData).length === 0) throw new BadRequestError('No fields to update');

        const updatedProject = await ProjectRepository.update(projectId, userId, updateData);
        if (!updatedProject) throw new NotFoundError('Project not found.');

        return updatedProject;
    },

    async delete(projectId, userId) {
        const success = await ProjectRepository.delete(projectId, userId);
        if (!success) throw new NotFoundError('Project not found.');

        return success;
    },
}

module.exports = projectService;