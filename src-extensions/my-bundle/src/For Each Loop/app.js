export default {
	id: 'operation-for-each-loop',
	name: 'For-Each Loop',
	icon: 'sync_alt',
	description: 'Iterates a set number of times or over an array, triggering another flow for each item.',

	overview: ({ loop_type, loop_count, item_list, collect_results }) => [
		{
			label: 'Loop Type',
			text: loop_type ? loop_type.replace(/_/g, ' ') : 'Not Set',
		},
		{
			label: 'Iterations',
			text: loop_type === 'by_number' ? loop_count : (Array.isArray(item_list) ? `${item_list.length} items` : 'N/A'),
		},
        {
            label: 'Collect Results',
            text: collect_results ? 'Yes' : 'No',
        }
	],

	options: [
        {
			field: 'loop_type',
			name: 'Loop Type',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'By Number (Run X times)', value: 'by_number' },
						{ text: 'By Input Data (Iterate over an array)', value: 'by_data' },
					],
				},
			},
			schema: { default_value: 'by_data' },
		},
		{
			field: 'loop_count',
			name: 'Number of Times to Run',
			type: 'integer',
			meta: {
				width: 'full',
				interface: 'input',
                options: { placeholder: 'e.g., 4' },
				conditions: [
					{ rule: { loop_type: { _eq: 'by_number' } }, hidden: false },
					{ rule: { loop_type: { _neq: 'by_number' } }, hidden: true }
				]
			},
			schema: { default_value: 1 },
		},
		{
			field: 'item_list',
			name: 'Input Array',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: { language: 'json', placeholder: '[{"email": "a@a.com"}, {"email": "b@b.com"}]' },
				conditions: [
					{ rule: { loop_type: { _eq: 'by_data' } }, hidden: false },
					{ rule: { loop_type: { _neq: 'by_data' } }, hidden: true }
				]
			},
			notes: 'Provide the array to loop over.'
		},
        {
			field: 'divider_1',
			meta: { width: 'full', interface: 'presentation-divider', options: { title: 'Target Flow' } }
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
		},
        {
			field: 'additional_payload',
			name: 'Additional Payload (Optional)',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: { language: 'json', placeholder: '{"static_key": "static_value"}' },
			},
            notes: 'This JSON object will be sent with every single loop iteration.'
		},
        {
			field: 'divider_2',
			meta: { width: 'full', interface: 'presentation-divider', options: { title: 'Execution Options' } }
		},
        {
			field: 'collect_results',
			name: 'Collect & Return Results',
			type: 'boolean',
			meta: {
				width: 'full',
				interface: 'boolean',
			},
			schema: { default_value: false },
            notes: 'If enabled, the loop will run serially and return an array of all results from the sub-flow.'
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
				conditions: [{ rule: { collect_results: { _eq: false } }, hidden: false }, { rule: { collect_results: { _neq: false } }, hidden: true }]
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
				options: { choices: [{ text: 'Stop on First Error', value: true }, { text: 'Continue on Error', value: false }] },
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
				conditions: [{ rule: { execution_mode: { _eq: 'batch' }, collect_results: { _eq: false } }, hidden: false }, { rule: { execution_mode: { _neq: 'batch' } }, hidden: true }, { rule: { collect_results: { _neq: false } }, hidden: true }]
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
				conditions: [{ rule: { execution_mode: { _eq: 'batch' }, collect_results: { _eq: false } }, hidden: false }, { rule: { execution_mode: { _neq: 'batch' } }, hidden: true }, { rule: { collect_results: { _neq: false } }, hidden: true }]
			},
			schema: { default_value: 1000 },
		},
	],
};