import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { browser } from "$app/environment";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

// ---------------------------------------------------------------------------
// Device Info — baca dari localStorage, aman untuk SSR
// ---------------------------------------------------------------------------
export interface DeviceInfo {
	device_fingerprint: string;
	platform: string;
	device_name: string;
}

export function getDeviceInfo(): DeviceInfo {
	if (!browser) return { device_fingerprint: '', platform: 'web', device_name: '' };
	return {
		device_fingerprint: localStorage.getItem('device_fingerprint') ?? '',
		platform: localStorage.getItem('platform') ?? 'web',
		device_name: localStorage.getItem('device_name') ?? ''
	};
}

// ---------------------------------------------------------------------------
// API Error Parser — ekstrak status & message dari Axios error
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseApiError(err: any): { status: number; message: string } {
	return {
		status: err?.response?.status ?? 0,
		message: err?.response?.data?.message ?? ''
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNotFoundError(err: any): boolean {
	const { status, message } = parseApiError(err);
	return status === 404 || message.toLowerCase().includes('not found') || message.toLowerCase().includes('not registered');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isExpiredError(err: any): boolean {
	const { status, message } = parseApiError(err);
	return status === 410 || message.toLowerCase().includes('expired');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isInvalidError(err: any): boolean {
	const { status, message } = parseApiError(err);
	return status === 400 || message.toLowerCase().includes('invalid') || message.toLowerCase().includes('wrong');
}
