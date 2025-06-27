export default {
	id: 'operation-json-parser',
	handler: ({ path, default_value }, { data }) => {

		/**
		 * Safely gets a nested value from an object using a string path.
		 */
		const getValueByPath = (obj, path, defaultValue = undefined) => {
			if (!path || typeof path !== 'string') {
				return defaultValue;
			}
			
			// Transform bracket notation to dot notation for consistent splitting
			const keys = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
			
			let result = obj;
			for (const key of keys) {
				if (result === null || typeof result !== 'object') {
					return defaultValue;
				}
				result = result[key];
			}
			
			return result === undefined ? defaultValue : result;
		};

		// The core logic change is here.
		// Instead of parsing a manual input, we apply the path
		// directly to the entire flow's `data` context.
		const extractedValue = getValueByPath(data, path, default_value);
		
		// The operation returns the extracted value directly.
		return extractedValue;
	},
};
