export default {
	id: 'operation-json-parser',
	name: 'Get Value',
	icon: 'data_object',
	description: 'Extracts a value from the flow data using a path.',

	overview: ({ path }) => [
		{
			label: 'Extract Value at Path',
			text: path || 'Not configured',
		},
	],

	options: [
		{
			field: 'path',
			name: 'Path in Flow Data',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: 'e.g., trigger.body.user.name',
					font: 'monospace',
				},
			},
			notes: 'Provide a path to the value within the flow context (e.g., trigger.body.customer.email or last.some_id). Do not use {{...}}.'
		},
        {
			field: 'default_value',
			name: 'Default Value',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: '(Optional) Value to return if path is not found',
				},
			},
			notes: 'If the path does not exist, this value will be returned instead of an error.'
		},
	],
};