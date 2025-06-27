import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-string-toolkit',
	handler: (options, { logger }) => {
		const {
			operation, input_string, text_to_add,
			find_text, replace_with, match_case,
			substring_to_check,
			template_string, replacements
		} = options;

		const current_string = String(input_string || '');

		switch (operation) {
			case 'append':
				return current_string + String(text_to_add || '');
			case 'prepend':
				return String(text_to_add || '') + current_string;
			case 'trim':
				return current_string.trim();
			case 'ltrim':
				return current_string.trimStart();
			case 'rtrim':
				return current_string.trimEnd();
			case 'replace':
				const find = String(find_text || '');
				const replace = String(replace_with || '');
				const flags = match_case ? 'g' : 'gi';
				const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
				return current_string.replace(regex, replace);
			case 'starts_with':
				const starts_with_check = String(substring_to_check || '');
				if (match_case) return current_string.startsWith(starts_with_check);
				return current_string.toLowerCase().startsWith(starts_with_check.toLowerCase());
			case 'ends_with':
				const ends_with_check = String(substring_to_check || '');
				if (match_case) return current_string.endsWith(ends_with_check);
				return current_string.toLowerCase().endsWith(ends_with_check.toLowerCase());
			case 'contains':
				const contains_check = String(substring_to_check || '');
				if (match_case) return current_string.includes(contains_check);
				return current_string.toLowerCase().includes(contains_check.toLowerCase());
			case 'format_template':
				let formatted_string = String(template_string || '');
				if (Array.isArray(replacements)) {
					for (const rep of replacements) {
						if (rep && rep.key) {
							const placeholder = `{${rep.key}}`;
							const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
							formatted_string = formatted_string.replace(regex, rep.value || '');
						}
					}
				}
				return formatted_string;
			default:
				logger.warn(`Unknown string operation: "${operation}". Returning original string.`);
				return current_string;
		}
	},
});