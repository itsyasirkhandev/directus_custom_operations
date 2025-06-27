import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-get-env-variable',
	handler: ({ variable_name }, { env, logger }) => {
		if (!variable_name) {
			throw new Error('You must provide a variable name.');
		}

		// The 'env' object in the context contains all the environment variables.
		const value = env[variable_name];

		if (value === undefined) {
			// It's often better to warn and return null than to crash the flow
			// if a non-critical environment variable is missing.
			logger.warn(`Environment variable "${variable_name}" was not found.`);
			return null;
		}

		logger.info(`Successfully retrieved environment variable "${variable_name}".`);

		// Return the value directly so it can be used with {{$last}}
		return value;
	},
});