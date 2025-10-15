// src/utils/billing.js
export function calcPartsSubtotal(parts = []) {
  return parts.reduce((sum, p) => sum + (Number(p.cost || 0) * Number(p.quantity || 1)), 0);
}

export function calcPartsMarkup(partsSubtotal, partsMarkup) {
  return (Number(partsSubtotal) || 0) * (Number(partsMarkup) || 0);
}

export function calcLaborSubtotal(labor = [], defaultRate) {
  return labor.reduce((sum, l) => {
    const hours = Number(l.hours || 0);
    const rate = Number(l.rate ?? defaultRate ?? 0);
    return sum + hours * rate;
  }, 0);
}

export function calcShopSupplies(subtotal, shopSuppliesRate) {
  return (Number(subtotal) || 0) * (Number(shopSuppliesRate) || 0);
}

export function calcTax(taxable, taxRate) {
  return (Number(taxable) || 0) * (Number(taxRate) || 0);
}

/**
 * Returns a detailed breakdown using Settings.
 */
export function computeTotals({ parts, labor }, settings) {
  const partsSubtotal = calcPartsSubtotal(parts);
  const partsMarkup = calcPartsMarkup(partsSubtotal, settings.partsMarkup);
  const partsTotal = partsSubtotal + partsMarkup;

  const laborSubtotal = calcLaborSubtotal(labor, settings.laborRate);
  const subtotal = partsTotal + laborSubtotal;

  const shopSupplies = calcShopSupplies(subtotal, settings.shopSuppliesRate);
  const taxable = subtotal + shopSupplies;
  const tax = calcTax(taxable, settings.taxRate);
  const total = taxable + tax;

  return {
    partsSubtotal,
    partsMarkup,
    partsTotal,
    laborSubtotal,
    subtotal,
    shopSupplies,
    tax,
    total
  };
}
