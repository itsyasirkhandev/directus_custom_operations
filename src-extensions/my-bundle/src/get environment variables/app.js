export default {
	id: 'operation-get-env-variable',
	name: 'Get Environment Variable',
	icon: 'vpn_key',
	description: 'Retrieves a value from the project\'s .env file.',

	overview: ({ variable_name }) => [
		{
			label: 'Variable Name',
			text: variable_name || '⚠️ Not Set',
		},
	],

	options: [
		{
			field: 'variable_name',
			name: 'Variable Name',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: 'e.g., SECRET_API_KEY',
					font: 'monospace',
				},
			},
			notes: 'Enter the exact name of the variable as it appears in your .env file.'
		},
	],
};