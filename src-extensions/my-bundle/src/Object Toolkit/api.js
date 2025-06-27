import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-object-toolkit',
	handler: ({ operation, input_object }, { logger }) => {
		
		if (typeof input_object !== 'object' || input_object === null || Array.isArray(input_object)) {
			throw new Error('Input must be a valid JSON object.');
		}

		switch (operation) {
			case 'get_keys':
				logger.info('Getting object keys.');
				return Object.keys(input_object);

			case 'get_values':
				logger.info('Getting object values.');
				return Object.values(input_object);

			case 'get_entries':
				logger.info('Getting object entries.');
				return Object.entries(input_object).map(([key, value]) => ({
					key: key,
					value: value,
				}));

			default:
				logger.warn(`Unknown object operation: "${operation}". Returning an empty array.`);
				return [];
		}
	},
});