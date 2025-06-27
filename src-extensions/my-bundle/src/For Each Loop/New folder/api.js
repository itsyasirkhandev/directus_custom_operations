import { defineOperationApi } from '@directus/extensions-sdk';
import axios from 'axios';

export default defineOperationApi({
	id: 'operation-for-each-loop',
	handler: async (options, { logger, accountability }) => {
		const {
			item_list, target_webhook, method = 'POST', query_param_name,
            execution_mode, stop_on_error,
			batch_size = 10, batch_delay = 1000
		} = options;

		if (!target_webhook) throw new Error('Target Flow Webhook URL is required.');
		if (!Array.isArray(item_list)) throw new Error('Input must be an array.');

		const totalItems = item_list.length;
		if (totalItems === 0) {
			logger.info('Input array is empty, nothing to process.');
			return { total: 0, successful: 0, failed: 0, errors: [] };
		}

		const token = accountability.token;
		if (!token) logger.warn('No auth token found. Sub-flow triggers may fail if permissions are required.');

		const results = {
			total: totalItems,
			successful: 0,
			failed: 0,
			errors: [],
		};

		// A single function to trigger the webhook, handling both GET and POST
		const triggerWebhook = (item) => {
			const config = {
				headers: { 'Authorization': token ? `Bearer ${token}` : undefined },
				validateStatus: (status) => status >= 200 && status < 500,
			};

			if (method === 'GET') {
				const paramName = query_param_name || 'item'; // Default to 'item' if not provided
				let paramValue = item;

				// If the item is an object or array, stringify it to pass in a URL
				if (typeof item === 'object' && item !== null) {
					paramValue = JSON.stringify(item);
				}

				const params = new URLSearchParams();
				params.append(paramName, paramValue);
				
				return axios.get(target_webhook, { ...config, params });
			} else { // POST
				config.headers['Content-Type'] = 'application/json';
				return axios.post(target_webhook, item, config);
			}
		};

		const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

		switch (execution_mode) {
			case 'serial':
				logger.info(`Starting serial execution for ${totalItems} items.`);
				for (const [index, item] of item_list.entries()) {
					try {
						const response = await triggerWebhook(item);
						if (response.status >= 200 && response.status < 300) {
							results.successful++;
						} else {
							results.failed++;
							const errorDetail = { item_index: index, status: response.status, data: response.data };
							results.errors.push(errorDetail);
							logger.error(`Serial item ${index + 1} failed with status ${response.status}.`, errorDetail);
							if (stop_on_error) throw new Error(`Processing failed on item ${index + 1}.`);
						}
					} catch (error) {
						if (stop_on_error) throw error;
					}
				}
				break;

			case 'parallel':
				logger.warn(`Starting parallel execution for ${totalItems} items. This may cause high server load.`);
				const parallelPromises = item_list.map(triggerWebhook);
				const parallelResults = await Promise.allSettled(parallelPromises);
				parallelResults.forEach((result, index) => {
					if (result.status === 'fulfilled' && result.value.status < 300) {
						results.successful++;
					} else {
						results.failed++;
						const reason = result.status === 'rejected' ? result.reason.message : `Status ${result.value.status}`;
						results.errors.push({ item_index: index, reason });
						logger.error(`Parallel item ${index + 1} failed: ${reason}`);
					}
				});
				break;

			case 'batch':
				logger.info(`Starting batch execution for ${totalItems} items with size ${batch_size}.`);
				for (let i = 0; i < totalItems; i += batch_size) {
					const batch = item_list.slice(i, i + batch_size);
					logger.info(`Processing batch starting at index ${i}...`);
					const batchPromises = batch.map(triggerWebhook);
					const batchResults = await Promise.allSettled(batchPromises);

					batchResults.forEach((result, index) => {
						const overallIndex = i + index;
						if (result.status === 'fulfilled' && result.value.status < 300) {
							results.successful++;
						} else {
							results.failed++;
							const reason = result.status === 'rejected' ? result.reason.message : `Status ${result.value.status}`;
							results.errors.push({ item_index: overallIndex, reason });
							logger.error(`Batch item ${overallIndex + 1} failed: ${reason}`);
						}
					});

					if (stop_on_error && results.failed > 0) {
						throw new Error(`Batch processing failed and "Stop on Error" is enabled.`);
					}

					if (i + batch_size < totalItems) await sleep(batch_delay);
				}
				break;
		}

		logger.info('Loop execution completed.', results);
		if (results.failed > 0 && stop_on_error) {
			throw new Error(`${results.failed} item(s) failed to process.`);
		}
		
		return results;
	},
});