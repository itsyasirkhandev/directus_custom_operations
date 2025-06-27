export default {
	id: 'operation-condition-gate',
	handler: ({ logic, condition_groups }) => {
		// The core evaluation function remains the same.
		const evaluate = (val1, op, val2) => {
			try {
				if (op === '_null') return val1 === null || val1 === undefined;
				if (op === '_nnull') return val1 !== null && val1 !== undefined;
				if (op === '_empty') return val1 === '';
				if (op === '_nempty') return val1 !== '';

				const str1 = String(val1);
				const str2 = String(val2);
				const num1 = !isNaN(parseFloat(str1)) && isFinite(str1) ? parseFloat(str1) : str1;
				const num2 = !isNaN(parseFloat(str2)) && isFinite(str2) ? parseFloat(str2) : str2;
				const date1 = new Date(str1);
				const date2 = new Date(str2);

				switch (op) {
					case '_eq': return num1 == num2;
					case '_neq': return num1 != num2;
					case '_gt': return num1 > num2;
					case '_gte': return num1 >= num2;
					case '_lt': return num1 < num2;
					case '_lte': return num1 <= num2;
					case '_contains': return str1.includes(str2);
					case '_icontains': return str1.toLowerCase().includes(str2.toLowerCase());
					case '_in': return str2.split(',').map(s => s.trim()).includes(str1);
					case '_nin': return !str2.split(',').map(s => s.trim()).includes(str1);
					case '_after': return date1 > date2 && date1.toString() !== 'Invalid Date' && date2.toString() !== 'Invalid Date';
					case '_before': return date1 < date2 && date1.toString() !== 'Invalid Date' && date2.toString() !== 'Invalid Date';
					case '_regex': return new RegExp(str2).test(str1);
					default: return false;
				}
			} catch (err) {
				console.warn('Condition evaluation failed:', err);
				return false;
			}
		};

		// If there are no groups, allow the flow to continue.
		if (!condition_groups || condition_groups.length === 0) {
			return;
		}

		let finalResult = logic === '_or' ? false : true;

		// Outer loop: Iterate through each Condition Group
		for (const group of condition_groups) {
			const { group_logic, conditions } = group;

			// If a group has no conditions, skip it.
			if (!conditions || conditions.length === 0) {
				continue;
			}

			let groupResult = group_logic === '_or' ? false : true;

			// Inner loop: Evaluate conditions within the current group
			for (const condition of conditions) {
				const isConditionMet = evaluate(condition.left_value, condition.operator, condition.right_value);

				if (group_logic === '_or') {
					if (isConditionMet) {
						groupResult = true;
						break; // For OR, we only need one to be true
					}
				} else { // AND logic
					if (!isConditionMet) {
						groupResult = false;
						break; // For AND, we only need one to be false
					}
				}
			}

			// Combine the result of this group with the final result
			if (logic === '_or') {
				if (groupResult) {
					finalResult = true;
					break; // For top-level OR, we only need one group to be true
				}
			} else { // Top-level AND logic
				if (!groupResult) {
					finalResult = false;
					break; // For top-level AND, we only need one group to be false
				}
			}
		}

		// The final check: if the combined result is false, throw an error to stop the flow.
		if (!finalResult) {
			throw new Error('Flow halted because conditions were not met.');
		}

		// If the code reaches here, it means the complex conditions were met and the flow continues.
		return;
	},
};