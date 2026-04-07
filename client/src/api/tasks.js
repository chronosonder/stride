import request from './client';

export const getTasks = (projectId) =>
    request('GET', `/projects/${projectId}/tasks`);

export const getTask = (projectId, taskId) =>
    request('GET', `/projects/${projectId}/tasks/${taskId}`);

// Used for all task types
export const createTask = (projectId, data) =>
    request('POST', `/projects/${projectId}/tasks`, data);

export const updateTask = (projectId, taskId, updates) =>
    request('PATCH', `/projects/${projectId}/tasks/${taskId}`, updates);

export const deleteTask = (projectId, taskId) =>
    request('DELETE', `/projects/${projectId}/tasks/${taskId}`);