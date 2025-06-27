import axios from 'axios';
import { toBoolean } from '@directus/utils';

export default {
  id: 'trigger-flow-webhook',
  handler: async (
    { flow_url, payload, operation_key },
    { services, database, getSchema, accountability, logger }
  ) => {
    try {
      // Build payload from parameters
      const requestBody = {};
      
      if (payload && payload.length > 0) {
        for (const param of payload) {
          try {
            requestBody[param.key] = convertValueType(
              param.value, 
              param.type
            );
          } catch (error) {
            logger.error(`Error processing parameter ${param.key}: ${error}`);
            throw new Error(`Invalid parameter value for ${param.key}`);
          }
        }
      }

      // Add Directus context similar to comment operation
      if (accountability) {
        requestBody.context = {
          user: accountability.user,
          role: accountability.role,
          ip: accountability.ip,
          userAgent: accountability.userAgent
        };
      }

      // Trigger flow webhook
      const response = await axios.post(flow_url, requestBody, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
        validateStatus: (status) => status < 500
      });

      // Handle and store response
      const result = {
        status: response.status,
        data: response.data || null
      };

      // Return with operation key as specified
      return {
        [operation_key]: result.data !== null ? result : null
      };
    } catch (error) {
      // Handle Axios errors
      if (error.response) {
        const { status, data } = error.response;
        throw new Error(`Flow trigger error ${status}: ${JSON.stringify(data)}`);
      }
      
      // Handle timeout and network errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Flow trigger timed out (10s)');
      }
      
      throw new Error(`Flow trigger failed: ${error.message}`);
    }
  }
};

// Value conversion with Directus utils
function convertValueType(value, type) {
  if (value === undefined || value === null) return null;
  
  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return toBoolean(value);
    case 'array':
      try {
        return Array.isArray(value) ? value : JSON.parse(value);
      } catch {
        return [value];
      }
    case 'object':
      try {
        return typeof value === 'object' ? value : JSON.parse(value);
      } catch {
        return { value };
      }
    case 'null':
      return null;
    case 'string':
    default:
      return String(value);
  }
}