const API_BASE_URL = 'http://localhost:3001/api/v1';

// --- Token Management ---

export const getToken = () => {
    return localStorage.getItem('authToken');
};

export const setToken = (token) => {
    localStorage.setItem('authToken', token);
};

export const removeToken = () => {
    localStorage.removeItem('authToken');
};

// --- Core API Fetch Function ---

const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // If response has no content, return success, otherwise return JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return { success: true };
    }
};

// We will add specific functions like login, getProfile, etc. here later.

// --- AUTH FUNCTIONS ---

export const register = async (userData) => {
    // userData should be an object with { email, password, username, fullName, role }
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const login = async (credentials) => {
    // credentials should be an object with { email, password }
    const result = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });

    // If the login is successful and we get a token, save it.
    if (result.token) {
        setToken(result.token);
    }
    return result;
};

export const logout = () => {
    // To log out, we just remove the token from storage.
    removeToken();
};


// --- PROFILE FUNCTIONS ---

export const getProfile = () => {
    // Our core apiFetch function handles the auth header automatically
    return apiFetch('/profile');
};

export const updateProfile = (profileData) => {
    // profileData is an object with { fullName, username, bio }
    return apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });
};

export const uploadAvatar = async (formData) => {
    // File uploads are special and don't use the 'Content-Type': 'application/json' header,
    // so we use a direct fetch call here. The browser sets the correct header automatically.
    const token = getToken();
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/avatar`, {
        method: 'POST',
        body: formData,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error uploading file');
    }
    return response.json();
};



export const getStats = () => {
    return apiFetch('/stats');
};


// --- PROGRAM FUNCTIONS ---

export const getPrograms = () => {
    return apiFetch('/programs');
};

export const getProgramById = (programId) => {
    return apiFetch(`/programs/${programId}`);
};