import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-find-replace',
	handler: ({ input_string, rules, stop_on_first_match }, { logger }) => {
		if (typeof input_string !== 'string') {
			return input_string;
		}
		if (!rules || rules.length === 0) {
			return input_string;
		}

		let current_string = input_string;

		for (const [index, rule] of rules.entries()) {
			try {
				if (rule && typeof rule.find === 'string' && rule.find.length > 0) {
					const original_string_before_replace = current_string;
					
					const escapedFind = rule.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					const flags = rule.match_case ? 'g' : 'gi';
					const regex = new RegExp(escapedFind, flags);
					const replacement = typeof rule.replace === 'string' ? rule.replace : '';

					current_string = current_string.replace(regex, replacement);

					if (stop_on_first_match && current_string !== original_string_before_replace) {
						logger.info(`Stopping after first match on rule #${index + 1}.`);
						break;
					}
				}
			} catch (error) {
				logger.warn(`Skipping invalid rule #${index + 1}. Error: ${error.message}`);
				continue;
			}
		}

		// FIX: Return the string directly as requested.
		return current_string;
	},
});