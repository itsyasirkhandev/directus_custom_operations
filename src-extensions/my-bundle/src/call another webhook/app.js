// /extensions/operations/simplified-flow-trigger/app.js

export default {
    id: 'simplified-flow-trigger',
    name: 'Simplified Flow Trigger',
    icon: 'send_to_mobile',
    description: 'Triggers another flow with a user-friendly UI for payloads. Can be run synchronously or asynchronously.',

    overview: ({ method, url, wait_for_response }) => [
        {
            label: 'Method',
            text: method || 'POST',
        },
        {
            label: 'Mode',
            text: wait_for_response === false ? 'Asynchronous (Fire & Forget)' : 'Synchronous (Wait for Response)',
        },
        {
            label: 'URL',
            text: url || 'Not Set',
        },
    ],

    options: [
        {
            field: 'method',
            name: 'HTTP Method',
            type: 'string',
            meta: {
                width: 'half',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'POST', value: 'POST' },
                        { text: 'GET', value: 'GET' },
                    ],
                },
            },
            // This ensures POST is selected by default
            schema: { default_value: 'POST' },
        },
        {
			field: 'wait_for_response',
			name: 'Wait for Response',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
                options: {
                    label: 'Wait for sub-flow to finish'
                }
			},
			schema: { default_value: true },
            notes: 'If off, this flow will continue immediately without waiting for the other flow to complete.'
		},
        {
            field: 'url',
            name: 'Webhook URL',
            type: 'string',
            meta: {
                width: 'full',
                interface: 'input',
                options: { placeholder: 'https://your-directus.app/flows/trigger/...' },
                required: true,
            },
        },
        {
			field: 'body_properties',
			name: 'Body Properties',
			type: 'json',
			meta: {
				interface: 'list',
                width: 'full',
				options: {
                    add_button_text: 'Add Property',
					fields: [
                        {
                            field: 'key',
                            name: 'Key',
                            type: 'string',
                            meta: { interface: 'input', width: 'full', options: { placeholder: 'e.g., user_id' } },
                        },
                        {
                            field: 'value_type',
                            name: 'Value Type',
                            type: 'string',
                            meta: {
                                interface: 'select-dropdown',
                                width: 'half',
                                options: {
                                    choices: [
                                        { text: 'String', value: 'string' },
                                        { text: 'Number', value: 'number' },
                                        { text: 'Boolean', value: 'boolean' },
                                        { text: 'JSON (Object/Array)', value: 'json' },
                                    ]
                                }
                            },
                            schema: { default_value: 'string' }
                        },
                        // --- Conditional Value Fields ---
                        {
                            field: 'string_value', name: 'Value', type: 'string',
                            meta: { interface: 'input', width: 'half', conditions: [{ rule: { value_type: { _eq: 'string' } }, hidden: false }, { rule: { value_type: { _neq: 'string' } }, hidden: true }] }
                        },
                        {
                            field: 'number_value', name: 'Value', type: 'float',
                            meta: { interface: 'input', width: 'half', conditions: [{ rule: { value_type: { _eq: 'number' } }, hidden: false }, { rule: { value_type: { _neq: 'number' } }, hidden: true }] }
                        },
                        {
                            field: 'boolean_value', name: 'Value', type: 'boolean',
                            meta: { interface: 'boolean', width: 'half', options: {label: ' '}, conditions: [{ rule: { value_type: { _eq: 'boolean' } }, hidden: false }, { rule: { value_type: { _neq: 'boolean' } }, hidden: true }] }
                        },
                        {
                            field: 'json_value', name: 'Value', type: 'json',
                            meta: { interface: 'input-code', options: { language: 'json' }, width: 'half', conditions: [{ rule: { value_type: { _eq: 'json' } }, hidden: false }, { rule: { value_type: { _neq: 'json' } }, hidden: true }] }
                        },
                    ],
				},
                // --- FIX: This is the corrected logic ---
                conditions: [
                    { rule: { method: { _eq: 'POST' } }, hidden: false },
                    { rule: { method: { _neq: 'POST' } }, hidden: true },
                ]
			},
		},
        {
			field: 'query_parameters',
			name: 'Query Parameters',
			type: 'json',
			meta: {
				interface: 'list',
                width: 'full',
				options: {
                    add_button_text: 'Add Parameter',
					fields: [
                        { field: 'key', name: 'Key', type: 'string', meta: { interface: 'input', width: 'half', options: { placeholder: 'e.g., limit' } } },
                        { field: 'value', name: 'Value', type: 'string', meta: { interface: 'input', width: 'half', options: { placeholder: 'e.g., 10 or {{$last}}' } } },
                    ],
				},
                // --- FIX: This is the corrected logic ---
                conditions: [
                    { rule: { method: { _eq: 'GET' } }, hidden: false },
                    { rule: { method: { _neq: 'GET' } }, hidden: true },
                ]
			},
		},
    ],
};