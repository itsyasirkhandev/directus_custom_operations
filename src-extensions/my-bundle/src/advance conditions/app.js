export default {
	id: 'operation-condition-gate',
	name: 'Condition (Gate)',
	icon: 'rule',
	description: 'Halts the flow if a set of grouped conditions are not met.',

	overview: ({ logic, condition_groups }) => [
		{
			label: 'Top-Level Logic',
			text: `Combining Groups with ${logic === '_or' ? 'OR' : 'AND'}`,
		},
		{
			label: 'Condition Groups',
			text: condition_groups ? `${condition_groups.length} defined` : 'None defined',
		},
	],

	options: [
		{
			field: 'logic',
			name: 'Top-Level Logic (for combining groups)',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'ALL groups must be true (AND)', value: '_and' },
						{ text: 'ANY group can be true (OR)', value: '_or' },
					],
				},
			},
			schema: {
				default_value: '_and',
			},
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
										{ text: 'ALL conditions in this group must be true (AND)', value: '_and' },
										{ text: 'ANY condition in this group can be true (OR)', value: '_or' },
									],
								},
							},
							schema: { default_value: '_and' },
						},
						{
							field: 'conditions',
							name: 'Conditions',
							type: 'json',
							meta: {
								width: 'full',
								interface: 'list',
								options: {
									add_button_text: 'Add Condition',
									fields: [
										{
											field: 'left_value',
											name: 'Value',
											type: 'string',
											meta: { interface: 'input', width: 'half', options: { placeholder: '{{$trigger.body.status}}' } },
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
														{ text: 'Contains (case-insensitive)', value: '_icontains' },
														{ text: 'Is Null', value: '_null' },
														{ text: 'Is Not Null', value: '_nnull' },
														{ text: 'Is Empty', value: '_empty' },
														{ text: 'Is Not Empty', value: '_nempty' },
														{ text: 'Is In List (comma-separated)', value: '_in' },
														{ text: 'Is Not In List (comma-separated)', value: '_nin' },
														{ text: 'Is After Date', value: '_after' },
														{ text: 'Is Before Date', value: '_before' },
														{ text: 'Matches Regex', value: '_regex' },
													],
												},
											},
											schema: { default_value: '_eq' },
										},
										{
											field: 'right_value',
											name: 'Comparison Value',
											type: 'string',
											meta: { interface: 'input', width: 'quarter', options: { placeholder: 'published' } },
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