import { defineOperationApi } from '@directus/extensions-sdk';

export default defineOperationApi({
	id: 'object-builder',
	handler: ({ properties }, { data, logger }) => { // Added 'data' to the context
		const finalObject = {};

		if (!Array.isArray(properties)) {
			logger.warn('Object Builder: No properties array provided.');
			return {};
		}
		
		const getValueByPath = (obj, path, defaultValue = undefined) => {
			if (!path || typeof path !== 'string') return defaultValue;
			const keys = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
			let result = obj;
			for (const key of keys) {
				if (result === null || typeof result !== 'object') return defaultValue;
				result = result[key];
			}
			return result === undefined ? defaultValue : result;
		};

		for (const prop of properties) {
			if (!prop || !prop.key) {
				logger.warn('Skipping a property with no key defined.');
				continue;
			}
			
			const key = prop.key;
			let value;

			if (prop.source === 'flow_data') {
				value = getValueByPath(data, prop.flow_data_path);
			} else { // 'static' source
				switch (prop.value_type) {
					case 'string':
						value = prop.string_value;
						break;
					case 'number':
						value = (prop.number_value === null || prop.number_value === undefined) ? null : Number(prop.number_value);
						break;
					case 'boolean':
						value = prop.boolean_value;
						break;
					case 'json':
						value = prop.json_value;
						break;
					case 'null':
						value = null;
						break;
					default:
						logger.warn(`Unknown value type "${prop.value_type}" for key "${key}". Defaulting to null.`);
						value = null;
				}
			}

			// This logic handles nested keys like "user.address.city"
			const keys = key.split('.');
			let current = finalObject;
			while (keys.length > 1) {
				const currentKey = keys.shift();
				if (!current[currentKey] || typeof current[currentKey] !== 'object') {
					current[currentKey] = {};
				}
				current = current[currentKey];
			}
			current[keys[0]] = value;
		}

		return finalObject;
	},
});