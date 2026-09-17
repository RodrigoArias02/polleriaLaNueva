// Formatea números como precios en pesos argentinos: 14000 -> "$14.000"
export function formatPrice(value) {
  return `$${Number(value).toLocaleString('es-AR')}`
}
