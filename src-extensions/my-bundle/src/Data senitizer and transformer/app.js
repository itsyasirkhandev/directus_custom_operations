// /extensions/operations/data-sanitizer-transformer/app.js

export default {
    id: 'data-sanitizer-transformer',
    name: 'Data Sanitizer & Transformer',
    icon: 'auto_fix_high',
    description: 'Applies a cleaning and transformation rule to an input object.',

    overview: ({ rules }) => [
        {
            label: 'Rules Defined',
            text: rules ? `${rules.length} rule(s)` : 'Not configured',
        },
    ],

    options: [
        {
            field: 'input_object',
            name: 'Input Object',
            type: 'json',
            meta: {
                interface: 'input-code',
                options: {
                    language: 'json',
                    placeholder: 'e.g., {{$trigger.body}}',
                },
                width: 'full',
                note: 'The JSON object you want to clean and transform.',
            },
        },
        {
            field: 'rules',
            name: 'Transformation Rules',
            type: 'json',
            meta: {
                width: 'full',
                interface: 'list',
                options: {
                    add_button_text: 'Add Rule',
                    fields: [
                        {
                            field: 'key',
                            name: 'Property Path',
                            type: 'string',
                            meta: {
                                interface: 'input',
                                width: 'full',
                                options: { placeholder: 'e.g., user.email or address.street' },
                            },
                        },
                        {
                            field: 'transformation', // FIX: Renamed to singular
                            name: 'Transformation', // FIX: Renamed to singular
                            type: 'string', // FIX: Changed type to string
                            meta: {
                                interface: 'select-dropdown', // FIX: Changed interface to a single dropdown
                                width: 'full',
                                options: {
                                    choices: [
                                        { text: 'Trim Whitespace', value: 'trim' },
                                        { text: 'To Lowercase', value: 'to_lowercase' },
                                        { text: 'To Uppercase', value: 'to_uppercase' },
                                        { text: 'Capitalize', value: 'capitalize' },
                                        { text: 'Set Default Value if Empty', value: 'default_if_empty' },
                                        { text: 'Convert to Number', value: 'to_number' },
                                        { text: 'Remove HTML Tags', value: 'strip_html' },
                                    ],
                                },
                            },
                        },
                        // --- Conditional field for 'Set Default Value' ---
                        {
                            field: 'default_value',
                            name: 'Default Value',
                            type: 'string',
                            meta: {
                                interface: 'input',
                                width: 'full',
                                conditions: [
                                    // FIX: Updated condition to check for equality
                                    {
                                        rule: { transformation: { _eq: 'default_if_empty' } },
                                        hidden: false,
                                    },
                                    {
                                        rule: { transformation: { _neq: 'default_if_empty' } },
                                        hidden: true,
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        },
    ],
};