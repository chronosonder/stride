const knex = require('../db/knex');
const User = require('../models/User');

class UserRepository {

    static async create(username, email, passwordHash, trx) {
        const db = knex || trx;
        const [row] = await db('users').
            insert({
                username,
                email,
                password_hash: passwordHash
            })
            .returning('*');

        return mapRowToUser(row);
    }

    static async getByEmail(email, trx) {
        const db = knex || trx;
        const row = await db('users')
            .where({ email })
            .first();

        return mapRowToUser(row);
    }

    static async getById(id, trx) {
        const db = knex || trx;
        const row = await db('users')
            .where({ user_id: id })
            .first();

        return mapRowToUser(row);
    }

    static async update(id, updates, trx) {
        const db = knex || trx;
        const updateData = {};
        if (updates.username) updateData.username = updates.username;
        if (updates.email) updateData.email = updates.email;
        if (updates.passwordHash) updateData.password_hash = updates.passwordHash;
        if (Object.keys(updateData).length === 0) return null; // No valid fields to update

        const [row] = await db('users')
            .where({ user_id: id })
            .update(updateData)
            .returning('*');

        return mapRowToUser(row);
    }

    static async delete(id, trx) {
        const db = knex || trx;
        const rowCount = await db('users')
            .where({ user_id: id })
            .del();

        return rowCount > 0;
    }

    // Helper function to map database row to User model instance
    static mapRowToUser(row) {
        if (!row) return null;
        return new User(
            row.id,
            row.username,
            row.email,
            row.password_hash,
            row.created_at,
            row.updated_at
        );
    }
}

module.exports = UserRepository;