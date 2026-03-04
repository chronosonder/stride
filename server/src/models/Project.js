const { PROJECT_STATUSES } = require('../utils/constants');

/**
 * @typedef {Object} Project
 * @property {number} id - The unique identifier for the project
 * @property {number} userId - The ID of the user who owns the project
 * @property {string} name - The name of the project
 * @property {string} description - description of the project.
 * @property {string} status - The current status of the project ('active', 'completed', 'cancelled').
 * @property {Date} createdAt - The date and time when the project was created.
 * @property {Date} updatedAt - The date and time when the project was last updated.
 */
class Project {
    constructor(id, userId, name, description, status = PROJECT_STATUSES.ACTIVE, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toPublic() {
        return {
            id: this.id,
            userId: this.userId,
            name: this.name,
            description: this.description,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Project;