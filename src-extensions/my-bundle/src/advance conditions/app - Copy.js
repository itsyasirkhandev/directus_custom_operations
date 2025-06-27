export default {
    id: 'operation-condition-gate',
    name: 'Condition (Gate)',
    icon: 'rule',
    description: 'Halts the flow if conditions are not met. Acts as a gate.',

    overview: ({ logic, conditions }) => [
        {
            label: 'Logic',
            text: logic === '_or' ? 'ANY (OR)' : 'ALL (AND)',
        },
        {
            label: 'Conditions',
            text: conditions ? `${conditions.length} defined` : 'None defined',
        },
    ],

    options: [
        {
            field: 'logic',
            name: 'Logic Gate',
            type: 'string',
            meta: {
                width: 'half',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'ALL conditions must be true (AND)', value: '_and' },
                        { text: 'ANY condition can be true (OR)', value: '_or' },
                    ],
                },
            },
            schema: {
                default_value: '_and',
            },
        },
        {
            field: 'conditions',
            name: 'Conditions',
            type: 'json',
            meta: {
                width: 'full',
                interface: 'list', // This creates the repeatable fields UI
                options: {
                    add_button_text: 'Add Condition',
                    fields: [
                        {
                            field: 'left_value',
                            name: 'Value',
                            type: 'string',
                            meta: { interface: 'input', width: 'half', options: { placeholder: '{{$trigger.body.status}}' } },
                        },
                        {
                            field: 'operator',
                            name: 'Operator',
                            type: 'string',
                            meta: {
                                interface: 'select-dropdown',
                                width: 'quarter',
                                options: {
                                    choices: [
                                        { text: 'Equals', value: '_eq' },
                                        { text: 'Not Equals', value: '_neq' },
                                        { text: 'Greater Than', value: '_gt' },
                                        { text: 'Greater Than or Equal', value: '_gte' },
                                        { text: 'Less Than', value: '_lt' },
                                        { text: 'Less Than or Equal', value: '_lte' },
                                        { text: 'Contains (case-sensitive)', value: '_contains' },
                                        { text: 'Does Not Contain (case-sensitive)', value: '_ncontains' },
                                        { text: 'Contains (case-insensitive)', value: '_icontains' },
                                        { text: 'Is Null', value: '_null' },
                                        { text: 'Is Not Null', value: '_nnull' },
                                        { text: 'Is Empty', value: '_empty' },
                                        { text: 'Is Not Empty', value: '_nempty' },
                                    ],
                                },
                            },
                            schema: { default_value: '_eq' },
                        },
                        {
                            field: 'right_value',
                            name: 'Comparison Value',
                            type: 'string',
                            meta: { interface: 'input', width: 'quarter', options: { placeholder: 'published' } },
                        },
                    ],
                },
            },
        },
    ],
};
