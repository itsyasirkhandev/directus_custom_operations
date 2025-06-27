export default {
	id: 'operation-math-toolkit',
	name: 'Math Toolkit',
	icon: 'calculate',
	description: 'Performs various mathematical calculations.',

	overview: ({ math_operation }) => [
		{
			label: 'Operation',
			text: math_operation ? math_operation.replace(/_/g, ' ') : 'Not Set',
		},
	],

	options: [
		{
			field: 'math_operation',
			name: 'Math Operation',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Simple Calculation (A + B)', value: 'simple_calculation' },
						{ text: 'Rounding', value: 'rounding' },
						{ text: 'Sum of Array', value: 'sum_array' },
						{ text: 'Average of Array', value: 'average_array' },
					],
				},
			},
			schema: { default_value: 'simple_calculation' },
		},
		// --- Fields for Simple Calculation ---
		{
			field: 'number_a',
			name: 'Number A',
			type: 'float',
			meta: {
				width: 'quarter',
				interface: 'input',
				conditions: [
                    { rule: { math_operation: { _eq: 'simple_calculation' } }, hidden: false },
                    { rule: { math_operation: { _neq: 'simple_calculation' } }, hidden: true }
                ]
			},
		},
		{
			field: 'simple_operator',
			name: 'Operator',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Add (+)', value: 'add' },
						{ text: 'Subtract (-)', value: 'subtract' },
						{ text: 'Multiply (*)', value: 'multiply' },
						{ text: 'Divide (/)', value: 'divide' },
					],
				},
				conditions: [
                    { rule: { math_operation: { _eq: 'simple_calculation' } }, hidden: false },
                    { rule: { math_operation: { _neq: 'simple_calculation' } }, hidden: true }
                ]
			},
			schema: { default_value: 'add' },
		},
		{
			field: 'number_b',
			name: 'Number B',
			type: 'float',
			meta: {
				width: 'quarter',
				interface: 'input',
				conditions: [
                    { rule: { math_operation: { _eq: 'simple_calculation' } }, hidden: false },
                    { rule: { math_operation: { _neq: 'simple_calculation' } }, hidden: true }
                ]
			},
		},
        // --- Fields for Rounding ---
        {
			field: 'rounding_input',
			name: 'Number to Round',
			type: 'float',
			meta: {
				width: 'full',
				interface: 'input',
				conditions: [
                    { rule: { math_operation: { _eq: 'rounding' } }, hidden: false },
                    { rule: { math_operation: { _neq: 'rounding' } }, hidden: true }
                ]
			},
		},
        {
			field: 'rounding_method',
			name: 'Rounding Method',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Round (Standard)', value: 'round'},
                        { text: 'Floor (Round Down)', value: 'floor'},
                        { text: 'Ceil (Round Up)', value: 'ceil'},
                    ]
                },
				conditions: [
                    { rule: { math_operation: { _eq: 'rounding' } }, hidden: false },
                    { rule: { math_operation: { _neq: 'rounding' } }, hidden: true }
                ]
			},
            schema: { default_value: 'round' },
		},
        {
			field: 'decimal_places',
			name: 'Decimal Places',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
                options: { placeholder: 'e.g., 2' },
                note: 'For standard rounding only. Leave empty for whole number.',
				conditions: [
                    { rule: { math_operation: { _eq: 'rounding' }, rounding_method: { _eq: 'round'} }, hidden: false },
                    { rule: { math_operation: { _neq: 'rounding' } }, hidden: true },
                    { rule: { rounding_method: { _neq: 'round' } }, hidden: true },
                ]
			},
		},
		// --- Field for Array Operations ---
		{
			field: 'input_array',
			name: 'Input Array',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: { language: 'json', placeholder: '[1, 2, 3, 4, 5]' },
				conditions: [
                    { rule: { math_operation: { _in: ['sum_array', 'average_array'] } }, hidden: false },
                    { rule: { math_operation: { _nin: ['sum_array', 'average_array'] } }, hidden: true }
                ]
			},
		},
	],
};