import { formatPrice } from './format.js'
import { WHATSAPP_PHONE } from '../config.js'

// Arma el mensaje de pedido y devuelve la URL de WhatsApp lista para abrir.
export function buildWhatsAppOrderUrl(cartItems, cartTotal) {
  const lines = cartItems.map((item) => {
    const lineTotal = formatPrice(item.unitPrice * item.quantity)

    // Productos por peso (kg): la cantidad ya representa kilos reales,
    // por ejemplo "3 kg × Milanesas de pollo".
    if (item.unit) {
      return `• ${item.quantity} ${item.unit} × ${item.name} — ${lineTotal}`
    }

    // Productos por unidad, con o sin opción (ej: talle, variante).
    const optionText = item.optionLabel ? ` — ${item.optionLabel}` : ''
    return `• ${item.quantity} × ${item.name}${optionText} — ${lineTotal}`
  })

  const message = [
    'Hola! Quiero hacer el siguiente pedido:',
    '',
    ...lines,
    '',
    `Total: ${formatPrice(cartTotal)}`,
  ].join('\n')

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}
