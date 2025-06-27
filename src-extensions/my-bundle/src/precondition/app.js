export default {
	id: 'operation-simple-condition',
	name: 'Simple Condition',
	icon: 'rule',
	description: 'Compares two values and halts the flow if the condition is false.',

	overview: ({ value1, operator, value2 }) => [
		{
			label: 'Condition',
			text: `${value1 || 'Value 1'} ${operator || '??'} ${value2 || ''}`,
		},
	],

	options: [
		{
			field: 'value1',
			name: 'Value 1 / Object',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: { placeholder: 'e.g., {{$trigger.body.user_otp}} or {{$trigger.body}}' },
			},
			notes: 'For "Exists" checks, this should be the object to inspect.'
		},
		{
			field: 'operator',
			name: 'Operator',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Equals', value: '_eq' },
						{ text: 'Not Equals', value: '_neq' },
						{ text: 'Exists', value: '_exists' },
						{ text: 'Does Not Exist', value: '_does_not_exist' },
						{ text: 'Greater Than', value: '_gt' },
						{ text: 'Greater Than or Equal', value: '_gte' },
						{ text: 'Less Than', value: '_lt' },
						{ text: 'Less Than or Equal', value: '_lte' },
						{ text: 'Contains (case-insensitive)', value: '_icontains' },
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
			field: 'value2',
			name: 'Value 2 / Property Path',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: { placeholder: 'e.g., {{$last.backend_otp}} or user.address.city' },
				conditions: [
					// Hide this field for operators that only need one value
					{
						rule: { operator: { _nin: ['_null', '_nnull', '_empty', '_nempty'] } },
						hidden: false
					},
					{
						rule: { operator: { _in: ['_null', 'nnull', '_empty', '_nempty'] } },
						hidden: true
					}
				]
			},
			notes: 'For "Exists" checks, this should be the dot-notation path to the property.'
		},
	],
};