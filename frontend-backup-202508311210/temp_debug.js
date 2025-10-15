// Debugging - add this before your useMemo
console.log('=== DEBUGGING state.customers ===');
console.log('Type:', typeof state.customers);
console.log('Value:', state.customers);
console.log('Is Array:', Array.isArray(state.customers));
console.log('Is null:', state.customers === null);
console.log('Is undefined:', state.customers === undefined);
console.log('Constructor:', state.customers?.constructor?.name);
console.log('Keys (if object):', typeof state.customers === 'object' ? Object.keys(state.customers || {}) : 'N/A');
console.log('================================');
