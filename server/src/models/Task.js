const { TASK_STATUSES, TASK_TYPES } = require('../utils/constants');

/**
 * @typedef {Object} Task
 * @property {number} id - The unique identifier for the task
 * @property {number} projectId - The ID of the project this task belongs to
 * @property {string} title - The title of the task
 * @property {string|null} description - The description of the task
 * @property {Date|null} dueDate - The due date of the task
 * @property {string} status - The current status of the task ('to-do', 'in-progress', 'done')
 * @property {string} taskType - The type of the task ('task', 'subtask', 'milestone', 'deliverable')
 * @property {number|null} parentTaskId - The ID of the parent task if this is a subtask
 * @property {Date} createdAt - The date and time when the task was created
 * @property {Date|null} updatedAt - The date and time when the task was last updated
 */
class Task {
    constructor(
        id,
        projectId,
        title,
        description = null,
        dueDate = null,
        status = TASK_STATUSES.TODO,
        taskType = TASK_TYPES.TASK,
        parentTaskId = null,
        createdAt,
        updatedAt = null
    ) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
        this.taskType = taskType;
        this.parentTaskId = parentTaskId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toPublic() {
        return {
            id: this.id,
            projectId: this.projectId,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            status: this.status,
            taskType: this.taskType,
            parentTaskId: this.parentTaskId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Task;