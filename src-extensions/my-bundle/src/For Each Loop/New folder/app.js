export default {
	id: 'operation-for-each-loop',
	name: 'For-Each Loop',
	icon: 'sync_alt',
	description: 'Iterates over an array and triggers another flow for each item using GET or POST.',

	overview: ({ execution_mode, method, item_list }) => [
		{
			label: 'Mode',
			text: execution_mode ? execution_mode.charAt(0).toUpperCase() + execution_mode.slice(1) : 'Serial',
		},
        {
            label: 'Method',
            text: method || 'POST',
        },
		{
			label: 'Items to Process',
			text: Array.isArray(item_list) ? `${item_list.length} items` : 'Input not configured',
		},
	],

	options: [
		{
			field: 'item_list',
			name: 'Input Array',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: { language: 'json' },
			},
			notes: 'Provide the array to loop over (e.g., from a "Read Data" step). Example: `{{$last}}`'
		},
		{
			field: 'target_webhook',
			name: 'Target Flow Webhook URL',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: { placeholder: 'https://your-directus.app/flows/trigger/...' },
			},
			notes: 'The target flow must have a "Webhook" trigger.'
		},
        {
			field: 'method',
			name: 'Webhook Method',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'POST (Sends item as request body)', value: 'POST' },
						{ text: 'GET (Sends item as a query parameter)', value: 'GET' },
					],
				},
			},
			schema: { default_value: 'POST' },
		},
		{
			field: 'query_param_name',
			name: 'Query Parameter Name (for GET)',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: { placeholder: 'e.g., item_data' },
				conditions: [
					{ rule: { method: { _eq: 'GET' } }, hidden: false },
					{ rule: { method: { _neq: 'GET' } }, hidden: true },
				]
			},
            notes: 'The name of the query parameter to send. The value will be the looped item.'
		},
		{
			field: 'execution_mode',
			name: 'Execution Mode',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Serial (One by one, slow & safe)', value: 'serial' },
						{ text: 'Parallel (All at once, fast & risky)', value: 'parallel' },
						{ text: 'Batch (Controlled groups, recommended)', value: 'batch' },
					],
				},
			},
			schema: { default_value: 'serial' },
		},
		{
			field: 'stop_on_error',
			name: 'Error Handling',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Stop on First Error', value: true },
						{ text: 'Continue on Error', value: false },
					]
				},
			},
			schema: { default_value: true },
		},
		{
			field: 'batch_size',
			name: 'Batch Size',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				conditions: [
					{ rule: { execution_mode: { _eq: 'batch' } }, hidden: false },
					{ rule: { execution_mode: { _neq: 'batch' } }, hidden: true }
				]
			},
			schema: { default_value: 10 },
		},
		{
			field: 'batch_delay',
			name: 'Delay Between Batches (ms)',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				conditions: [
					{ rule: { execution_mode: { _eq: 'batch' } }, hidden: false },
					{ rule: { execution_mode: { _neq: 'batch' } }, hidden: true }
				]
			},
			schema: { default_value: 1000 },
			notes: 'A 1000ms delay helps prevent API rate limiting.'
		},
	],
};