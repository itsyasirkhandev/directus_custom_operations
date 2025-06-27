export default {
	id: 'operation-find-replace',
	name: 'Find and Replace',
	icon: 'find_replace',
	description: 'Finds and replaces text based on one or more rules.',

	overview: ({ input_string, rules }) => [
		{
			label: 'Rules Defined',
			text: rules ? `${rules.length}` : '0',
		},
		{
			label: 'Input String',
			text: input_string ? `${input_string.substring(0, 30)}...` : 'Not Set',
		},
	],

	options: [
		{
			field: 'input_string',
			name: 'Input String',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input-multiline',
				options: {
					placeholder: 'The text to perform replacements on...'
				}
			},
		},
		{
			field: 'rules',
			name: 'Replacement Rules',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					add_button_text: 'Add Rule',
					fields: [
						{
							field: 'find',
							name: 'Find Text',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: { placeholder: 'text to find' },
							},
						},
						{
							field: 'replace',
							name: 'Replace With',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: { placeholder: 'new text' },
							},
						},
						{
							field: 'match_case',
							name: 'Match Case',
							type: 'boolean',
							meta: {
								interface: 'boolean',
								width: 'full',
							},
							schema: {
								default_value: false
							},
							notes: 'If enabled, the search will be case-sensitive (e.g., "Apple" will not match "apple").'
						}
					],
				},
			},
		},
		{
			field: 'stop_on_first_match',
			name: 'Stop on First Match',
			type: 'boolean',
			meta: {
				width: 'full',
				interface: 'boolean'
			},
			schema: {
				default_value: false,
			},
			notes: 'If enabled, the operation will stop after the first successful replacement.'
		}
	],
};
