import { randomUUID } from 'crypto';

export default {
	id: 'generate-uuid',

	/**
	 * The handler function is the core of the operation's logic.
	 * It takes no options and uses the built-in crypto module.
	 *
	 * @returns {string} The generated v4 UUID.
	 */
	handler: () => {
		// Generate a standard v4 UUID using the Node.js crypto module.
		const newUUID = randomUUID();

		// Return the UUID directly as a string.
		// It will be available in the data chain for subsequent operations
		// as `{{$last}}`.
		return newUUID;
	},
};
