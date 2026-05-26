import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { browser } from '$app/environment';

import { PUBLIC_API_BASE_URL } from '$env/static/public';

// 1. Define Base Config
const BASE_URL = PUBLIC_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	}
});

// 2. Request Interceptor (e.g., adding Auth Token)
axiosInstance.interceptors.request.use(
	(config) => {
		// Only use js-cookie in the browser
		if (browser) {
			const token = Cookies.get('accessToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 3. Response Interceptor (Global Error Handling)
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Common Error Handling (401, 403, 500, etc)
		if (error.response) {
			switch (error.response.status) {
				case 401:
					console.error('Unauthorized! Redirecting to login...');
					if (browser) {
						Cookies.remove('accessToken', { path: '/' });
						// Optional: window.location.href = '/login' or similar for non-SPA
					}
					break;
				case 403:
					console.error('Forbidden! You do not have permission.');
					break;
				case 500:
					console.error('Internal Server Error! Please try again later.');
					break;
			}
		} else if (error.request) {
			console.error('Network Error: No response received from server.');
		} else {
			console.error('Error:', error.message);
		}
		return Promise.reject(error);
	}
);

// 4. Wrapped API Utility for Clean Usage
export const api = {
	get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => axiosInstance.get(url, config),
	post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
		axiosInstance.post(url, data, config),
	put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
		axiosInstance.put(url, data, config),
	patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
		axiosInstance.patch(url, data, config),
	delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
		axiosInstance.delete(url, config)
};

export default axiosInstance;
