const BASE_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:3000/api';

async function request(method, endpoint, body = null) {
    const options = {
        method,
        credentials: 'include', // Include cookies for authentication
        headers: {}
    };

    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const json = await response.json();

    if (!json.success) {
        const error = new Error(json.error || 'Request failed');
        error.status = response.status;
        throw error;
    }

    return json.data;
}

export default request;