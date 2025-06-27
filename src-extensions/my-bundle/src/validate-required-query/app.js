export default {
	id: 'validate-data-types',
	name: 'Validate Query Parameter',
	icon: 'checklist_rtl',
	description: 'Validates properties in an object against required data types. Halts flow on failure.',

	overview: ({ required_rules }) => [
		{
			label: 'Validation Rules',
			text: required_rules ? `${required_rules.length} defined` : 'Not configured',
		},
	],

	options: [
		{
			field: 'input_object',
			name: 'Input Object to Validate',
			type: 'json',
			meta: {
				interface: 'input-code',
				options: {
					language: 'json',
					placeholder: 'e.g., {{$trigger.body}}',
				},
				width: 'full',
				note: 'The JSON object whose properties you want to validate.',
			},
		},
		{
			field: 'required_rules',
			name: 'Validation Rules',
			type: 'json',
			meta: {
				interface: 'list',
				width: 'full',
				options: {
					add_button_text: 'Add Rule',
					fields: [
						{
							field: 'key',
							name: 'Property Key',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'full',
								options: { placeholder: 'e.g., user.id or status' },
							},
						},
						{
							field: 'type',
							name: 'Required Type',
							type: 'string',
							meta: {
								interface: 'select-dropdown',
								width: 'half',
								options: {
									choices: [
										{ text: 'Text (String)', value: 'string' },
										{ text: 'Email', value: 'email' }, // NEW
										{ text: 'Number (Integer or Decimal)', value: 'number' },
										{ text: 'Boolean (true/false)', value: 'boolean' },
										{ text: 'Array', value: 'array' },
										{ text: 'Object', value: 'object' },
										{ text: 'Timestamp', value: 'timestamp' },
										{ text: 'Is Null', value: 'null' },
									],
								},
							},
							schema: { default_value: 'string' },
						},
						{
							field: 'allow_empty',
							name: 'Allow Empty / Null',
							type: 'boolean',
							meta: {
								interface: 'boolean',
								width: 'half',
								note: 'If true, an empty string or null value will pass validation.',
							},
							schema: { default_value: false },
						},
					],
				},
			},
		},
		{
			field: 'custom_error_prefix',
			name: 'Custom Error Message Prefix (Optional)',
			type: 'string',
			meta: {
				interface: 'input',
				options: {
					placeholder: 'e.g., Input Validation Failed:',
				},
				width: 'full',
			},
		},
	],
};