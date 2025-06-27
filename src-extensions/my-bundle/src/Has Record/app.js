export default {
	id: 'operation-has-record',
	name: 'Has Record?',
	icon: 'check_box',
	description: 'Checks if a record exists in a collection based on a filter. Halts the flow if no record is found.',

	overview: ({ collection, filter_rules }) => [
		{
			label: 'Collection',
			text: collection ? `collections.${collection}` : 'Not Set',
		},
		{
			label: 'Filter Rules',
			text: filter_rules ? `${filter_rules.length} defined` : 'No filter',
		},
	],

	options: [
		{
			field: 'collection',
			name: '$t:collection',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'system-collection',
				options: {
					include_system: true,
				},
			},
		},
		{
			field: 'logic',
			name: 'Logic',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'ALL rules must be true (AND)', value: '_and' },
						{ text: 'ANY rule can be true (OR)', value: '_or' },
					],
				},
			},
			schema: { default_value: '_and' },
		},
		{
			field: 'filter_rules',
			name: 'Filter Rules',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					add_button_text: 'Add Rule',
					fields: [
						{
							field: 'field',
							name: 'Field',
							type: 'string',
							meta: {
								interface: 'system-field-in-collection',
								options: {
									collectionField: 'collection',
								},
								width: 'half',
							},
						},
						{
							field: 'operator',
							name: 'Operator',
							type: 'string',
							meta: {
								interface: 'select-dropdown',
								width: 'quarter',
								options: {
									choices: [
										{ text: 'Equals', value: '_eq' },
										{ text: 'Not Equals', value: '_neq' },
										{ text: 'Greater Than', value: '_gt' },
										{ text: 'Greater Than or Equal', value: '_gte' },
										{ text: 'Less Than', value: '_lt' },
										{ text: 'Less Than or Equal', value: '_lte' },
										{ text: 'Contains (case-sensitive)', value: '_contains' },
										{ text: 'Is Null', value: '_null' },
										{ text: 'Is Not Null', value: '_nnull' },
										{ text: 'Is In List (comma-separated)', value: '_in' },
										{ text: 'Is Not In List (comma-separated)', value: '_nin' },
									],
								},
							},
							schema: { default_value: '_eq' },
						},
						{
							field: 'value',
							name: 'Value',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'quarter',
								options: { placeholder: 'Enter value' },
							},
						},
					],
				},
			},
			notes: 'If a record matching the rules is found, the flow continues. If not, the flow is halted and will follow the reject path.'
		},
	],
};
