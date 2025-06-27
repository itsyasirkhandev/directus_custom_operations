import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-has-record',
	handler: async ({ collection, logic, filter_rules }, { services, logger, getSchema }) => {
		const { ItemsService } = services;

		if (!collection) {
			throw new Error('You must select a collection to check.');
		}

		// Helper function to build a valid Directus filter from our UI rules
		const buildFilter = (rules, gate) => {
			if (!rules || rules.length === 0) {
				return {};
			}
			const conditions = rules.map(rule => {
                if (!rule.field || !rule.operator) return null;
                if (['_null', '_nnull'].includes(rule.operator)) {
                    return { [rule.field]: { [rule.operator]: true } };
                }
                if (['_in', '_nin'].includes(rule.operator)) {
                    return { [rule.field]: { [rule.operator]: rule.value.split(',').map(s => s.trim()) } };
                }
				return { [rule.field]: { [rule.operator]: rule.value } };
			}).filter(Boolean);
            if (conditions.length === 0) return {};
            if (conditions.length === 1) return conditions[0];
			return { [gate]: conditions };
		};
		
		const schema = await getSchema();
		const itemsService = new ItemsService(collection, { schema: schema });
		const filter = buildFilter(filter_rules, logic);
		logger.info(`Checking for record in "${collection}" with filter: ${JSON.stringify(filter)}`);

		try {
			const records = await itemsService.readByQuery({
				filter: filter,
				limit: 1,
				fields: ['id'],
			});

			// If no record is found, throw an error to halt the flow
			if (records.length === 0) {
				logger.warn(`No record found in "${collection}" matching the filter. Halting flow.`);
				throw new Error('Flow halted: Record does not exist.');
			}

			// If a record is found, continue the flow
			logger.info(`Record found in "${collection}". Continuing flow.`);
			return;

		} catch (error) {
			// If it's the specific error we threw, re-throw it to stop the flow correctly.
			if (error.message.includes('Flow halted: Record does not exist.')) {
				throw error;
			}
			// For any other unexpected errors, log them and throw a generic failure.
			logger.error(`Error while querying collection "${collection}": ${error.message}`, error);
			throw new Error(`Failed to check for record: ${error.message}`);
		}
	},
});