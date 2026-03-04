const UserRepository = require('../repositories/userRepository');
const { BadRequestError, UnauthorizedError } = require('../utils/customErrors');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/authHelpers');
// const jwt = require('jsonwebtoken');

const authService = {

    /**
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @returns {Promise<User>}
     */
    async register(username, email, password) {
        if (!username || !email || !password) throw new BadRequestError('Missing fields');

        const existingUser = await UserRepository.getByEmail(email);
        if (existingUser) throw new BadRequestError('User already exists');

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
        if (!user) throw new UnauthorizedError('Invalid email or password');

        const isPasswordValid = await user.verifyPassword(password, bcrypt);
        if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

        const token = generateToken(user);

        return { user, token };
    },

    /**
     * @param {int} userId 
     * @param {object} updates 
     * @returns {Promise<User>}
     */
    async update(userId, updates) {
        if (Object.keys(updates).length === 0) throw new BadRequestError('No fields to update');

        if (updates.password) {
            updates.passwordHash = await bcrypt.hash(updates.password, 10);
            delete updates.password;
        }

        return await UserRepository.update(userId, updates);
    },

    /**
     * 
     * @param {int} userId 
     * @returns 
     */
    async getById(userId) {
        if (!userId) throw new BadRequestError('User ID is required');

        return await UserRepository.getById(userId);
    },

    /**
     * @param {int} userId 
     * @returns {Promise<boolean>}
     */
    async delete(userId) {
        if (!userId) throw new BadRequestError('User ID is required');

        return await UserRepository.delete(userId);
    }

}

module.exports = authService;