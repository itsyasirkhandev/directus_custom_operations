import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-math-toolkit',
	handler: (options, { logger }) => {
		const {
            math_operation, number_a, simple_operator, number_b,
            rounding_input, rounding_method, decimal_places,
            input_array
        } = options;

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
                    case 'floor':
                        return Math.floor(numToRound);
                    case 'ceil':
                        return Math.ceil(numToRound);
                    case 'round':
                        const places = parseInt(decimal_places, 10);
                        if (isNaN(places) || places <= 0) {
                            return Math.round(numToRound);
                        }
                        const multiplier = Math.pow(10, places);
                        return Math.round(numToRound * multiplier) / multiplier;
                    default:
                        throw new Error(`Unknown rounding method: ${rounding_method}`);
                }

			case 'sum_array':
			case 'average_array':
				if (!Array.isArray(input_array)) throw new Error('Input for array operations must be a valid array.');
				const numericArray = input_array.map(Number).filter(n => !isNaN(n));
				if (numericArray.length === 0) {
					logger.warn('Input array contains no valid numbers.');
					return 0;
				}
				const sum = numericArray.reduce((acc, val) => acc + val, 0);
				if (math_operation === 'sum_array') return sum;
				if (math_operation === 'average_array') return sum / numericArray.length;
				break;

			default:
				throw new Error(`Unknown math operation: ${math_operation}`);
		}
	},
});