export default {
	id: 'operation-generate-and-store-jwt',
	name: 'Generate and Store User Token',
	icon: 'key',
	description: 'Creates a new JWT for a user, saves it to their record, and returns the new token.',

	overview: ({ user_id, permission }) => [
		{
			label: 'Target User ID',
			text: user_id || 'Not Set',
		},
		{
			label: 'Permissions',
			text: permission ? permission.charAt(0).toUpperCase() + permission.slice(1) : 'Trigger',
		},
	],

	options: [
		{
			field: 'permission',
			name: 'Permissions',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'From Trigger (Current User)', value: 'trigger' },
						{ text: 'Full Access (Admin)', value: 'full' },
					],
				},
			},
			schema: { default_value: 'trigger' },
		},
		{
			field: 'user_id',
			name: 'User ID',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: 'Enter user UUID or {{$accountability.user}}',
				},
			},
			notes: 'The ID of the user to generate the token for. Must match the current user unless using Full Access.'
		},
		{
			field: 'expires_in',
			name: 'Expires In',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: 'e.g., 5m, 1h, 7d',
				},
			},
			schema: {
				default_value: '1d' // FIX: Added default value
			},
			notes: 'Token lifespan (m=minutes, h=hours, d=days). If empty, uses the project default.'
		},
	],
};
