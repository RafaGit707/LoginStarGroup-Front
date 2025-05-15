export const API_BASE_URL = 'http://localhost:5289/api/';


export const ENDPOINTS = {
    GET_USERS: `${API_BASE_URL}/users`,
    GET_USER_BY_ID: (userId) => `${API_BASE_URL}/users/${userId}`,
    CREATE_USER: `${API_BASE_URL}/users`,

    GET_PRODUCTS: `${API_BASE_URL}/products`,
    GET_PRODUCT_BY_ID: (productId) => `${API_BASE_URL}/products/${productId}`,

    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,

};
 