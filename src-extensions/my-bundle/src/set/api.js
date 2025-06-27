import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-set-value',
	handler: ({ input_data, path, value_type, string_value, number_value, boolean_value, json_value }, { logger }) => {
		if (typeof input_data !== 'object' || input_data === null) {
			throw new Error('Input Data must be a valid Object or Array.');
		}
		if (!path) {
			throw new Error('Path is a required field.');
		}

		// First, determine the actual value to set based on the selected type
		let valueToSet;
		switch (value_type) {
			case 'string': valueToSet = string_value; break;
			case 'number': valueToSet = (number_value === null || number_value === undefined) ? null : Number(number_value); break;
			case 'boolean': valueToSet = boolean_value; break;
			case 'json': valueToSet = json_value; break;
			case 'null': valueToSet = null; break;
			default:
				logger.warn(`Unknown value type "${value_type}". Defaulting to null.`);
				valueToSet = null;
		}

		// Create a deep copy to avoid modifying the original data chain object directly
		const dataCopy = JSON.parse(JSON.stringify(input_data));

		// This helper function will navigate the path and set the value
		const setValueByPath = (obj, pathString, value) => {
			const keys = pathString.replace(/\[(\d+)\]/g, '.$1').split('.');
			let current = obj;

			for (let i = 0; i < keys.length - 1; i++) {
				const key = keys[i];
				const nextKey = keys[i + 1];
				const isNextKeyIndex = /^\d+$/.test(nextKey);

				if (current[key] === undefined || typeof current[key] !== 'object') {
					// If the next level doesn't exist, create it.
					// Create an array if the next key is a number, otherwise an object.
					current[key] = isNextKeyIndex ? [] : {};
				}
				current = current[key];
			}

			current[keys[keys.length - 1]] = value;
		};

		setValueByPath(dataCopy, path, valueToSet);

		// Return the entire modified object
		return dataCopy;
	},
});