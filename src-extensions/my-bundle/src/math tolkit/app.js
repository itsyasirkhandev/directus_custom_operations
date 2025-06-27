export default {
	id: 'operation-math-toolkit',
	name: 'Math Toolkit',
	icon: 'calculate',
	description: 'Performs various mathematical calculations.',

	overview: ({ math_operation, number_a, simple_operator, number_b, rounding_input, rounding_method, decimal_places, min_max_operator }) => {
		const overviewItems = [{
			label: 'Operation',
			text: math_operation ? math_operation.replace(/_/g, ' ') : 'Not Set',
		}];

		switch (math_operation) {
			case 'simple_calculation':
				overviewItems.push({
					label: 'Calculation',
					text: `${number_a || 'A'} ${simple_operator || '+'} ${number_b || 'B'}`
				});
				break;
			case 'rounding':
				overviewItems.push({
					label: 'Input',
					text: String(rounding_input || 'Not Set')
				});
				overviewItems.push({
					label: 'Method',
					text: `${rounding_method || 'round'} ${rounding_method === 'round' && decimal_places ? `to ${decimal_places} places` : ''}`
				});
				break;
			case 'sum_array':
			case 'average_array':
				overviewItems.push({
					label: 'Input',
					text: 'Array of numbers'
				});
				break;
			case 'min_max_array':
			case 'min_max_inputs':
				overviewItems.push({
					label: 'Find',
					text: `${min_max_operator || 'min'} value`
				});
				break;
		}
		
		return overviewItems;
	},

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
						{ text: 'Get Min/Max from Array', value: 'min_max_array' },
						{ text: 'Get Min/Max from Inputs', value: 'min_max_inputs' },
					],
				},
			},
			schema: { default_value: 'simple_calculation' },
		},
		// --- Fields for Simple Calculation ---
		{
			field: 'number_a',
			name: 'Number A',
			type: 'string', // Changed to string for dynamic values
			meta: {
				width: 'quarter',
				interface: 'input',
				options: { placeholder: 'e.g., 5 or {{...}}' },
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
			type: 'string', // Changed to string for dynamic values
			meta: {
				width: 'quarter',
				interface: 'input',
				options: { placeholder: 'e.g., 10 or {{...}}' },
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
			type: 'string', // Changed to string for dynamic values
			meta: {
				width: 'full',
				interface: 'input',
				options: { placeholder: 'e.g., 3.14 or {{...}}' },
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
			type: 'string', // Changed to string for dynamic values
			meta: {
				width: 'half',
				interface: 'input',
                options: { placeholder: 'e.g., 2 or {{...}}' },
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
                    { rule: { math_operation: { _in: ['sum_array', 'average_array', 'min_max_array'] } }, hidden: false },
                    { rule: { math_operation: { _nin: ['sum_array', 'average_array', 'min_max_array'] } }, hidden: true }
                ]
			},
		},
		// --- Field for One-by-One Inputs ---
		{
			field: 'one_by_one_values',
			name: 'Input Values',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					add_button_text: 'Add Number',
					fields: [{ field: 'value', name: 'Number', type: 'string', meta: { interface: 'input', width: 'full', options: { placeholder: 'e.g., 25 or {{$last}}' } } }]
				},
				conditions: [
					{ rule: { math_operation: { _eq: 'min_max_inputs' } }, hidden: false },
					{ rule: { math_operation: { _neq: 'min_max_inputs' } }, hidden: true }
				]
			},
		},
		// --- Operator for Min/Max ---
		{
			field: 'min_max_operator',
			name: 'Find',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Minimum Value', value: 'min' },
						{ text: 'Maximum Value', value: 'max' },
					],
				},
				conditions: [
					{ rule: { math_operation: { _in: ['min_max_array', 'min_max_inputs'] } }, hidden: false },
					{ rule: { math_operation: { _nin: ['min_max_array', 'min_max_inputs'] } }, hidden: true }
				]
			},
			schema: { default_value: 'min' },
		},
	],
};