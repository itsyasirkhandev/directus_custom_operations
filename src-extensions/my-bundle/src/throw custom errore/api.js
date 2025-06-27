import { createError } from '@directus/errors';

export default {
	id: 'throw-custom-error',
	handler: (options) => {
		const message = options.message || 'An error occurred during flow execution.';
		// Ensure status is a valid number, as dropdowns can pass strings.
		const status = parseInt(String(options.status), 10) || 400;
		// Ensure code is an uppercase string for consistency.
		const code = (options.code || 'CUSTOM_FLOW_ERROR').toUpperCase().replace(/\s/g, '_');

		// Create a custom error constructor using the official Directus helper.
		const CustomError = createError(code, message, status);

		// Throw a new instance of the error.
		// This will immediately halt the flow and return the specified HTTP response.
		throw new CustomError();
	},
};