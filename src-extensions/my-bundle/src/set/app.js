export default {
	id: 'operation-set-value',
	name: 'Set Value in Object',
	icon: 'tune',
	description: 'Sets or replaces a value at a specified path within a JSON object or array.',

	overview: ({ path, value_type }) => [
		{
			label: 'Path',
			text: path || 'Not Set',
		},
		{
			label: 'Value Type',
			text: value_type || 'Not Set',
		},
	],

	options: [
		{
			field: 'input_data',
			name: 'Input Object or Array',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: { language: 'json' },
			},
			notes: 'The JSON object or array to modify.'
		},
		{
			field: 'path',
			name: 'Path',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: 'e.g., user.address.city or items[0].price',
					font: 'monospace',
				},
			},
			notes: 'Use dot notation for objects and bracket notation for arrays.'
		},
		{
			field: 'divider',
			meta: {
				width: 'full',
				interface: 'presentation-divider',
				options: { title: 'Value to Set' }
			}
		},
		{
			field: 'value_type',
			name: 'Value Type',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{ text: 'String', value: 'string' },
						{ text: 'Number', value: 'number' },
						{ text: 'Boolean', value: 'boolean' },
						{ text: 'JSON (Object/Array)', value: 'json' },
						{ text: 'Null', value: 'null' },
					],
				},
			},
			schema: { default_value: 'string' },
		},
		// --- Conditional Value Fields ---
		{
			field: 'string_value',
			name: 'Value',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				conditions: [{ rule: { value_type: { _eq: 'string' } }, hidden: false }, { rule: { value_type: { _neq: 'string' } }, hidden: true }],
			},
		},
		{
			field: 'number_value',
			name: 'Value',
			type: 'float',
			meta: {
				interface: 'input',
				width: 'full',
				conditions: [{ rule: { value_type: { _eq: 'number' } }, hidden: false }, { rule: { value_type: { _neq: 'number' } }, hidden: true }],
			},
		},
		{
			field: 'boolean_value',
			name: 'Value',
			type: 'boolean',
			meta: {
				interface: 'boolean',
				width: 'full',
				conditions: [{ rule: { value_type: { _eq: 'boolean' } }, hidden: false }, { rule: { value_type: { _neq: 'boolean' } }, hidden: true }],
			},
			schema: { default_value: true }
		},
		{
			field: 'json_value',
			name: 'Value',
			type: 'json',
			meta: {
				interface: 'input-code',
				width: 'full',
				options: { language: 'json', placeholder: '["a", "b"]' },
				conditions: [{ rule: { value_type: { _eq: 'json' } }, hidden: false }, { rule: { value_type: { _neq: 'json' } }, hidden: true }],
			},
		},
	],
};