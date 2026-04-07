import request from './client';

export const getProjects = () =>
    request('GET', '/projects');

export const getProject = (projectId) =>
    request('GET', `/projects/${projectId}`);

export const createProject = (name, description) =>
    request('POST', '/projects', { name, description });

export const updateProject = (projectId, updates) =>
    request('PATCH', `/projects/${projectId}`, updates);

export const deleteProject = (projectId) =>
    request('DELETE', `/projects/${projectId}`);