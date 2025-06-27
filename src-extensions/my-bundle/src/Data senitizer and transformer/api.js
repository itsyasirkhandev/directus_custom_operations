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

        // Deep copy to avoid modifying the original data in the flow context
        const data = JSON.parse(JSON.stringify(input_object));

        // --- Helper functions for getting/setting nested values ---
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
        
        // --- Apply each rule ---
        for (const rule of rules) {
            if (!rule.key || !Array.isArray(rule.transformations)) continue;

            let currentValue = getValueByPath(data, rule.key);

            // --- Apply transformations in order ---
            for (const transform of rule.transformations) {
                // Handle default value logic first
                if (transform === 'default_if_empty') {
                    const isEmpty = currentValue === null || currentValue === undefined || String(currentValue).trim() === '';
                    if (isEmpty) {
                        currentValue = rule.default_value;
                    }
                    continue; // Move to next transform
                }
                
                // Skip other transformations if value is not a string (where applicable)
                if (typeof currentValue !== 'string' && ['trim', 'to_lowercase', 'to_uppercase', 'capitalize', 'strip_html'].includes(transform)) {
                    continue; 
                }

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
                        currentValue = isNaN(num) ? currentValue : num; // Keep original if not a valid number
                        break;
                    
                    case 'strip_html':
                        currentValue = currentValue.replace(/<[^>]*>?/gm, '');
                        break;
                }
            }

            // Set the final transformed value back into the object
            setValueByPath(data, rule.key, currentValue);
        }

        return data;
    },
});