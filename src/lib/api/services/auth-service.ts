import Cookies from 'js-cookie';
import { api } from '../axios';
import type { AxiosResponse } from 'axios';
import { browser } from '$app/environment';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface User {
    id: number;
    uuid: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
}

export interface LoginResponse {
    data: {
        access_token?: string;
        refresh_token?: string;
        expires_in: number;
        mfa_required: boolean;
        challenge_id?: number;
        user?: User;
    };
    message: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface OtpRequestResponse {
    data: {
        challenge_id: number;
        expires_in: number;
    };
    message: string;
}

export interface OtpRequestPayload {
    email: string;
}

export interface OtpVerifyPayload {
    challenge_id: number | null;
    otp_code: string;
    device_fingerprint: string;
    platform: string;
    device_name: string;
}

export interface MfaVerifyPayload {
    challenge_id: number;
    otp_code: string;
    device_fingerprint: string;
    platform: string;
    device_name: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordPayload {
    token: string;
    new_password: string;
}

export interface ResetPasswordResponse {
    message: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const authService = {
    /**
     * Set Access Token into Cookies
     * Domain root path for 30 days
     */
    setToken: (token: string, refreshToken?: string, user?: User) => {
        if (browser) {
            Cookies.set('accessToken', token, {
                expires: 30,
                secure: import.meta.env.PROD,
                sameSite: 'strict',
                path: '/'
            });
            if (refreshToken) {
                Cookies.set('refreshToken', refreshToken, {
                    expires: 30,
                    secure: import.meta.env.PROD,
                    sameSite: 'strict',
                    path: '/'
                });
            }
            if (user) {
                Cookies.set('user', JSON.stringify(user), {
                    expires: 30,
                    secure: import.meta.env.PROD,
                    sameSite: 'strict',
                    path: '/'
                });
            }
        }
    },

    clearToken: () => {
        if (browser) {
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            Cookies.remove('user', { path: '/' });
        }
    },

    login: async (credentials: Record<string, string>): Promise<LoginResponse> => {
        const res = await api.post<AxiosResponse<LoginResponse>>('/auth/login', { ...credentials });
        return res.data;
    },

    refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
        const res = await api.post<AxiosResponse<TokenResponse>>('/auth/token/refresh', {
            refresh_token: refreshToken
        });
        return res.data;
    },

    verifyMFA: async (credentials: MfaVerifyPayload): Promise<LoginResponse> => {
        const res = await api.post<AxiosResponse<LoginResponse>>('/auth/mfa/verify', { ...credentials });
        return res.data;
    },

    requestOTP: async (credentials: OtpRequestPayload): Promise<OtpRequestResponse> => {
        const res = await api.post<AxiosResponse<OtpRequestResponse>>('/auth/otp/request', { ...credentials });
        return res.data;
    },

    verifyOTP: async (credentials: OtpVerifyPayload): Promise<LoginResponse> => {
        const res = await api.post<AxiosResponse<LoginResponse>>('/auth/otp/verify', { ...credentials });
        return res.data;
    },

    requestForgotPassword: async (credentials: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
        const res = await api.post<AxiosResponse<ForgotPasswordResponse>>('/auth/password/forgot', { ...credentials });
        return res.data;
    },

    resetPassword: async (credentials: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
        const res = await api.post<AxiosResponse<ResetPasswordResponse>>('/auth/password/reset', { ...credentials });
        return res.data;
    },

    getUserProfile: async (token?: string): Promise<{ data: User; message: string }> => {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await api.get<AxiosResponse<{ data: User; message: string }>>('/auth/me', config);
        return res.data;
    },

    updateUserProfile: async (payload: { display_name: string; email: string; password?: string }, token?: string): Promise<{ data: User; message: string }> => {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await api.put<AxiosResponse<{ data: User; message: string }>>('/auth/me', payload, config);
        return res.data;
    },

    logout: async () => {
        authService.clearToken();
    }
};
