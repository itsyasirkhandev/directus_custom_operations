export default {
	id: 'operation-send-realtime-event',
	name: 'Send Real-time Event',
	icon: 'podcasts',
	description: 'Sends a real-time event (notification) to specific users without triggering an email.',

	overview: ({ recipients, subject }) => [
		{
			label: 'Recipients',
			text: recipients ? `${recipients.split(',').length} user(s)` : 'Not Set',
		},
		{
			label: 'Subject',
			text: subject || 'No Subject',
		},
	],

	options: [
		{
			field: 'recipients',
			name: 'Recipient User IDs',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: 'Enter one or more User IDs, separated by commas',
				},
			},
			notes: 'You can use dynamic values, e.g., {{$trigger.user}} or {{$last.user_id}}.'
		},
		{
			field: 'subject',
			name: 'Subject / Event Name',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: { placeholder: 'e.g., job_completed' }
			},
		},
		{
			field: 'message',
			name: 'Message / Payload',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'textarea',
				options: { placeholder: 'Can be a simple string or a JSON string.' }
			},
		},
        {
			field: 'divider',
			meta: {
				width: 'full',
				interface: 'presentation-divider',
				options: { title: 'Link to Item (Optional)' }
			}
		},
        {
            field: 'collection',
            name: 'Collection',
            type: 'string',
            meta: {
                width: 'half',
                interface: 'system-collection'
            },
        },
        {
            field: 'item',
            name: 'Item ID',
            type: 'string',
            meta: {
                width: 'half',
                interface: 'input'
            }
        }
	],
};
