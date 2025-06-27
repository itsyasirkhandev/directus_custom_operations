export default {
	id: 'operation-data-converter',
	name: 'Data Converter',
	icon: 'transform',
	description: 'A versatile tool to encode, decode, and convert various data types.',

	overview: ({ operation }) => [
		{
			label: 'Operation',
			text: operation ? operation.replace(/_/g, ' ') : 'Not Set',
		},
	],

	options: [
		{
			field: 'operation',
			name: 'Conversion Operation',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Encode to Base64', value: 'base64_encode' },
						{ text: 'Decode from Base64', value: 'base64_decode' },
						{ text: 'Encode to URL Safe Base64', value: 'base64_encode_urlsafe' },
						{ text: 'Decode from URL Safe Base64', value: 'base64_decode_urlsafe' },
						{ text: 'Encode to URL Component', value: 'url_encode' },
						{ text: 'Decode from URL Component', value: 'url_decode' },
						{ text: 'Encode Object to JSON String', value: 'json_encode' },
						{ text: 'Decode JSON String to Object', value: 'json_decode' },
						{ text: 'Convert to Text (String)', value: 'to_text' },
						{ text: 'Convert to Integer', value: 'to_int' },
						{ text: 'Convert to Decimal (Float)', value: 'to_dec' },
						{ text: 'Convert to Boolean', value: 'to_bool' },
						{ text: 'Convert Number between Bases', value: 'base_convert' },
						{ text: 'Create Object from Keys/Values', value: 'create_object' },
					],
				},
			},
			schema: { default_value: 'base64_encode' },
		},
		{
			field: 'input_value',
			name: 'Input Value',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: { language: 'json', placeholder: '"Hello World"' },
			},
			notes: 'The data to be converted. For strings, wrap in double quotes.'
		},
		// --- Fields for Base Conversion ---
		{
			field: 'from_base',
			name: 'From Base',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				conditions: [{ rule: { operation: { _eq: 'base_convert' } }, hidden: false }, { rule: { operation: { _neq: 'base_convert' } }, hidden: true }]
			},
			schema: { default_value: 10 },
		},
		{
			field: 'to_base',
			name: 'To Base',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				conditions: [{ rule: { operation: { _eq: 'base_convert' } }, hidden: false }, { rule: { operation: { _neq: 'base_convert' } }, hidden: true }]
			},
			schema: { default_value: 16 },
		},
		// --- Fields for Create Object ---
		{
			field: 'keys_array',
			name: 'Keys (Array)',
			type: 'json',
			meta: {
				width: 'half',
				interface: 'input-code',
				options: { language: 'json', placeholder: '["key1", "key2"]' },
				conditions: [{ rule: { operation: { _eq: 'create_object' } }, hidden: false }, { rule: { operation: { _neq: 'create_object' } }, hidden: true }]
			},
		},
		{
			field: 'values_array',
			name: 'Values (Array)',
			type: 'json',
			meta: {
				width: 'half',
				interface: 'input-code',
				options: { language: 'json', placeholder: '["value1", "value2"]' },
				conditions: [{ rule: { operation: { _eq: 'create_object' } }, hidden: false }, { rule: { operation: { _neq: 'create_object' } }, hidden: true }]
			},
		},
	],
};