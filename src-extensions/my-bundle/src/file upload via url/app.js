// /extensions/operations/upload-from-url/app.js

export default {
    id: 'upload-from-url',
    name: 'Upload File from URL',
    icon: 'cloud_upload',
    description: 'Downloads a file from a public URL and uploads it into the Directus File Library.',

    overview: ({ file_url, permission }) => [
        {
            label: 'Permission Level',
            text: permission ? permission.charAt(0).toUpperCase() + permission.slice(1).replace('_', ' ') : 'Trigger',
        },
        {
            label: 'Source URL',
            text: file_url ? (file_url.length > 50 ? file_url.substring(0, 47) + '...' : file_url) : 'Not Set',
        },
    ],

    options: [
        // --- NEW PERMISSION DROPDOWN ---
        {
            field: 'permission',
            name: 'Permission Level',
            type: 'string',
            meta: {
                width: 'full',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'From Trigger (Current User)', value: 'trigger' },
                        { text: 'Public (Based on Public Role)', value: 'public' },
                        { text: 'Full Access (Admin)', value: 'full_access' },
                    ],
                },
            },
            schema: { default_value: 'trigger' },
            notes: 'Determines the permissions used to upload the file.'
        },
        {
            field: 'file_url',
            name: 'File URL',
            type: 'string',
            meta: {
                width: 'full',
                interface: 'input',
                options: {
                    placeholder: 'https://example.com/path/to/image.jpg',
                    iconRight: 'link'
                },
                required: true,
            },
        },
        {
			field: 'folderId',
			name: 'Folder ID (Optional)',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
                options: {
                    placeholder: 'Enter exact folder UUID...'
                }
			},
            notes: 'The ID of the folder to upload the file into.'
		},
        {
            field: 'title',
            name: 'Title (Optional)',
            type: 'string',
            meta: {
                width: 'half',
                interface: 'input'
            },
            notes: 'A title for the file. If empty, a title will be generated from the URL.'
        },
        {
			field: 'description',
			name: 'Description (Optional)',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},
    ],
};