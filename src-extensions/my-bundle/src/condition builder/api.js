import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'operation-filter-builder',
	handler: ({ top_level_logic, condition_groups, output_format }) => {
		if (!condition_groups || condition_groups.length === 0) {
			return output_format === 'filter' ? { filter: {} } : {};
		}

		const processRule = (rule) => {
			if (!rule.field || !rule.operator) return null;
			if (['_null', '_nnull', '_empty', '_nempty'].includes(rule.operator)) {
				return { [rule.field]: { [rule.operator]: true } };
			}
			if (['_in', '_nin'].includes(rule.operator)) {
				const list = rule.value ? rule.value.split(',').map(s => s.trim()) : [];
				return { [rule.field]: { [rule.operator]: list } };
			}
			return { [rule.field]: { [rule.operator]: rule.value } };
		};

		const processed_groups = condition_groups
			.map(group => {
				if (!group.rules || group.rules.length === 0) return null;
				const processed_rules = group.rules.map(processRule).filter(Boolean);
				if (processed_rules.length === 0) return null;
				if (processed_rules.length === 1) return processed_rules[0];
				return { [group.group_logic]: processed_rules };
			})
			.filter(Boolean);

		let finalFilterObject;
		if (processed_groups.length === 0) finalFilterObject = {};
		else if (processed_groups.length === 1) finalFilterObject = processed_groups[0];
		else finalFilterObject = { [top_level_logic]: processed_groups };

		// Conditionally wrap the output based on the user's selection
		if (output_format === 'filter') {
			return { filter: finalFilterObject };
		}
		
		return finalFilterObject;
	},
});