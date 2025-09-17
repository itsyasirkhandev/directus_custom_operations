import { defineOperationApi } from '@directus/extensions-sdk';
import { createError } from '@directus/errors';

export default defineOperationApi({
	id: 'operation-send-realtime-event',
	handler: async (options, { logger, services, getSchema }) => {
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
			
			// This now emits an event, just like a native notification.
			// The { emitEvents: false } option has been removed.
			const createdNotificationIds = await notificationItemsService.createMany(notificationsPayload);

			logger.info('Successfully created notifications.', { ids: createdNotificationIds });
			return { sent_to: recipientIds, notification_ids: createdNotificationIds };

		} catch (error) {
			logger.error(`Failed to send real-time event: ${error.message}`);
			throw createError('EVENT_FAILED', `Failed to send real-time event: ${error.message}`, 500);
		}
	},
});