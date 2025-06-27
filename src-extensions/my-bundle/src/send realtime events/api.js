import { defineOperationApi } from '@directus/extensions-sdk';
import { createError } from '@directus/errors';

export default defineOperationApi({
	id: 'operation-send-realtime-event',
	handler: async (options, { logger, services, accountability, getSchema }) => {
		const { recipients, subject, message, collection, item } = options;

		if (!recipients) throw new Error('You must specify at least one recipient.');
		if (!subject) throw new Error('A subject/event name is required for the notification.');

		const serviceAccountability = { admin: true };
		const recipientIds = recipients.split(',').map(id => id.trim()).filter(Boolean);

		if (recipientIds.length === 0) {
			logger.warn('No valid recipient IDs were provided.');
			return;
		}

		logger.info(`Sending real-time event "${subject}" to ${recipientIds.length} user(s)...`);

		try {
			const schema = await getSchema();
			// Use the ItemsService directly on the notifications collection
			const notificationItemsService = new services.ItemsService('directus_notifications', {
				accountability: serviceAccountability,
				schema,
			});

			const notificationsPayload = recipientIds.map(userId => ({
				recipient: userId,
				subject: subject,
				message: message || '',
                collection: collection || null,
                item: item || null,
			}));
			
			// This is the key: we use createMany with emitEvents set to false.
			// This creates the database records silently without triggering the email hook.
			// The WebSocket server will still pick up the new records and push them.
			const createdNotificationIds = await notificationItemsService.createMany(notificationsPayload, { emitEvents: false });

			logger.info('Successfully created notifications without emitting events.', { ids: createdNotificationIds });
			return { sent_to: recipientIds, notification_ids: createdNotificationIds };

		} catch (error) {
			logger.error(`Failed to send real-time event: ${error.message}`);
			throw createError('EVENT_FAILED', `Failed to send real-time event: ${error.message}`, 500);
		}
	},
});