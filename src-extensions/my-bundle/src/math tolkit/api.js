import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-math-toolkit',
	handler: (options, { logger }) => {
		const {
            math_operation, number_a, simple_operator, number_b,
            rounding_input, rounding_method, decimal_places,
            input_array, one_by_one_values, min_max_operator
        } = options;

		// Helper to get a clean numeric array from different sources
		const getNumericArray = (source) => {
			if (!Array.isArray(source)) return [];
			if (source.length > 0 && typeof source[0] === 'object' && source[0] !== null && 'value' in source[0]) {
				return source.map(item => Number(item.value)).filter(n => !isNaN(n));
			}
			return source.map(Number).filter(n => !isNaN(n));
		};

		switch (math_operation) {
			case 'simple_calculation':
				const a = parseFloat(number_a);
				const b = parseFloat(number_b);
				if (isNaN(a) || isNaN(b)) throw new Error('Both Number A and Number B must be valid numbers.');
				switch (simple_operator) {
					case 'add': return a + b;
					case 'subtract': return a - b;
					case 'multiply': return a * b;
					case 'divide':
						if (b === 0) throw new Error('Cannot divide by zero.');
						return a / b;
					default: throw new Error(`Unknown operator: ${simple_operator}`);
				}

            case 'rounding':
                const numToRound = parseFloat(rounding_input);
                if (isNaN(numToRound)) throw new Error('The input for rounding must be a valid number.');
                switch (rounding_method) {
                    case 'floor': return Math.floor(numToRound);
                    case 'ceil': return Math.ceil(numToRound);
                    case 'round':
                        const places = parseInt(decimal_places, 10);
                        if (isNaN(places) || places <= 0) return Math.round(numToRound);
                        const multiplier = Math.pow(10, places);
                        return Math.round(numToRound * multiplier) / multiplier;
                    default: throw new Error(`Unknown rounding method: ${rounding_method}`);
                }

			case 'sum_array':
			case 'average_array':
			case 'min_max_array':
			case 'min_max_inputs':
				let sourceArray;
				if (math_operation === 'min_max_inputs') {
					sourceArray = one_by_one_values;
				} else {
					sourceArray = input_array;
				}

				if (!Array.isArray(sourceArray)) throw new Error('Input must be a valid array.');
				
				const numericArray = getNumericArray(sourceArray);
				
				if (numericArray.length === 0) {
					logger.warn('Input array contains no valid numbers.');
					return null;
				}
				
				if (math_operation === 'sum_array') {
					return numericArray.reduce((acc, val) => acc + val, 0);
				}
				if (math_operation === 'average_array') {
					const sum = numericArray.reduce((acc, val) => acc + val, 0);
					return sum / numericArray.length;
				}
				if (math_operation === 'min_max_array' || math_operation === 'min_max_inputs') {
					if (min_max_operator === 'min') return Math.min(...numericArray);
					if (min_max_operator === 'max') return Math.max(...numericArray);
				}
				break;

			default:
				throw new Error(`Unknown math operation: ${math_operation}`);
		}
	},
});
