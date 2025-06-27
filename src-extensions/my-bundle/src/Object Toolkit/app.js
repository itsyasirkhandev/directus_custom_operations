export default {
	id: 'operation-object-toolkit',
	name: 'Object Toolkit',
	icon: 'data_object',
	description: 'Performs various operations on JSON objects, like getting keys, values, or entries.',

	overview: ({ operation, input_object }) => [
		{
			label: 'Operation',
			text: operation ? operation.replace(/_/g, ' ') : 'Not Set',
		},
		{
			label: 'Input',
			text: input_object ? 'Object Provided' : 'Not Set',
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
						{ text: 'Get Keys', value: 'get_keys' },
						{ text: 'Get Values', value: 'get_values' },
						{ text: 'Get Entries (Key/Value Pairs)', value: 'get_entries' },
					],
				},
			},
			schema: { default_value: 'get_keys' },
		},
		{
			field: 'input_object',
			name: 'Input Object',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					language: 'json',
					placeholder: '{\n  "a": "3",\n  "b": "2",\n  "c": "1"\n}'
				}
			},
			notes: 'Provide the JSON object to operate on.'
		},
	],
};