export default {
    id: 'operation-condition-gate',
    handler: ({ logic, conditions }) => {
        // If there are no conditions, there's nothing to check. Allow flow to continue.
        if (!conditions || conditions.length === 0) {
            console.log('No conditions defined. Proceeding.');
            return;
        }

        // This is a helper function to perform the actual comparison
        const evaluate = (val1, op, val2) => {
            // Coerce string numbers to actual numbers for comparison
            const num1 = !isNaN(parseFloat(val1)) && isFinite(val1) ? parseFloat(val1) : val1;
            const num2 = !isNaN(parseFloat(val2)) && isFinite(val2) ? parseFloat(val2) : val2;

            switch (op) {
                case '_eq': return val1 == val2; // Use loose equality to handle '5' == 5
                case '_neq': return val1 != val2;
                case '_gt': return num1 > num2;
                case '_gte': return num1 >= num2;
                case '_lt': return num1 < num2;
                case '_lte': return num1 <= num2;
                case '_contains': return String(val1).includes(String(val2));
                case '_ncontains': return !String(val1).includes(String(val2));
                case '_icontains': return String(val1).toLowerCase().includes(String(val2).toLowerCase());
                case '_null': return val1 === null || val1 === undefined;
                case '_nnull': return val1 !== null && val1 !== undefined;
                case '_empty': return val1 === '';
                case '_nempty': return val1 !== '';
                default: return false;
            }
        };

        let finalResult = logic === '_or' ? false : true;

        for (const condition of conditions) {
            const { left_value, operator, right_value } = condition;
            const isConditionMet = evaluate(left_value, operator, right_value);

            if (logic === '_or') {
                if (isConditionMet) {
                    finalResult = true;
                    break; // For OR, we only need one to be true
                }
            } else { // AND logic
                if (!isConditionMet) {
                    finalResult = false;
                    break; // For AND, we only need one to be false
                }
            }
        }

        // The key part: if the final result is false, throw an error to stop the flow.
        // This is the standard way to halt execution in Directus Flows.
        if (!finalResult) {
            throw new Error('Flow halted because conditions were not met.');
        }

        // If the code reaches here, it means the conditions were met.
        // The operation completes successfully and the flow continues to the next step.
        console.log('Conditions met. Proceeding with the flow.');
        return;
    },
};