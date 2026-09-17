// Intenta extraer una cantidad en kilogramos de una etiqueta de opción.
// Ejemplos: "2 kg" -> 2, "1.5 kg" -> 1.5, "Grande" -> null
export function parseKgFromLabel(label) {
  if (!label) return null
  const match = label.match(/([\d]+(?:[.,]\d+)?)\s*kg/i)
  if (!match) return null
  return parseFloat(match[1].replace(',', '.'))
}

// Devuelve, para un producto con opciones por peso, la lista de tramos
// (kg, precio de esa opción) ordenados de menor a mayor. Productos sin
// opciones por peso devuelven [].
export function getKgTiers(product) {
  if (product.pricing.type !== 'options') return []
  return product.pricing.options
    .map((opt) => ({ label: opt.label, price: opt.price, kg: parseKgFromLabel(opt.label) }))
    .filter((tier) => tier.kg != null)
    .sort((a, b) => a.kg - b.kg)
}

// Dado un conjunto de tramos por kg y una cantidad total acumulada en el
// carrito, elige el tramo (oferta) que corresponde. Regla: el tramo de
// mayor kg que sea <= a la cantidad pedida (si la cantidad es menor que el
// tramo más chico, se usa igual el tramo más chico como precio de referencia).
export function pickTierForQuantity(tiers, quantity) {
  if (!tiers || tiers.length === 0) return null
  let best = tiers[0]
  for (const tier of tiers) {
    if (tier.kg <= quantity) best = tier
    else break
  }
  return best
}

// Resuelve cómo debe guardarse un producto en el carrito: precio unitario,
// unidad de medida y cantidad base, según la opción elegida.
//
// Si la opción es por peso (por ejemplo "2 kg" a $20.000), el precio unitario
// pasa a expresarse por kilo ($10.000/kg) y la cantidad base es 2. Así, la
// cantidad que se ve en el carrito representa kilos reales: si el cliente
// suma 1 más, pasa a 3 kg (no se duplica el paquete de 2 kg a 4 kg).
export function resolveCartLine(product, selectedOption) {
  if (product.pricing.type === 'options') {
    const kg = parseKgFromLabel(selectedOption.label)

    if (kg) {
      return {
        optionLabel: selectedOption.label,
        unit: 'kg',
        unitPrice: selectedOption.price / kg,
        baseQuantity: kg,
      }
    }

    // Opción que no es por peso (por ejemplo "Grande" / "Chico"): se maneja
    // como antes, por unidades.
    return {
      optionLabel: selectedOption.label,
      unit: null,
      unitPrice: selectedOption.price,
      baseQuantity: 1,
    }
  }

  // Producto de precio fijo. Si ya viene con unidad "kg" (ej: $13.000/kg),
  // la cantidad también representa kilos de forma natural.
  return {
    optionLabel: null,
    unit: product.pricing.unit ?? null,
    unitPrice: product.pricing.price,
    baseQuantity: 1,
  }
}