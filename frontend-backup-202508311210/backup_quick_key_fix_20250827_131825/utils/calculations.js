// Calculation utilities for work orders, estimates, etc.

export const computeTotals = (items = []) => {
  const totals = {
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    laborCost: 0,
    partsCost: 0,
    taxRate: 0.08 // Default 8% tax rate
  };
  
  if (!Array.isArray(items) || items.length === 0) {
    return totals;
  }
  
  // Calculate parts and labor costs
  items.forEach(item => {
    const cost = parseFloat(item.cost || 0);
    const quantity = parseInt(item.quantity || 1);
    const itemTotal = cost * quantity;
    
    if (item.type === 'labor') {
      totals.laborCost += itemTotal;
    } else if (item.type === 'part') {
      totals.partsCost += itemTotal;
    }
    
    totals.subtotal += itemTotal;
  });
  
  // Apply discount if provided
  const discountAmount = parseFloat(items[0]?.discount || 0);
  if (discountAmount > 0) {
    if (discountAmount < 1) {
      // Percentage discount
      totals.discount = totals.subtotal * discountAmount;
    } else {
      // Fixed amount discount
      totals.discount = discountAmount;
    }
  }
  
  // Calculate tax on discounted subtotal
  const taxableAmount = totals.subtotal - totals.discount;
  totals.tax = taxableAmount * totals.taxRate;
  
  // Calculate final total
  totals.total = taxableAmount + totals.tax;
  
  return totals;
};

export const calculateLaborCost = (hours, rate = 120) => {
  return parseFloat(hours || 0) * parseFloat(rate || 0);
};

export const calculatePartMarkup = (cost, markupPercentage = 0.30) => {
  const baseCost = parseFloat(cost || 0);
  return baseCost * (1 + parseFloat(markupPercentage || 0));
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(parseFloat(amount || 0));
};

export const calculateEstimateAccuracy = (estimate, actual) => {
  const est = parseFloat(estimate || 0);
  const act = parseFloat(actual || 0);
  
  if (est === 0) return 0;
  
  const difference = Math.abs(est - act);
  const accuracy = ((est - difference) / est) * 100;
  
  return Math.max(0, accuracy);
};
