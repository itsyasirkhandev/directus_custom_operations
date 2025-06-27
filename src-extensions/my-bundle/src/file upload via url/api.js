// /extensions/operations/upload-from-url/api.js

import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
    id: 'upload-from-url',
    handler: async (options, { services, getSchema, logger, accountability }) => {
        const { FilesService } = services;
        const { permission, file_url, folderId, title, description } = options;

        if (!file_url) {
            throw new Error('File URL is a required field.');
        }

        // --- NEW PERMISSION LOGIC ---
        let serviceAccountability;
        switch (permission) {
            case 'public':
                logger.info('Using Public permissions for upload.');
                // Passing null tells the service to use public role permissions
                serviceAccountability = null;
                break;
            case 'full_access':
                logger.info('Using Full Access (Admin) permissions for upload.');
                serviceAccountability = { admin: true };
                break;
            default: // 'trigger'
                logger.info('Using permissions from the flow trigger.');
                serviceAccountability = accountability;
                break;
        }

        logger.info(`Importing file from URL: ${file_url}`);

        try {
            const filesService = new FilesService({
                accountability: serviceAccountability, // Use the determined accountability
                schema: await getSchema(),
            });

            const fileData = {
                folder: folderId || null,
                title: title || null,
                description: description || null,
            };

            const fileId = await filesService.importOne(file_url, fileData);

            logger.info(`File successfully imported with ID: ${fileId}`);

            return await filesService.readOne(fileId);

        } catch (error) {
            logger.error(`Failed to import file from URL: ${error.message}`);
            throw new Error(`Failed to import file from URL. Reason: ${error.message}`);
        }
    },
});