export default {
	id: 'throw-custom-error',
	name: 'Throw Custom Error',
	icon: 'error',
	description: 'Halts the flow and throws a specific error with a custom message, status, and code.',

	overview: ({ message, status, code }) => [
		{
			label: 'Status',
			text: status || '400',
		},
		{
			label: 'Code',
			text: code || 'CUSTOM_ERROR',
		},
		{
			label: 'Message',
			text: message ? (message.length > 30 ? message.substring(0, 27) + '...' : message) : 'No message.',
		},
	],

	options: [
		{
			field: 'message',
			name: 'Error Message',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				note: 'The human-readable error message.',
				options: {
					placeholder: 'Invalid input provided.',
				},
			},
		},
		{
			field: 'status',
			name: 'Error Type (HTTP Status)',
			type: 'integer',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{ text: '400: Bad Request', value: 400 },
						{ text: '401: Unauthorized', value: 401 },
						{ text: '403: Forbidden', value: 403 },
						{ text: '404: Not Found', value: 404 },
						{ text: '409: Conflict', value: 409 },
						{ text: '500: Internal Server Error', value: 500 },
					],
					allowOther: true,
				},
				note: 'The HTTP status code to return.',
			},
			schema: {
				default_value: 400,
			},
		},
		{
			field: 'code',
			name: 'Error Code',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{ text: 'INVALID_INPUT', value: 'INVALID_INPUT' },
						{ text: 'NOT_FOUND', value: 'NOT_FOUND' },
						{ text: 'FORBIDDEN', value: 'FORBIDDEN' },
						{ text: 'UNAUTHENTICATED', value: 'UNAUTHENTICATED' },
						{ text: 'TOKEN_EXPIRED', value: 'TOKEN_EXPIRED' },
						{ text: 'INTERNAL_ERROR', value: 'INTERNAL_ERROR' },
					],
					allowOther: true,
				},
				note: 'A machine-readable code for this error.',
			},
			schema: {
				default_value: 'INVALID_INPUT'
			}
		},
	],
};