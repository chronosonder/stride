import request from './client';

export const getAccount = () =>
    request('GET', '/auth/account');

export const login = (email, password) =>
    request('POST', '/auth/login', { email, password });

export const register = (username, email, password) =>
    request('POST', '/auth/register', { username, email, password });

export const logout = () =>
    request('POST', '/auth/logout');

export const updateAccount = (updates) =>
    request('PUT', '/auth/update', updates);

export const deleteAccount = () =>
    request('DELETE', '/auth/delete');