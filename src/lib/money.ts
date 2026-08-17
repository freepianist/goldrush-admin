export function money(value: { toString(): string } | number | string | null | undefined) {
	if (value === null || value === undefined || value === '') {
		return 0;
	}

	return Number(Number(value.toString()).toFixed(4));
}

export function formatMoney(value: number, currency = 'USD') {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value || 0);
}

export function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}
