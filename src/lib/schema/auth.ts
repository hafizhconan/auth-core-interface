import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(6),
	device_fingerprint: z.string(),
	platform: z.string(),
	device_name: z.string(),
});
