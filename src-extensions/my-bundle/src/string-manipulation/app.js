export default {
	id: 'operation-string-toolkit',
	name: 'String Toolkit',
	icon: 'text_fields',
	description: 'Performs a variety of text manipulation operations.',

	overview: ({ operation, input_string }) => [
		{
			label: 'Operation',
			text: operation ? operation.replace(/_/g, ' ') : 'Not Set',
		},
		{
			label: 'Input',
			text: input_string ? `${String(input_string).substring(0, 30)}...` : 'Not Set',
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
						{ text: 'Append Text', value: 'append' },
						{ text: 'Prepend Text', value: 'prepend' },
						{ text: 'Trim Whitespace', value: 'trim' },
						{ text: 'Left Trim Whitespace', value: 'ltrim' },
						{ text: 'Right Trim Whitespace', value: 'rtrim' },
						{ text: 'Replace Text', value: 'replace' },
						{ text: 'Starts With', value: 'starts_with' },
						{ text: 'Ends With', value: 'ends_with' },
						{ text: 'Contains', value: 'contains' },
						{ text: 'Format Template', value: 'format_template' },
					],
				},
			},
			schema: { default_value: 'append' },
		},
		{
			field: 'input_string',
			name: 'Input String',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input-multiline',
				options: {
					placeholder: 'The text to manipulate...'
				}
			},
		},
		// --- Fields for Append/Prepend ---
		{
			field: 'text_to_add',
			name: 'Text to Add',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				options: { placeholder: 'e.g., world or {{$last}}' },
				conditions: [
					{ rule: { operation: { _in: ['append', 'prepend'] } }, hidden: false },
					{ rule: { operation: { _nin: ['append', 'prepend'] } }, hidden: true },
				]
			},
		},
		// --- Fields for Replace ---
		{
			field: 'find_text',
			name: 'Find Text',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				conditions: [
					{ rule: { operation: { _eq: 'replace' } }, hidden: false },
					{ rule: { operation: { _neq: 'replace' } }, hidden: true },
				]
			},
		},
		{
			field: 'replace_with',
			name: 'Replace With',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				conditions: [
					{ rule: { operation: { _eq: 'replace' } }, hidden: false },
					{ rule: { operation: { _neq: 'replace' } }, hidden: true },
				]
			},
		},
		// --- Fields for Contains/Starts With/Ends With ---
		{
			field: 'substring_to_check',
			name: 'Text to Check For',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				conditions: [
					{ rule: { operation: { _in: ['starts_with', 'ends_with', 'contains'] } }, hidden: false },
					{ rule: { operation: { _nin: ['starts_with', 'ends_with', 'contains'] } }, hidden: true },
				]
			},
		},
		{
			field: 'match_case',
			name: 'Match Case',
			type: 'boolean',
			meta: {
				interface: 'boolean',
				width: 'full',
				conditions: [
					{ rule: { operation: { _in: ['starts_with', 'ends_with', 'contains', 'replace'] } }, hidden: false },
					{ rule: { operation: { _nin: ['starts_with', 'ends_with', 'contains', 'replace'] } }, hidden: true },
				]
			},
			schema: { default_value: false }
		},
		// --- Fields for Format Template ---
		{
			field: 'template_string',
			name: 'Template String',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input-multiline',
				options: { placeholder: 'Hello {name}, your ID is {id}.' },
				conditions: [
					{ rule: { operation: { _eq: 'format_template' } }, hidden: false },
					{ rule: { operation: { _neq: 'format_template' } }, hidden: true },
				]
			},
		},
		{
			field: 'replacements',
			name: 'Replacements',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					add_button_text: 'Add Replacement',
					fields: [
						{ field: 'key', name: 'Placeholder Key', type: 'string', meta: { interface: 'input', width: 'half', options: { placeholder: 'name (no braces)' } } },
						{ field: 'value', name: 'Replacement Value', type: 'string', meta: { interface: 'input', width: 'half', options: { placeholder: 'Jane or {{$last}}' } } },
					],
				},
				conditions: [
					{ rule: { operation: { _eq: 'format_template' } }, hidden: false },
					{ rule: { operation: { _neq: 'format_template' } }, hidden: true },
				]
			},
		},
	],
};