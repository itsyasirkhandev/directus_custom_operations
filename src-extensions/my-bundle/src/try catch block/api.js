// /extensions/operations/try-catch/api.js

import { defineOperationApi } from '@directus/extensions-sdk';
import axios from 'axios';

export default defineOperationApi({
	id: 'operation-try-catch',
	handler: async (options, { logger, accountability }) => {
		const { try_flow_url, try_payload, catch_flow_url } = options;

		if (!try_flow_url) {
			throw new Error('The "Try" flow webhook URL is required.');
		}
		if (!catch_flow_url) {
			throw new Error('The "Catch" flow webhook URL is required.');
		}

		const token = accountability.token;
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': token ? `Bearer ${token}` : undefined,
		};

		// --- TRY BLOCK ---
		logger.info(`Attempting to execute TRY flow: ${try_flow_url}`);
		try {
			const tryResponse = await axios.post(try_flow_url, try_payload || {}, {
				headers,
				validateStatus: (status) => status >= 200 && status < 300, // Succeeds only on 2xx status
			});
			
			// If the "try" block is successful, return its result directly
			logger.info('TRY flow executed successfully.');
			return tryResponse.data;

		} catch (error) {
			// --- CATCH BLOCK ---
			logger.warn(`TRY flow failed. Executing CATCH flow: ${catch_flow_url}`);
			
			let errorDetails = {};
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				errorDetails = {
					message: `The primary flow failed with status ${error.response.status}.`,
					status: error.response.status,
					response_data: error.response.data,
					original_payload: try_payload,
				};
			} else if (error.request) {
				// The request was made but no response was received
				errorDetails = {
					message: 'The primary flow did not respond.',
					original_payload: try_payload,
				};
			} else {
				// Something happened in setting up the request that triggered an Error
				errorDetails = {
					message: `An unexpected error occurred: ${error.message}`,
					original_payload: try_payload,
				};
			}

			// Execute the fallback flow, passing the error details as its payload
			try {
				const catchResponse = await axios.post(catch_flow_url, errorDetails, { headers });
				logger.info('CATCH flow executed successfully.');
				// Return the result of the fallback flow
				return catchResponse.data;

			} catch (catchError) {
				const finalErrorMessage = `CRITICAL: The TRY flow failed, and the CATCH flow also failed to execute. ${catchError.message}`;
				logger.error(finalErrorMessage);
				// If the CATCH block itself fails, throw a final, critical error.
				throw new Error(finalErrorMessage);
			}
		}
	},
});