import { defineOperationApi } from '@directus/extensions-sdk';
import axios from 'axios';
import { Buffer } from 'buffer'; // Import Buffer for Base64 encoding

// Helper function remains the same
function getValueByPath(obj, pathString, logger) {
    if (!pathString || typeof pathString !== 'string' || pathString.trim() === '') return obj;
	const keys = pathString.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
	let current = obj;
	for (const key of keys) {
		if (current === null || typeof current !== 'object') {
            logger?.warn(`Path traversal: Part "${key}" encountered a null/undefined parent.`);
            return undefined;
        }
		current = current[key];
	}
	return current;
}

export default defineOperationApi({
	id: 'external-api-request-simple',
	handler: async (options, { logger }) => {
		const {
			method, url, headers: headerArray = [], queryParams: queryParamArray = [],
            authMethod, bearerToken, basicAuthUsername, basicAuthPassword,
			bodyJson, responseBodyType, responseBodyPath, requestTimeout = 10000,
		} = options;

		if (!url || !method) throw new Error('Request URL and HTTP Method are required.');

		const requestConfig = {
			method: method.toLowerCase(),
			url,
			timeout: Number(requestTimeout) || 10000,
			headers: {},
			params: {},
			data: undefined,
			validateStatus: () => true, // Handle all status codes without throwing an error
		};

        // --- 1. Process Authentication ---
        switch (authMethod) {
            case 'bearer':
                if (bearerToken) requestConfig.headers['Authorization'] = `Bearer ${bearerToken}`;
                break;
            case 'basic':
                if (basicAuthUsername && basicAuthPassword) {
                    const encoded = Buffer.from(`${basicAuthUsername}:${basicAuthPassword}`).toString('base64');
                    requestConfig.headers['Authorization'] = `Basic ${encoded}`;
                }
                break;
            case 'custom':
                 if (Array.isArray(headerArray)) {
                    headerArray.forEach(h => { if (h && h.key) requestConfig.headers[h.key] = h.value; });
                }
                break;
        }

		// --- 2. Process Query & Body ---
		if (Array.isArray(queryParamArray)) {
			queryParamArray.forEach(p => { if (p && p.key) requestConfig.params[p.key] = p.value; });
		}
		if (['post', 'put', 'patch'].includes(requestConfig.method) && bodyJson) {
			requestConfig.data = bodyJson;
            if (!requestConfig.headers['Content-Type']) {
			    requestConfig.headers['Content-Type'] = 'application/json;charset=utf-8';
            }
		}

		logger.info(`Executing ${requestConfig.method.toUpperCase()} ${requestConfig.url}`);

		try {
			const response = await axios(requestConfig);
            const isErrorStatus = response.status < 200 || response.status >= 300;

            // --- 3. Process Response Body ---
            let bodyIsJson = false;
            const contentType = response.headers['content-type'] || '';

            if (responseBodyType === 'json' || (responseBodyType === 'auto' && contentType.includes('application/json'))) {
                bodyIsJson = typeof response.data === 'object' && response.data !== null;
            }

            let responseBodyToReturn = response.data;

            if (bodyIsJson && responseBodyPath) {
                logger.info(`Attempting to extract path "${responseBodyPath}" from JSON response.`);
                responseBodyToReturn = getValueByPath(response.data, responseBodyPath, logger);
            } else if (responseBodyPath && !bodyIsJson) {
                logger.warn(`Path extraction for "${responseBodyPath}" was skipped because the response body is not JSON.`);
            }

            if(isErrorStatus) {
                logger.warn(`Request completed with error status: ${response.status}`);
            } else {
                logger.info(`Request successful with status: ${response.status}`);
            }

			return {
				status: response.status,
				data: responseBodyToReturn,
				error: isErrorStatus ? `Request failed with status ${response.status}` : null,
			};

		} catch (error) {
			logger.error(`API Request failed critically: ${error.message}`, error);
			throw new Error(`API request failed: ${error.message}`);
		}
	},
});