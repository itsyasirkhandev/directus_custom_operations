import { defineOperationApi } from '@directus/extensions-sdk';
import { createError } from '@directus/errors';
import jwt from 'jsonwebtoken'; // You must have 'jsonwebtoken' installed as a dependency

export default defineOperationApi({
	id: 'operation-generate-and-store-jwt',
	handler: async ({ user_id, expires_in, permission }, { services, getSchema, accountability, logger, env }) => {
		
		// --- Input Validation ---
		const jwtSecret = env.SECRET;
		if (!jwtSecret) {
			throw new Error('The "SECRET" key is not defined in your .env file.');
		}
		if (!user_id) {
			throw new Error('User ID is a required field.');
		}
		if (!accountability?.user && permission === 'trigger') {
			throw createError('FORBIDDEN', 'This operation must be triggered by an authenticated user when using "From Trigger" permissions.', 403);
		}

		// --- Security Check ---
		if (permission === 'trigger' && accountability.admin !== true && accountability.user !== user_id) {
			throw createError('FORBIDDEN', 'You do not have permission to generate a token for another user.', 403);
		}
		
		const serviceAccountability = { admin: true };
		const schema = await getSchema();
		const usersService = new services.ItemsService('directus_users', { accountability: serviceAccountability, schema });

		// --- Step 1: Verify the provided user_id exists ---
		logger.info(`Checking for existence of user: ${user_id}`);
		let userRole = null;
		try {
			const user = await usersService.readOne(user_id, { fields: ['id', 'role'] });
			userRole = user.role;
			logger.info(`User ${user_id} found.`);
		} catch (error) {
			logger.error(`User with ID "${user_id}" does not exist.`);
			throw createError('NOT_FOUND', `User with ID "${user_id}" does not exist.`, 404);
		}

		// --- Step 2: Construct the Token Payload ---
		const payload = { id: user_id, role: userRole };
		
		// --- Step 3: Sign the JWT ---
		const signOptions = { expiresIn: expires_in || '1d' };
		if (expires_in === null || expires_in === '') {
			delete signOptions.expiresIn; // Use project default if field is empty
		}

		let newToken;
		try {
			newToken = jwt.sign(payload, jwtSecret, signOptions);
			logger.info('Token generated successfully.');
		} catch (error) {
			logger.error(`Failed to sign JWT: ${error.message}`);
			throw error;
		}

		// --- Step 4: Update the user's token field ---
		const tokenField = 'token';
		logger.info(`Updating field "${tokenField}" for user ${user_id}...`);
		try {
			await usersService.updateOne(user_id, { [tokenField]: newToken });
			logger.info('User record updated successfully.');
		} catch (error) {
			logger.error(`Failed to update the token field for user ${user_id}: ${error.message}`);
			throw createError('ITEM_UPDATE_FAILED', `Could not update the token field.`, 500);
		}

		// --- Step 5: Return the newly generated token inside a JSON object ---
		return { token: newToken };
	},
});