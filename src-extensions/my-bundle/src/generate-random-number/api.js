export default {
	id: 'generate-random-number',
	handler: async (options, { logger }) => {
		let {
			min_value = 0,
			max_value = 100,
			integer_only = true,
		} = options;

		let min = parseFloat(min_value);
		let max = parseFloat(max_value);

		if (isNaN(min)) {
			logger.warn(`Invalid Minimum Value "${min_value}". Defaulting to 0.`);
			min = 0;
		}
		if (isNaN(max)) {
			logger.warn(`Invalid Maximum Value "${max_value}". Defaulting to 100.`);
			max = 100;
		}

		if (min > max) {
			logger.warn(`Minimum value (${min}) was greater than Maximum value (${max}). Swapping them.`);
			[min, max] = [max, min];
		}

		let randomNumber;
		if (integer_only) {
			// Generates an integer inclusive of both min and max
			randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
		} else {
			// Generates a floating-point number between min and max
			randomNumber = Math.random() * (max - min) + min;
		}

		logger.info(`Generated ${integer_only ? 'integer' : 'float'}: ${randomNumber} (Range: ${min}-${max})`);

		// Return the number directly. It can now be accessed with {{$last}}
		return randomNumber;
	},
};