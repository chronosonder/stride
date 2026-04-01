const request = require('supertest');
const app = require('../app');
const db = require('../db/knex');

beforeAll(async () => {
    await db.migrate.latest();

    await request(app)
        .post('/api/auth/register')
        .send({
            username: 'taskTester',
            email: 'task@test.com',
            password: 'password123'
        });
});

afterAll(async () => {
    await db.destroy();
});

describe('Task CRUD', () => {
    let authCookie;
    let projectId;
    let taskId;

    beforeAll(async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'task@test.com', password: 'password123' });
        authCookie = login.headers['set-cookie'];

        const project = await request(app)
            .post('/api/projects')
            .set('Cookie', authCookie)
            .send({ name: 'Task Test Project' });
        projectId = project.body.data.id;
    });

    it('should create a task', async () => {
        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie)
            .send({ title: 'Test Task' });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Test Task');
        expect(res.body.data.status).toBe('to-do');
        expect(res.body.data.taskType).toBe('task');
        expect(res.body.data).toHaveProperty('id');

        taskId = res.body.data.id;
    });

    it('should create a task with all optional fields', async () => {
        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie)
            .send({
                title: 'Full Task',
                description: 'A fully populated task',
                dueDate: '2026-12-31',
                taskType: 'milestone'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.taskType).toBe('milestone');
        expect(res.body.data.description).toBe('A fully populated task');
    });

    it('should return error when creating task without a title', async () => {
        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie)
            .send({ description: 'No title here' });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should get all tasks for a project', async () => {
        const res = await request(app)
            .get(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get a task by id', async () => {
        const res = await request(app)
            .get(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(taskId);
    });

    it('should return 404 for a non-existent task', async () => {
        const res = await request(app)
            .get(`/api/projects/${projectId}/tasks/99999`)
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should update a task', async () => {
        const res = await request(app)
            .patch(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', authCookie)
            .send({ title: 'Updated Task', status: 'in-progress' });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Updated Task');
        expect(res.body.data.status).toBe('in-progress');
    });

    it('should return error for invalid task status', async () => {
        const res = await request(app)
            .patch(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', authCookie)
            .send({ status: 'invalid_status' });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return error for invalid task type', async () => {
        const res = await request(app)
            .patch(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', authCookie)
            .send({ taskType: 'invalid_type' });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return error for empty update', async () => {
        const res = await request(app)
            .patch(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', authCookie)
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should delete a task', async () => {
        const res = await request(app)
            .delete(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeNull();
    });

    it('should return 404 after deleting a task', async () => {
        const res = await request(app)
            .get(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', authCookie);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('Subtask Rules', () => {
    let authCookie;
    let projectId;
    let parentTaskId;
    let subtaskId;

    beforeAll(async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'task@test.com', password: 'password123' });
        authCookie = login.headers['set-cookie'];

        const project = await request(app)
            .post('/api/projects')
            .set('Cookie', authCookie)
            .send({ name: 'Subtask Test Project' });
        projectId = project.body.data.id;

        const parentTask = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie)
            .send({ title: 'Parent Task' });
        parentTaskId = parentTask.body.data.id;
    });

    it('should create a subtask with a valid parent', async () => {
        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie)
            .send({
                title: 'Subtask',
                taskType: 'subtask',
                parentTaskId
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.taskType).toBe('subtask');
        expect(res.body.data.parentTaskId).toBe(parentTaskId);

        subtaskId = res.body.data.id;
    });

    it('should return error when creating subtask without parentTaskId', async () => {
        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie)
            .send({ title: 'Orphan Subtask', taskType: 'subtask' });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return error when providing parentTaskId without subtask type', async () => {
        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie)
            .send({ title: 'Confused Task', taskType: 'task', parentTaskId });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return error when nesting a subtask under another subtask', async () => {
        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', authCookie)
            .send({
                title: 'Nested Subtask',
                taskType: 'subtask',
                parentTaskId: subtaskId
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('Task Auth Protection', () => {
    it('should return 401 for unauthenticated task list request', async () => {
        const res = await request(app)
            .get('/api/projects/1/tasks');

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should return 401 for unauthenticated task creation', async () => {
        const res = await request(app)
            .post('/api/projects/1/tasks')
            .send({ title: 'Sneaky Task' });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

describe('Task Ownership Enforcement', () => {
    let ownerCookie;
    let unauthorisedCookie;
    let projectId;
    let taskId;

    beforeAll(async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'taskOwner', email: 'taskowner@test.com', password: 'password123' });

        await request(app)
            .post('/api/auth/register')
            .send({ username: 'taskIntruder', email: 'taskintruder@test.com', password: 'password123' });

        const ownerLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'taskowner@test.com', password: 'password123' });
        ownerCookie = ownerLogin.headers['set-cookie'];

        const unauthorisedLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'taskintruder@test.com', password: 'password123' });
        unauthorisedCookie = unauthorisedLogin.headers['set-cookie'];

        const project = await request(app)
            .post('/api/projects')
            .set('Cookie', ownerCookie)
            .send({ name: 'Owner Task Project' });
        projectId = project.body.data.id;

        const task = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Cookie', ownerCookie)
            .send({ title: 'Owner Task' });
        taskId = task.body.data.id;
    });

    it('should not allow intruder to get owner task', async () => {
        const res = await request(app)
            .get(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', unauthorisedCookie);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should not allow intruder to update owner task', async () => {
        const res = await request(app)
            .patch(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', unauthorisedCookie)
            .send({ title: 'Hijacked' });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should not allow intruder to delete owner task', async () => {
        const res = await request(app)
            .delete(`/api/projects/${projectId}/tasks/${taskId}`)
            .set('Cookie', unauthorisedCookie);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});