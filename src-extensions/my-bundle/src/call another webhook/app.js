export default {
  id: 'trigger-flow-webhook',
  name: 'Trigger Flow via Webhook',
  icon: 'bolt',
  description: 'Trigger another flow using its webhook URL and pass custom data',
  overview: ({ flow_url, payload_count }) => [
    { label: 'Flow URL', text: flow_url },
    { label: 'Parameters', text: `${payload_count || 0} configured` }
  ],
  options: [
    {
      field: 'flow_url',
      name: 'Flow Webhook URL',
      type: 'string',
      meta: {
        width: 'full',
        interface: 'input',
        options: {
          placeholder: 'https://your-directus.com/flows/trigger/your-flow-id',
          iconRight: 'link'
        }
      }
    },
    {
      field: 'payload',
      name: 'Payload Data',
      type: 'json',
      meta: {
        width: 'full',
        interface: 'list',
        options: {
          fields: [
            {
              field: 'key',
              name: 'Key',
              type: 'string',
              meta: {
                width: 'half',
                interface: 'input',
                options: { placeholder: 'field_name' }
              }
            },
            {
              field: 'type',
              name: 'Type',
              type: 'string',
              meta: {
                width: 'half',
                interface: 'select-dropdown',
                options: {
                  choices: [
                    { text: 'String', value: 'string' },
                    { text: 'Number', value: 'number' },
                    { text: 'Boolean', value: 'boolean' },
                    { text: 'Array', value: 'array' },
                    { text: 'Object', value: 'object' },
                    { text: 'Null', value: 'null' }
                  ]
                }
              }
            },
            {
              field: 'value',
              name: 'Value',
              type: 'string',
              meta: {
                width: 'full',
                interface: 'input-multiline',
                options: { placeholder: 'Value or {{ $trigger.field }}' }
              }
            }
          ]
        }
      }
    },
    {
      field: 'operation_key',
      name: 'Result Storage Key',
      type: 'string',
      schema: { default_value: 'triggered_flow' },
      meta: {
        width: 'half',
        interface: 'input',
        options: {
          placeholder: 'response_key',
          iconRight: 'key'
        }
      }
    }
  ]
};