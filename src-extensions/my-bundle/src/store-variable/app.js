export default {
	id: 'operation-store-value',
	name: 'Store Value',
	icon: 'inventory_2',
	description: 'Stores a value of a specific type (string, object, array, etc.) and returns it directly.',

	overview: ({ value_type, value_input }) => {
		let textRepresentation = String(value_input) || 'Not configured';

		if (textRepresentation.length > 30) {
			textRepresentation = textRepresentation.substring(0, 30) + '...';
		}

		return [
			{
				label: 'Type',
				text: value_type,
			},
			{
				label: 'Stored Value',
				text: textRepresentation,
			},
		];
	},

	options: [
		{
			field: 'value_type',
			name: 'Data Type',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'String', value: 'string' },
						{ text: 'Number', value: 'number' },
						{ text: 'Boolean', value: 'boolean' },
						{ text: 'JSON (Object or Array)', value: 'json' },
					],
				},
			},
			schema: {
				default_value: 'string',
			},
		},
		{
			field: 'value_input',
			name: 'Value',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input-multiline',
				options: {
					placeholder: 'Enter the value to store...',
				},
			},
			notes: 'For String, type directly. For Number, enter digits. For Boolean, type "true" or "false". For JSON, paste valid JSON.',
		},
	],
};