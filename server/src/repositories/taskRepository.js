const knex = require('../db/knex');
const Task = require('../models/Task');

class TaskRepository {

    static async create(projectId, title, description, dueDate, taskType, parentTaskId, trx) {
        const db = trx || knex;

        const [row] = await db('tasks')
            .insert({
                project_id: projectId,
                title,
                description,
                due_date: dueDate,
                task_type: taskType,
                parent_task_id: parentTaskId
            })
            .returning('*');

        return this.mapRowToTask(row);
    }

    // Ownership check is done by joining with projects table and filtering by user_id
    static async getById(taskId, userId, trx) {
        const db = trx || knex;

        const row = await db('tasks')
            .join('projects', 'tasks.project_id', 'projects.project_id')
            .where({ 'tasks.task_id': taskId, 'projects.user_id': userId })
            .select('tasks.*')
            .first();

        return this.mapRowToTask(row);
    }

    // Get all tasks for a project, ensuring the user owns the project
    static async getAllByProject(projectId, userId, trx) {
        const db = trx || knex;

        const rows = await db('tasks')
            .join('projects', 'tasks.project_id', 'projects.project_id')
            .where({ 'tasks.project_id': projectId, 'projects.user_id': userId })
            .select('tasks.*')
            .orderBy('tasks.created_at', 'desc');

        return rows.map(row => this.mapRowToTask(row));
    }

    static async update(taskId, userId, updates, trx) {
        const db = trx || knex;

        const [row] = await db('tasks')
            .where('task_id', taskId)
            .whereIn('project_id',
                knex('projects')
                    .select('project_id')
                    .where('user_id', userId)
            )
            .update({ ...updates })
            .returning('*');

        return this.mapRowToTask(row);
    }

    static async delete(taskId, userId, trx) {
        const db = trx || knex;

        const rowCount = await db('tasks')
            .join('projects', 'tasks.project_id', 'projects.project_id')
            .where({ 'tasks.task_id': taskId, 'projects.user_id': userId })
            .del();

        return rowCount > 0;
    }

    static mapRowToTask(row) {
        if (!row) return null;
        return new Task(
            row.task_id,
            row.project_id,
            row.title,
            row.description,
            row.due_date,
            row.status,
            row.task_type,
            row.parent_task_id,
            row.created_at,
            row.updated_at
        );
    }
}

module.exports = TaskRepository;