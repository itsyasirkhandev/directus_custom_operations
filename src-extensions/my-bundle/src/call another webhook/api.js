// /extensions/operations/simplified-flow-trigger/api.js

import { defineOperationApi } from '@directus/extensions-sdk';
import axios from 'axios';

export default defineOperationApi({
    id: 'simplified-flow-trigger',
    handler: async (options, { logger, accountability }) => {
        const {
            method = 'POST',
            url,
            wait_for_response = true,
            body_properties,
            query_parameters,
        } = options;

        if (!url) throw new Error('Webhook URL is required.');

        // --- Helper function to build payload from the new UI ---
        const buildPayload = (properties) => {
            if (!Array.isArray(properties)) return {};
            return properties.reduce((acc, prop) => {
                if (!prop || !prop.key) return acc;
                let value;
                switch (prop.value_type) {
                    case 'number':  value = prop.number_value; break;
                    case 'boolean': value = prop.boolean_value; break;
                    case 'json':    value = prop.json_value; break;
                    default:        value = prop.string_value;
                }
                acc[prop.key] = value;
                return acc;
            }, {});
        };

        const config = {
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accountability.token ? `Bearer ${accountability.token}` : undefined,
            },
        };

        // --- Construct payload or query params based on method ---
        if (method === 'POST') {
            config.data = buildPayload(body_properties);
        } else if (method === 'GET' && Array.isArray(query_parameters)) {
            config.params = query_parameters.reduce((acc, param) => {
                if (param.key) acc[param.key] = param.value;
                return acc;
            }, {});
        }

        // --- Asynchronous Execution ("Fire and Forget") ---
        if (wait_for_response === false) {
            logger.info(`Executing ASYNC ${config.method} request to: ${config.url}`);
            axios(config).catch(error => {
                logger.error(`Async sub-flow trigger failed in the background: ${error.message}`);
            });
            return { status: 'triggered', mode: 'asynchronous' };
        }

        // --- Synchronous Execution (Wait for Response) ---
        logger.info(`Executing SYNC ${config.method} request to: ${config.url}`);
        try {
            const response = await axios(config);
            return {
                mode: 'synchronous',
                status: response.status,
                headers: response.headers,
                data: response.data,
            };
        } catch (error) {
            logger.error(`Sync sub-flow trigger failed: ${error.message}`);
            if (error.response) {
                throw new Error(
                    `The triggered flow failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`
                );
            }
            throw error;
        }
    },
});