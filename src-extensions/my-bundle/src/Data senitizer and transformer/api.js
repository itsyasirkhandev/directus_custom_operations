// /extensions/operations/data-sanitizer-transformer/api.js

import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
    id: 'data-sanitizer-transformer',
    handler: ({ input_object, rules }, { logger }) => {
        if (typeof input_object !== 'object' || input_object === null) {
            throw new Error('Input must be a valid JSON object.');
        }
        if (!Array.isArray(rules) || rules.length === 0) {
            logger.info('No transformation rules defined. Returning original object.');
            return input_object;
        }

        const data = JSON.parse(JSON.stringify(input_object));

        const getValueByPath = (obj, path) => {
            const keys = path.split('.');
            let current = obj;
            for (const key of keys) {
                if (current === null || typeof current !== 'object') return undefined;
                current = current[key];
            }
            return current;
        };

        const setValueByPath = (obj, path, value) => {
            const keys = path.split('.');
            let current = obj;
            while (keys.length > 1) {
                const key = keys.shift();
                if (current[key] === undefined || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }
            current[keys[0]] = value;
        };
        
        for (const rule of rules) {
            // FIX: Check for a string 'transformation' now
            if (!rule.key || !rule.transformation) continue;

            let currentValue = getValueByPath(data, rule.key);
            const transform = rule.transformation;

            // FIX: Removed the inner loop, apply the single transform directly
            if (transform === 'default_if_empty') {
                const isEmpty = currentValue === null || currentValue === undefined || String(currentValue).trim() === '';
                if (isEmpty) {
                    currentValue = rule.default_value;
                }
            } else if (typeof currentValue === 'string' || ['to_number'].includes(transform)) {
                switch (transform) {
                    case 'trim':
                        currentValue = currentValue.trim();
                        break;
                    case 'to_lowercase':
                        currentValue = currentValue.toLowerCase();
                        break;
                    case 'to_uppercase':
                        currentValue = currentValue.toUpperCase();
                        break;
                    case 'capitalize':
                        currentValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1).toLowerCase();
                        break;
                    case 'to_number':
                        const num = parseFloat(currentValue);
                        currentValue = isNaN(num) ? currentValue : num;
                        break;
                    case 'strip_html':
                        currentValue = currentValue.replace(/<[^>]*>?/gm, '');
                        break;
                }
            }

            setValueByPath(data, rule.key, currentValue);
        }

        return data;
    },
});