export default {
	id: 'operation-array-toolkit',
	name: 'Array Toolkit',
	icon: 'data_array',
	description: 'Performs various manipulation operations on arrays.',

	overview: ({ operation }) => [
		{
			label: 'Operation',
			text: operation ? operation.replace(/_/g, ' ') : 'Not Set',
		},
	],

	options: [
		{
			field: 'operation',
			name: 'Operation',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Append (Add to End)', value: 'append' },
						{ text: 'Prepend (Add to Start)', value: 'prepend' },
						{ text: 'Join to String', value: 'join' },
						{ text: 'Get First Item', value: 'get_first' },
						{ text: 'Get Last Item', value: 'get_last' },
						{ text: 'Pop (Remove Last Item)', value: 'pop' },
						{ text: 'Remove Item at Index', value: 'remove_at_index' },
						{ text: 'Create Number Range', value: 'range' },
					],
				},
			},
			schema: { default_value: 'append' },
		},
		{
			field: 'input_array',
			name: 'Input Array',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: { language: 'json', placeholder: '["apple", "banana"]' },
				conditions: [
                    { rule: { operation: { _neq: 'range' } }, hidden: false },
                    { rule: { operation: { _eq: 'range' } }, hidden: true }
                ]
			},
		},
		// --- Conditional Fields ---
		{
			field: 'element_to_add',
			name: 'Element to Add',
			type: 'json',
			meta: {
				interface: 'input-code',
				options: { language: 'json', placeholder: '"cherry"' },
				width: 'full',
				conditions: [
					{ rule: { operation: { _in: ['append', 'prepend'] } }, hidden: false },
					{ rule: { operation: { _nin: ['append', 'prepend'] } }, hidden: true },
				]
			},
			notes: 'Enter the value to add. For strings, wrap in double quotes.'
		},
		{
			field: 'delimiter',
			name: 'Delimiter',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				options: { placeholder: ', ' },
				conditions: [
					{ rule: { operation: { _eq: 'join' } }, hidden: false },
					{ rule: { operation: { _neq: 'join' } }, hidden: true },
				]
			},
		},
		{
			field: 'index_to_remove',
			name: 'Index to Remove',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'full',
				options: { placeholder: '0' },
				conditions: [
					{ rule: { operation: { _eq: 'remove_at_index' } }, hidden: false },
					{ rule: { operation: { _neq: 'remove_at_index' } }, hidden: true },
				]
			},
			notes: '0 is the first item in the array.'
		},
		{
			field: 'start_number',
			name: 'Start Number',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'half',
				conditions: [
					{ rule: { operation: { _eq: 'range' } }, hidden: false },
					{ rule: { operation: { _neq: 'range' } }, hidden: true },
				]
			},
			schema: { default_value: 1 }
		},
		{
			field: 'end_number',
			name: 'End Number',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'half',
				conditions: [
					{ rule: { operation: { _eq: 'range' } }, hidden: false },
					{ rule: { operation: { _neq: 'range' } }, hidden: true },
				]
			},
			schema: { default_value: 10 }
		},
	],
};