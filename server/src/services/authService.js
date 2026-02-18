const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const authService = {

    /**
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @returns {Promise<User>}
     */
    async register(username, email, password) {
        const existingUser = await UserRepository.getByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        return await UserRepository.create(username, email, hashedPassword);
    },

    /**
     * @param {string} email
     * @param {string} password
     * @return {Promise<User>}
     */
    async login(email, password) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await user.veirfyPassword(password, bcrypt);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        //JWT to-do

        return user.toPublic();
    },

    /**
     * @param {int} userId 
     * @param {object} updates 
     * @returns {Promise<User>}
     */
    async update(userId, updates) {
        if (updates.password) {
            updates.passwordHash = await bcrypt.hash(updates.password, 10);
            delete updates.password;
        }

        return await UserRepository.update(userId, updates).toPublic();
    },

    /**
     * @param {int} userId 
     * @returns {Promise<boolean>}
     */
    async delete(userId) {
        return await UserRepository.delete(userId);
    }

}

module.exports = authService;