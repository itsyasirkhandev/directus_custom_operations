export default {
	id: 'object-builder',
	name: 'Object Builder',
	icon: 'build',
	description: 'Visually constructs a JSON object with static or dynamic key-value pairs.',

	overview: ({ properties }) => [
		{
			label: 'Properties Defined',
			text: properties ? `${properties.length}` : '0',
		},
	],

	options: [
		{
			field: 'properties',
			name: 'Object Properties',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					add_button_text: 'Add Property',
					fields: [
						{
							field: 'key',
							name: 'Key',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'full',
								options: { placeholder: 'e.g., name or user.id' },
							},
						},
						{
							field: 'source',
							name: 'Value Source',
							type: 'string',
							meta: {
								interface: 'select-dropdown',
								width: 'half',
								options: {
									choices: [
										{ text: 'Static Value', value: 'static' },
										{ text: 'From Flow Data', value: 'flow_data' },
									],
								},
							},
							schema: { default_value: 'static' },
						},
						// --- Field for dynamic data path ---
						{
							field: 'flow_data_path',
							name: 'Flow Data Path',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: { placeholder: 'e.g., trigger.body.name' },
								conditions: [
									{ rule: { source: { _eq: 'flow_data' } }, hidden: false },
									{ rule: { source: { _neq: 'flow_data' } }, hidden: true },
								],
							},
						},
						// --- Fields for static data ---
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
								conditions: [
									{ rule: { source: { _eq: 'static' } }, hidden: false },
									{ rule: { source: { _neq: 'static' } }, hidden: true },
								],
							},
							schema: { default_value: 'string' },
						},
						{
							field: 'string_value',
							name: 'Value',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'full',
								conditions: [
									{ rule: { source: { _eq: 'static' }, value_type: { _eq: 'string' } }, hidden: false },
									{ rule: { source: { _neq: 'static' } }, hidden: true },
									{ rule: { value_type: { _neq: 'string' } }, hidden: true },
								],
							},
						},
						{
							field: 'number_value',
							name: 'Value',
							type: 'float',
							meta: {
								interface: 'input',
								width: 'full',
								conditions: [
									{ rule: { source: { _eq: 'static' }, value_type: { _eq: 'number' } }, hidden: false },
									{ rule: { source: { _neq: 'static' } }, hidden: true },
									{ rule: { value_type: { _neq: 'number' } }, hidden: true },
								],
							},
						},
						{
							field: 'boolean_value',
							name: 'Value',
							type: 'boolean',
							meta: {
								interface: 'boolean',
								width: 'full',
								conditions: [
									{ rule: { source: { _eq: 'static' }, value_type: { _eq: 'boolean' } }, hidden: false },
									{ rule: { source: { _neq: 'static' } }, hidden: true },
									{ rule: { value_type: { _neq: 'boolean' } }, hidden: true },
								],
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
								conditions: [
									{ rule: { source: { _eq: 'static' }, value_type: { _eq: 'json' } }, hidden: false },
									{ rule: { source: { _neq: 'static' } }, hidden: true },
									{ rule: { value_type: { _neq: 'json' } }, hidden: true },
								],
							},
						},
					],
				},
			},
		},
	],
};