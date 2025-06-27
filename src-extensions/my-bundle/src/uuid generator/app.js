export default {
	id: 'generate-uuid',
	name: 'Generate UUID',
	icon: 'fingerprint',
	description: 'Generates a new v4 UUID and returns it as a string.',

	/**
	 * Since there are no options, the overview can be simple.
	 * It just confirms what the operation does.
	 */
	overview: () => [
		{
			label: 'Action',
			text: 'Generates a new v4 UUID',
		},
	],

	/**
	 * This operation does not require any user-configurable options,
	 * so the options array is empty.
	 */
	options: [],
};