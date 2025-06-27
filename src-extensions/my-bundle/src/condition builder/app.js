export default {
	id: 'operation-filter-builder',
	name: 'Filter Builder',
	icon: 'filter_alt',
	description: 'Visually build complex, nested Directus filter rules.',

	overview: ({ top_level_logic, condition_groups, output_format }) => [
		{
			label: 'Logic',
			text: `Combining ${condition_groups?.length || 0} groups with ${top_level_logic === '_or' ? 'OR' : 'AND'}`,
		},
		{
			label: 'Output',
			text: output_format === 'filter' ? 'Wrapped in "filter" key' : 'Direct Object',
		}
	],

	options: [
		{
			field: 'output_format',
			name: 'Output Format',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Direct Filter Object (for conditions)', value: 'payload' },
						{ text: 'Wrapped in "filter" key (for Read Data)', value: 'filter' },
					],
				},
			},
			schema: { default_value: 'payload' },
			notes: 'Choose "Wrapped" when passing this to a Read Data operation.'
		},
		{
			field: 'top_level_logic',
			name: 'Top-Level Logic (for combining groups)',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'ANY group can be true (OR)', value: '_or' },
						{ text: 'ALL groups must be true (AND)', value: '_and' },
					],
				},
			},
			schema: { default_value: '_or' },
		},
		{
			field: 'condition_groups',
			name: 'Condition Groups',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					add_button_text: 'Add Condition Group',
					fields: [
						{
							field: 'group_logic',
							name: 'Group Logic',
							type: 'string',
							meta: {
								interface: 'select-dropdown',
								width: 'full',
								options: {
									choices: [
										{ text: 'ALL rules in this group must be true (AND)', value: '_and' },
										{ text: 'ANY rule in this group can be true (OR)', value: '_or' },
									],
								},
							},
							schema: { default_value: '_and' },
						},
						{
							field: 'rules',
							name: 'Rules',
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
											meta: { interface: 'input', width: 'half', options: { placeholder: 'status' } },
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
														{ text: 'In List', value: '_in' },
														{ text: 'Not In List', value: '_nin' },
														{ text: 'Contains', value: '_contains' },
														{ text: 'Contains (case-insensitive)', value: '_icontains' },
														{ text: 'Does Not Contain', value: '_ncontains' },
														{ text: 'Starts With', value: '_starts_with' },
														{ text: 'Does Not Start With', value: '_nstarts_with' },
														{ text: 'Ends With', value: '_ends_with' },
														{ text: 'Does Not End With', value: '_nends_with' },
														{ text: 'Is Null', value: '_null' },
														{ text: 'Is Not Null', value: '_nnull' },
														{ text: 'Is Empty', value: '_empty' },
														{ text: 'Is Not Empty', value: '_nempty' },
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
												options: { placeholder: 'published,draft' },
											},
											notes: 'For lists, use comma-separated values. Use Directus variables like $CURRENT_USER.'
										},
									],
								},
							},
						},
					],
				},
			},
		},
	],
};