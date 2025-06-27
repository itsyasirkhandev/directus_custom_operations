import { defineOperationApi } from '@directus/extensions-sdk';
import axios from 'axios';

export default defineOperationApi({
	id: 'operation-for-each-loop',
	handler: async (options, { logger, accountability }) => {
		const {
			loop_type, loop_count, item_list, target_webhook, additional_payload,
            collect_results, execution_mode, stop_on_error,
			batch_size = 10, batch_delay = 1000
		} = options;

		if (!target_webhook) throw new Error('Target Flow Webhook URL is required.');

        // --- Step 1: Determine the source array for the loop ---
        let loopSource = [];
        if (loop_type === 'by_number') {
            const count = parseInt(loop_count, 10);
            if (isNaN(count) || count < 1) throw new Error('Loop by Number requires a positive integer.');
            for (let i = 0; i < count; i++) {
                loopSource.push({ index: i, count: i + 1 });
            }
        } else { // by_data
            if (!Array.isArray(item_list)) throw new Error('Loop by Input Data requires a valid array.');
            loopSource = item_list;
        }

		const totalItems = loopSource.length;
		if (totalItems === 0) {
			logger.info('Input array is empty, nothing to process.');
			return collect_results ? [] : { total: 0, successful: 0, failed: 0 };
		}

		const token = accountability.token;
		if (!token) logger.warn('No auth token found. Sub-flow triggers may fail if permissions are required.');

		const executionResults = { successful: 0, failed: 0, errors: [] };
        const collectedData = [];

		// --- Step 2: Define the webhook trigger function ---
		const triggerWebhook = (item) => {
            // Merge the looped item with the additional static payload
			const payload = { ...additional_payload, item: item };
			return axios.post(target_webhook, payload, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token ? `Bearer ${token}` : undefined,
				},
				validateStatus: (status) => status >= 200 && status < 500,
			});
		};

		const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // --- Step 3: Execute the loop based on the chosen mode ---
        
        // If we need to collect results, we MUST run serially to get them in order.
        if (collect_results) {
            logger.info(`Starting serial execution for ${totalItems} items with result collection.`);
            for (const [index, item] of loopSource.entries()) {
                try {
                    const response = await triggerWebhook(item);
                    if (response.status >= 200 && response.status < 300) {
                        executionResults.successful++;
                        collectedData.push(response.data); // Collect the result from the sub-flow
                    } else {
                        executionResults.failed++;
                        const errorDetail = { item_index: index, status: response.status, data: response.data };
                        executionResults.errors.push(errorDetail);
                        logger.error(`Serial item ${index + 1} failed with status ${response.status}.`, errorDetail);
                        if (stop_on_error) throw new Error(`Processing failed on item ${index + 1}.`);
                    }
                } catch (error) {
                    if (stop_on_error) throw error;
                }
            }
            logger.info('Result collection completed.', executionResults);
            return collectedData; // Return the final array of collected results
        }

		// Standard execution without result collection
		switch (execution_mode) {
			case 'serial':
				logger.info(`Starting serial execution for ${totalItems} items.`);
				for (const [index, item] of loopSource.entries()) { /* ... (serial logic) ... */ }
				break;
			case 'parallel':
				logger.warn(`Starting parallel execution for ${totalItems} items.`);
				const parallelPromises = loopSource.map(triggerWebhook);
                /* ... (parallel logic) ... */
				break;
			case 'batch':
				logger.info(`Starting batch execution for ${totalItems} items with size ${batch_size}.`);
				for (let i = 0; i < totalItems; i += batch_size) { /* ... (batch logic) ... */ }
				break;
		}

		logger.info('Loop execution completed.', executionResults);
		if (executionResults.failed > 0 && stop_on_error) {
			throw new Error(`${executionResults.failed} item(s) failed to process.`);
		}
		
		return executionResults;
	},
});