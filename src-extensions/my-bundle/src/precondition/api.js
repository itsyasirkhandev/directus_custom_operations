import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-simple-condition',
	handler: ({ value1, operator, value2 }, { logger }) => {
		
		// Helper function to check for nested properties
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

		// The main evaluation function
		const evaluate = (val1, op, val2) => {
			try {
				// Operators that only need val1
				if (op === '_null') return val1 === null || val1 === undefined;
				if (op === '_nnull') return val1 !== null && val1 !== undefined;
				if (op === '_empty') return String(val1).trim() === '';
				if (op === '_nempty') return String(val1).trim() !== '';

				// Existence operators
				if (op === '_exists') {
					if (typeof val1 !== 'object' || val1 === null) return false;
					return getValueByPath(val1, val2).exists;
				}
				if (op === '_does_not_exist') {
					if (typeof val1 !== 'object' || val1 === null) return true; // A non-object can't have the key
					return !getValueByPath(val1, val2).exists;
				}

				// Coerce types for comparison
				const str1 = String(val1);
				const str2 = String(val2);
				const num1 = !isNaN(parseFloat(str1)) && isFinite(str1) ? parseFloat(str1) : str1;
				const num2 = !isNaN(parseFloat(str2)) && isFinite(str2) ? parseFloat(str2) : str2;
				
				switch (op) {
					case '_eq': return num1 == num2;
					case '_neq': return num1 != num2;
					case '_gt': return num1 > num2;
					case '_gte': return num1 >= num2;
					case '_lt': return num1 < num2;
					case '_lte': return num1 <= num2;
					case '_icontains': return str1.toLowerCase().includes(str2.toLowerCase());
					default: return false;
				}
			} catch (err) {
				logger.warn(`Condition evaluation failed: ${err.message}`);
				return false;
			}
		};

		const conditionMet = evaluate(value1, operator, value2);

		if (conditionMet) {
			logger.info(`Condition passed: The check was true.`);
			return; // Success, continue flow
		} else {
			logger.info(`Condition failed: The check was false. Halting flow.`);
			throw new Error('Flow halted: Condition was not met.');
		}
	},
});
