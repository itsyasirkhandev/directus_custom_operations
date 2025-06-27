export default {
	id: 'operation-store-value',
	handler: ({ value_type, value_input }) => {
		// If the input is null or undefined, return it as is.
		if (value_input === null || value_input === undefined) {
			return value_input;
		}

		// Based on the selected type, process the input string.
		switch (value_type) {
			case 'number':
				const num = parseFloat(value_input);
				// Check if the result is a valid number
				if (isNaN(num)) {
					throw new Error(`Input "${value_input}" could not be converted to a Number.`);
				}
				return num;

			case 'boolean':
				const boolStr = String(value_input).toLowerCase().trim();
				if (boolStr === 'true') return true;
				if (boolStr === 'false') return false;
				throw new Error(`Input "${value_input}" could not be converted to a Boolean. Please use "true" or "false".`);

			case 'json':
				try {
					return JSON.parse(value_input);
				} catch (error) {
					throw new Error(`Invalid JSON provided: ${error.message}`);
				}

			case 'string':
			default:
				// For string, return the input directly.
				return String(value_input);
		}
	},
};