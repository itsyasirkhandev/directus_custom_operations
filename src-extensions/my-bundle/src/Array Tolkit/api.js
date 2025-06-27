import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-array-toolkit',
	handler: (options, { logger }) => {
		const {
			operation, input_array, element_to_add, delimiter,
			index_to_remove, start_number, end_number
		} = options;

		if (operation !== 'range' && !Array.isArray(input_array)) {
			throw new Error('Input must be a valid array for this operation.');
		}
		
		// Use a deep copy to avoid modifying the original array in the data chain
		const working_array = operation !== 'range' ? JSON.parse(JSON.stringify(input_array)) : [];

		switch (operation) {
			case 'append':
				working_array.push(element_to_add);
				return working_array;

			case 'prepend':
				working_array.unshift(element_to_add);
				return working_array;

			case 'join':
				return working_array.join(delimiter || ',');

			case 'get_first':
				return working_array.length > 0 ? working_array[0] : null;

			case 'get_last':
				return working_array.length > 0 ? working_array[working_array.length - 1] : null;
			
			case 'pop':
				if (working_array.length === 0) return { modified_array: [], removed_element: null };
				const removedElement = working_array.pop();
				return { modified_array: working_array, removed_element: removedElement };

			case 'remove_at_index':
				const index = parseInt(index_to_remove, 10);
				if (isNaN(index) || index < 0 || index >= working_array.length) {
					logger.warn(`Invalid index "${index_to_remove}". Returning original array.`);
					return working_array;
				}
				working_array.splice(index, 1);
				return working_array;

			case 'range':
				const start = parseInt(start_number, 10);
				const end = parseInt(end_number, 10);
				if (isNaN(start) || isNaN(end) || start > end) {
					throw new Error('Start and End must be valid numbers, and Start must not be greater than End.');
				}
				const rangeArray = [];
				for (let i = start; i <= end; i++) {
					rangeArray.push(i);
				}
				return rangeArray;
				
			default:
				logger.warn(`Unknown array operation: "${operation}".`);
				throw new Error(`Unknown array operation: "${operation}".`);
		}
	},
});
