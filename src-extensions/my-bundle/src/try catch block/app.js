// /extensions/operations/try-catch/app.js

export default {
	id: 'operation-try-catch',
	name: 'Try/Catch Block',
	icon: 'healing',
	description: 'Executes a primary flow (Try) and triggers a fallback flow (Catch) if the first one fails.',

	overview: ({ try_flow_url, catch_flow_url }) => [
		{
			label: 'Try Flow',
			text: try_flow_url ? 'Configured' : 'Not Set',
		},
		{
			label: 'Catch Flow',
			text: catch_flow_url ? 'Configured' : 'Not Set',
		},
	],

	options: [
		{
			field: 'try_heading',
			meta: {
				width: 'full',
				interface: 'presentation-divider',
				options: { title: 'Try Block' }
			}
		},
		{
			field: 'try_flow_url',
			name: 'Primary Flow Webhook URL',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: 'https://your-directus.app/flows/trigger/...',
					iconRight: 'play_arrow'
				},
			},
			notes: 'The webhook URL of the flow to attempt first.'
		},
		{
			field: 'try_payload',
			name: 'Payload to Send',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					language: 'json',
					placeholder: '{"key": "value", "data": {{$trigger.body}} }'
				}
			},
			notes: 'The JSON data to send to your primary flow.'
		},
        {
			field: 'catch_heading',
			meta: {
				width: 'full',
				interface: 'presentation-divider',
				options: { title: 'Catch Block' }
			}
		},
		{
			field: 'catch_flow_url',
			name: 'Fallback Flow Webhook URL',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: 'https://your-directus.app/flows/trigger/...',
					iconRight: 'error'
				},
			},
			notes: 'The webhook URL of the flow to trigger if the primary flow fails.'
		},

	],
};