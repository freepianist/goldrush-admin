import bcrypt from 'bcryptjs';

const ROUNDS = 12;

export function hashPassword(password: string) {
	return bcrypt.hash(password, ROUNDS);
}

export function validatePassword(password: string) {
	if (password.length < 8) {
		return 'Password must be at least 8 characters';
	}

	return null;
}

export function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}
