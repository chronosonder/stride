const request = require('supertest');
const app = require('../app');
const db = require('../db/knex');

// Run migrations once before any tests in this file start
beforeAll(async () => {
    await db.migrate.latest();
});

// Close the connection so Jest can exit
afterAll(async () => {
    await db.destroy();
});

describe('Registration Testing', () => {

    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'tester',
                email: 'test@me.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.email).toBe('test@me.com');
    });

    it('should return error for duplicate email registration', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'tester2',
                email: 'test@me.com', // Using the same email as the first test to trigger duplicate error
                password: 'password123'
            });

        expect(res.statusCode).toBe(400); // Expecting a 400 error for duplicate email
        expect(res.body.success).toBe(false);
    });

    it('should return error for missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'tester3',
                // Missing email and password
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

});

describe('Login Testing', () => {

    it('should login a user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@me.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.email).toBe('test@me.com');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('username');
        expect(res.body.data).toHaveProperty('createdAt');
    });

    it('should return error for invalid login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@me.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBe(401); // Expecting a 401 error for invalid credentials
        expect(res.body.success).toBe(false);
    });

    it('should return error for non-existent user login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@me.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(401); // Expecting a 401 error for non-existent user
        expect(res.body.success).toBe(false);

    });
});

describe('Test Protected Routes', () => {
    let authCookie;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@me.com',
                password: 'password123'
            });

        authCookie = res.headers['set-cookie'];
    });

    it('should get user account details', async () => {
        const res = await request(app)
            .get('/api/auth/account')
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.email).toBe('test@me.com');
        expect(res.body.data.username).toBe('tester');
    });


    it('should update user details', async () => {
        const res = await request(app)
            .put('/api/auth/update')
            .set('Cookie', authCookie)
            .send({
                username: 'updatedTester'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.username).toBe('updatedTester');
    });

    it('should throw error for unauthorized update attempt', async () => {
        const res = await request(app)
            .put('/api/auth/update')
            .send({
                username: 'unauthorizedUpdate'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it('should clear the cookie on logout', async () => {
        const agent = request.agent(app);

        await agent.post('/api/auth/login').send({
            email: 'test@me.com',
            password: 'password123'
        });

        const logoutRes = await agent.post('/api/auth/logout');

        expect(logoutRes.headers['set-cookie'][0]).toMatch(/token=;/);

        const profileRes = await agent.get('/api/auth/account');
        expect(profileRes.statusCode).toBe(401);
    });

    it('should delete the user', async () => {
        const res = await request(app)
            .delete('/api/auth/delete')
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

});