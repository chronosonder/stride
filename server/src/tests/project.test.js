const request = require('supertest');
const app = require('../app');
const db = require('../db/knex');

beforeAll(async () => {
    await db.migrate.latest();

    // Register and login a user to use across tests
    await request(app)
        .post('/api/auth/register')
        .send({
            username: 'projectTester',
            email: 'project@test.com',
            password: 'password123'
        });
});

afterAll(async () => {
    await db.destroy();
});

describe('Project CRUD', () => {
    let authCookie;
    let projectId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'project@test.com',
                password: 'password123'
            });

        authCookie = res.headers['set-cookie'];
    });

    it('should create a project', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Cookie', authCookie)
            .send({
                name: 'Test Project',
                description: 'A test project'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Test Project');
        expect(res.body.data.status).toBe('active');
        expect(res.body.data).toHaveProperty('id');

        projectId = res.body.data.id;
    });

    it('should return error when creating project without a name', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Cookie', authCookie)
            .send({
                description: 'Missing name'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should get all projects for the user', async () => {
        const res = await request(app)
            .get('/api/projects')
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get a project by id', async () => {
        const res = await request(app)
            .get(`/api/projects/${projectId}`)
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(projectId);
    });

    it('should return 404 for a non-existent project', async () => {
        const res = await request(app)
            .get('/api/projects/99999')
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should update a project', async () => {
        const res = await request(app)
            .put(`/api/projects/${projectId}`)
            .set('Cookie', authCookie)
            .send({
                name: 'Updated Project',
                status: 'completed'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Updated Project');
        expect(res.body.data.status).toBe('completed');
    });

    it('should return error for invalid status', async () => {
        const res = await request(app)
            .put(`/api/projects/${projectId}`)
            .set('Cookie', authCookie)
            .send({
                status: 'invalid_status'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return error for empty update', async () => {
        const res = await request(app)
            .put(`/api/projects/${projectId}`)
            .set('Cookie', authCookie)
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should delete a project', async () => {
        const res = await request(app)
            .delete(`/api/projects/${projectId}`)
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeNull();
    });

    it('should return 404 after deleting a project', async () => {
        const res = await request(app)
            .get(`/api/projects/${projectId}`)
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('Project Auth Protection', () => {
    it('should return 401 for unauthenticated project list request', async () => {
        const res = await request(app)
            .get('/api/projects');

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should return 401 for unauthenticated project creation', async () => {
        const res = await request(app)
            .post('/api/projects')
            .send({ name: 'Sneaky Project' });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

describe('Project Ownership Enforcement', () => {
    let ownerCookie;
    let unauthorisedCookie;
    let projectId;

    beforeAll(async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'owner', email: 'owner@test.com', password: 'password123' });

        await request(app)
            .post('/api/auth/register')
            .send({ username: 'intruder', email: 'intruder@test.com', password: 'password123' });

        const ownerLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'owner@test.com', password: 'password123' });
        ownerCookie = ownerLogin.headers['set-cookie'];

        const unauthorisedUser = await request(app)
            .post('/api/auth/login')
            .send({ email: 'intruder@test.com', password: 'password123' });
        unauthorisedCookie = unauthorisedUser.headers['set-cookie'];

        const project = await request(app)
            .post('/api/projects')
            .set('Cookie', ownerCookie)
            .send({ name: 'Owner Project' });
        projectId = project.body.data.id;
    });

    it('should not allow intruder to get owner project', async () => {
        const res = await request(app)
            .get(`/api/projects/${projectId}`)
            .set('Cookie', unauthorisedCookie);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should not allow intruder to update owner project', async () => {
        const res = await request(app)
            .put(`/api/projects/${projectId}`)
            .set('Cookie', unauthorisedCookie)
            .send({ name: 'Hijacked' });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should not allow intruder to delete owner project', async () => {
        const res = await request(app)
            .delete(`/api/projects/${projectId}`)
            .set('Cookie', unauthorisedCookie);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});
