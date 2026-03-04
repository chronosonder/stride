const knex = require('../db/knex');
const Project = require('../models/Project');

class ProjectRepository {

    /**
     * Create a new project
     * @param {number} userId 
     * @param {string} name 
     * @param {string} description 
     * @param {knex.Transaction} trx 
     * @returns {Promise<Project>}
     */
    static async create(userId, name, description, trx) {
        const db = trx || knex;
        const [row] = await db('projects')
            .insert({
                user_id: userId,
                name,
                description,
            })
            .returning('*');

        return this.mapRowToProject(row);
    }

    /**
     * Get a project by id and user id
     * @param {number} projectId 
     * @param {number} userId 
     * @param {knex.Transaction} trx 
     * @returns {Promise<Project|null>}
     */
    static async getById(projectId, userId, trx) {
        const db = trx || knex;
        const row = await db('projects')
            .where({ project_id: projectId, user_id: userId })
            .first();

        return this.mapRowToProject(row);
    }

    /**
     * Get all projects for a user
     * @param {number} userId 
     * @param {knex.Transaction} trx 
     * @returns {Promise<Project[]|null>}
     */
    static async getAllByUserId(userId, trx) {
        const db = trx || knex;
        const rows = await db('projects')
            .where({ user_id: userId })
            .orderBy('created_at', 'desc');

        return rows.map(row => this.mapRowToProject(row));
    }

    /**
     * Update a project
     * @param {number} projectId 
     * @param {number} userId 
     * @param {Object} updates 
     * @param {knex.Transaction} trx 
     * @returns {Promise<Project|null>}
     */
    static async update(projectId, userId, updates, trx) {
        const db = trx || knex;
        const [row] = await db('projects')
            .where({ project_id: projectId, user_id: userId })
            .update(updates)
            .returning('*');

        return this.mapRowToProject(row);
    }

    /**
     * Delete a project
     * @param {number} projectId 
     * @param {number} userId 
     * @param {knex.Transaction} trx 
     * @returns {Promise<boolean>}
     */
    static async delete(projectId, userId, trx) {
        const db = trx || knex;
        const rowCount = await db('projects')
            .where({ project_id: projectId, user_id: userId })
            .del();

        return rowCount > 0;
    }

    static mapRowToProject(row) {
        if (!row) return null;
        return new Project(
            row.project_id,
            row.user_id,
            row.name,
            row.description,
            row.status,
            row.created_at,
            row.updated_at
        );
    }
}

module.exports = ProjectRepository;