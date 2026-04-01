const TaskRepository = require('../repositories/taskRepository');
const { BadRequestError, NotFoundError } = require('../utils/customErrors');
const { TASK_STATUSES, TASK_TYPES } = require('../utils/constants');

const taskService = {

    async create(projectId, userId, title, description, dueDate, taskType, parentTaskId) {
        if (!title) throw new BadRequestError('Task title is required');

        // Enforce subtask rules
        if (taskType === TASK_TYPES.SUBTASK && !parentTaskId) {
            throw new BadRequestError('A subtask must have a parent task');
        }
        if (parentTaskId && taskType !== TASK_TYPES.SUBTASK) {
            throw new BadRequestError('A task with a parent must be of type subtask');
        }

        // Prevent nesting subtasks
        if (parentTaskId) {
            const parentTask = await TaskRepository.getById(parentTaskId, userId);
            if (!parentTask) throw new NotFoundError('Parent task not found');
            if (parentTask.taskType === TASK_TYPES.SUBTASK) {
                throw new BadRequestError('A subtask cannot be a parent task');
            }
        }

        return await TaskRepository.create(projectId, title, description, dueDate, taskType, parentTaskId);
    },

    async getById(taskId, userId) {
        const task = await TaskRepository.getById(taskId, userId);
        if (!task) throw new NotFoundError('Task not found');

        return task;
    },

    async getAllByProject(projectId, userId) {
        return await TaskRepository.getAllByProject(projectId, userId);
    },

    async update(taskId, userId, updates) {
        const updateData = {};
        if (updates.title) updateData.title = updates.title;
        if (updates.description) updateData.description = updates.description;
        if (updates.dueDate) updateData.due_date = updates.dueDate;
        if (updates.status) {
            if (!Object.values(TASK_STATUSES).includes(updates.status)) {
                throw new BadRequestError('Invalid task status');
            }
            updateData.status = updates.status;
        }
        if (updates.taskType) {
            if (!Object.values(TASK_TYPES).includes(updates.taskType)) {
                throw new BadRequestError('Invalid task type');
            }
            updateData.task_type = updates.taskType;
        }
        if (Object.keys(updateData).length === 0) throw new BadRequestError('No fields to update');

        const updatedTask = await TaskRepository.update(taskId, userId, updateData);
        if (!updatedTask) throw new NotFoundError('Task not found');

        return updatedTask;
    },

    async delete(taskId, userId) {
        const success = await TaskRepository.delete(taskId, userId);
        if (!success) throw new NotFoundError('Task not found');

        return success;
    }
};

module.exports = taskService;