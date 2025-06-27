import { defineOperationApi } from '@directus/extensions-sdk';
import { Buffer } from 'node:buffer';

export default defineOperationApi({
	id: 'operation-data-converter',
	handler: (options, { logger }) => {
		const {
			operation, input_value,
			from_base, to_base,
			keys_array, values_array
		} = options;

		// The input from the UI is always a string, so we need to handle it carefully.
		const input = input_value;

		try {
			switch (operation) {
				// --- Encoding/Decoding ---
				case 'base64_encode':
					return Buffer.from(String(input)).toString('base64');
				case 'base64_decode':
					return Buffer.from(String(input), 'base64').toString('utf8');
				case 'base64_encode_urlsafe':
					return Buffer.from(String(input)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
				case 'base64_decode_urlsafe':
					let urlSafeInput = String(input).replace(/-/g, '+').replace(/_/g, '/');
					while (urlSafeInput.length % 4) { urlSafeInput += '='; }
					return Buffer.from(urlSafeInput, 'base64').toString('utf8');
				case 'url_encode':
					return encodeURIComponent(String(input));
				case 'url_decode':
					return decodeURIComponent(String(input));
				case 'json_encode':
					return JSON.stringify(input);
				case 'json_decode':
					return JSON.parse(String(input));

				// --- Type Casting ---
				case 'to_text':
					return String(input);
				case 'to_int':
					const int = parseInt(input, 10);
					if (isNaN(int)) throw new Error(`Input "${input}" cannot be converted to an Integer.`);
					return int;
				case 'to_dec':
					const dec = parseFloat(input);
					if (isNaN(dec)) throw new Error(`Input "${input}" cannot be converted to a Decimal.`);
					return dec;
				case 'to_bool':
					const lowerInput = String(input).toLowerCase();
					return lowerInput === 'true' || lowerInput === '1';

				// --- Base Conversion ---
				case 'base_convert':
					if (!from_base || !to_base) throw new Error('From Base and To Base are required.');
					const num = parseInt(String(input), from_base);
					if (isNaN(num)) throw new Error(`Input "${input}" is not a valid number in base ${from_base}.`);
					return num.toString(to_base);
				
				// --- Object Creation ---
				case 'create_object':
					if (!Array.isArray(keys_array) || !Array.isArray(values_array)) throw new Error('Keys and Values must be valid arrays.');
					if (keys_array.length !== values_array.length) throw new Error('Keys and Values arrays must have the same length.');
					const obj = {};
					for (let i = 0; i < keys_array.length; i++) {
						obj[keys_array[i]] = values_array[i];
					}
					return obj;

				default:
					logger.warn(`Unknown conversion operation: "${operation}".`);
					throw new Error(`Unknown conversion operation: "${operation}".`);
			}
		} catch (error) {
			logger.error(`Conversion failed for operation "${operation}": ${error.message}`);
			throw new Error(`Conversion failed: ${error.message}`);
		}
	},
});