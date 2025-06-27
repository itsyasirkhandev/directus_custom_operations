export default {
	id: 'external-api-request-simple',
	name: 'Advanced API Request',
	icon: 'http',
	description: 'Sends an HTTP request with advanced auth and response handling.',
	overview: ({ method, url, authMethod, responseBodyType }) => [
		{ label: 'Method', text: method || 'Not Set' },
		{ label: 'URL', text: url || 'Not Set' },
		{ label: 'Auth', text: authMethod || 'None' },
		{ label: 'Response', text: responseBodyType || 'Auto' },
	],
	options: [
        // --- Core Request Details ---
		{
			field: 'method',
			name: 'HTTP Method',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'GET', value: 'GET' },
						{ text: 'POST', value: 'POST' },
						{ text: 'PUT', value: 'PUT' },
						{ text: 'PATCH', value: 'PATCH' },
						{ text: 'DELETE', value: 'DELETE' },
					],
				},
				width: 'half',
			},
			schema: { default_value: 'GET' },
		},
		{
			field: 'url',
			name: 'Request URL',
			type: 'string',
			meta: {
				interface: 'input',
				options: { placeholder: 'https://api.example.com/data' },
				width: 'half',
				required: true,
			},
		},
        // --- Authentication Section ---
        {
			field: 'authMethod',
			name: 'Authentication',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'None', value: 'none' },
						{ text: 'Bearer Token', value: 'bearer' },
						{ text: 'Basic Auth', value: 'basic' },
						{ text: 'Custom Headers', value: 'custom' },
					],
				},
				width: 'full',
			},
			schema: { default_value: 'none' },
		},
        {
			field: 'bearerToken',
			name: 'Bearer Token',
			type: 'string',
			meta: {
				interface: 'input',
				options: { placeholder: 'Enter your API key or token', masked: true },
				width: 'full',
				conditions: [
                    { rule: { authMethod: { _eq: 'bearer' } }, hidden: false },
                    { rule: { authMethod: { _neq: 'bearer' } }, hidden: true }
                ]
			},
		},
        {
			field: 'basicAuthUsername',
			name: 'Username',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				conditions: [
                    { rule: { authMethod: { _eq: 'basic' } }, hidden: false },
                    { rule: { authMethod: { _neq: 'basic' } }, hidden: true }
                ]
			},
		},
        {
			field: 'basicAuthPassword',
			name: 'Password',
			type: 'string',
			meta: {
				interface: 'input',
                options: { masked: true },
				width: 'half',
				conditions: [
                    { rule: { authMethod: { _eq: 'basic' } }, hidden: false },
                    { rule: { authMethod: { _neq: 'basic' } }, hidden: true }
                ]
			},
		},
		{
			field: 'headers',
			name: 'Custom Headers',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					fields: [
						{ field: 'key', name: 'Header Name', type: 'string', meta: { interface: 'input', width: 'half' } },
						{ field: 'value', name: 'Header Value', type: 'string', meta: { interface: 'input', width: 'half' } },
					],
				},
				width: 'full',
                conditions: [
                    { rule: { authMethod: { _eq: 'custom' } }, hidden: false },
                    { rule: { authMethod: { _neq: 'custom' } }, hidden: true }
                ]
			},
		},
        // --- Query & Body Section ---
		{
			field: 'queryParams',
			name: 'Query Parameters',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					fields: [
						{ field: 'key', name: 'Param Name', type: 'string', meta: { interface: 'input', width: 'half' } },
						{ field: 'value', name: 'Param Value', type: 'string', meta: { interface: 'input', width: 'half' } },
					],
				},
				width: 'full',
			},
		},
		{
			field: 'bodyJson',
			name: 'JSON Body',
			type: 'json',
			meta: {
				interface: 'input-code',
				options: { language: 'json' },
				width: 'full',
                conditions: [
                    { rule: { method: { _in: ['POST', 'PUT', 'PATCH'] } }, hidden: false },
                    { rule: { method: { _nin: ['POST', 'PUT', 'PATCH'] } }, hidden: true }
                ]
			},
		},
        // --- Response Handling Section ---
        {
			field: 'responseBodyType',
			name: 'Response Body Type',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Auto-Detect (JSON or Text)', value: 'auto' },
						{ text: 'JSON', value: 'json' },
						{ text: 'Text / HTML', value: 'text' },
					],
				},
				width: 'half',
			},
			schema: { default_value: 'auto' },
		},
		{
			field: 'responseBodyPath',
			name: 'Response Body Path (Optional)',
			type: 'string',
			meta: {
				interface: 'input',
				options: { placeholder: 'e.g., data.user.id' },
				width: 'half',
                conditions: [
                    { rule: { responseBodyType: { _in: ['auto', 'json'] } }, hidden: false },
                    { rule: { responseBodyType: { _nin: ['auto', 'json'] } }, hidden: true }
                ],
				note: 'Extract a specific part of the JSON response.',
			},
		},
		{
			field: 'requestTimeout',
			name: 'Timeout (milliseconds)',
			type: 'integer',
			meta: {
				interface: 'input',
				options: { placeholder: '10000' },
				width: 'full',
			},
			schema: { default_value: 10000 },
		},
	],
};
