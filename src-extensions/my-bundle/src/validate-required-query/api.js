import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'validate-data-types',
	handler: ({ input_object, required_rules, custom_error_prefix }, { logger }) => {

		// --- Helper function to get a value from a nested path ---
		const getValueByPath = (obj, path) => {
			if (typeof path !== 'string') return { exists: false };
			const keys = path.split('.');
			let current = obj;
			for (let i = 0; i < keys.length; i++) {
				if (current === null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, keys[i])) {
					return { exists: false };
				}
				current = current[keys[i]];
			}
			return { exists: true, value: current };
		};

		// --- Helper function to check the type of a value ---
		const checkType = (value, type) => {
			switch (type) {
				case 'string': return typeof value === 'string';
				case 'number': return typeof value === 'number' && !isNaN(value);
				case 'boolean': return typeof value === 'boolean';
				case 'array': return Array.isArray(value);
				case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value);
				case 'timestamp': return !isNaN(new Date(value).getTime());
				case 'null': return value === null;
				case 'email': // NEW
					if (typeof value !== 'string') return false;
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					return emailRegex.test(value.trim());
				default: return false;
			}
		};

		if (typeof input_object !== 'object' || input_object === null) {
			throw new Error('Input must be a valid JSON object.');
		}
		if (!required_rules || required_rules.length === 0) {
			logger.info('No validation rules configured. Passing.');
			return;
		}

		const validationErrors = [];

		for (const rule of required_rules) {
			if (!rule.key) {
				logger.warn('Skipping a rule with no property key.');
				continue;
			}

			const { exists, value } = getValueByPath(input_object, rule.key);

			if (!exists) {
				validationErrors.push(`Required property "${rule.key}" is missing.`);
				continue;
			}
			
			const isEmpty = (value === null || String(value).trim() === '');

			if (isEmpty) {
				if (rule.allow_empty) {
					continue;
				} else {
					if (rule.type === 'null' && value === null) {
						continue;
					}
					validationErrors.push(`Property "${rule.key}" must not be empty.`);
					continue;
				}
			}

			if (!checkType(value, rule.type)) {
				const actualType = Array.isArray(value) ? 'array' : typeof value;
				// Provide a more specific error message for emails
				if (rule.type === 'email') {
					validationErrors.push(`Property "${rule.key}" must be a valid email address.`);
				} else {
					validationErrors.push(`Property "${rule.key}" was expected to be type "${rule.type}", but received type "${actualType}".`);
				}
			}
		}

		if (validationErrors.length > 0) {
			const prefix = custom_error_prefix || 'Validation failed:';
			const detailedErrors = validationErrors.join('; ');
			const errorMessage = `${prefix} ${detailedErrors}`;

			logger.warn(`Validation failed with ${validationErrors.length} error(s): ${detailedErrors}`);
			throw new Error(errorMessage);
		}

		logger.info('All data validation rules passed successfully.');
		return; // Success
	},
});