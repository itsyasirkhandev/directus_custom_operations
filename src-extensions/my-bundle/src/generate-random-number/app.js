export default {
	id: 'generate-random-number',
	name: 'Generate Random Number',
	icon: 'casino',
	description: 'Generates a random number within a specified range and returns it directly.',
	overview: ({ min_value, max_value, integer_only }) => {
		const effectiveMinValue = min_value === undefined ? 0 : min_value;
		const effectiveMaxValue = max_value === undefined ? 100 : max_value;
		
		return [
			{
				label: 'Range',
				text: `${effectiveMinValue} – ${effectiveMaxValue}`,
			},
			{
				label: 'Type',
				text: integer_only ? 'Integer' : 'Float (Decimal)',
			},
            {
                label: 'Output',
                text: 'Returns number directly',
            }
		];
	},
	options: [
		{
			field: 'min_value',
			name: 'Minimum Value',
			type: 'number',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: 'e.g., 0',
				},
			},
			schema: { default_value: 0 },
		},
		{
			field: 'max_value',
			name: 'Maximum Value',
			type: 'number',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: 'e.g., 100',
				},
			},
			schema: { default_value: 100 },
		},
		{
			field: 'integer_only',
			name: 'Integer Only',
			type: 'boolean',
			meta: {
				interface: 'boolean',
				width: 'full',
				note: 'If enabled, generates a whole number. Otherwise, a decimal number.',
			},
			schema: { default_value: true },
		},
	],
};