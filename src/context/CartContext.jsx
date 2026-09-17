import { createContext, useContext, useMemo, useState } from 'react'
import { resolveCartLine, getKgTiers, pickTierForQuantity, parseKgFromLabel } from '../utils/pricing.js'

const CartContext = createContext(null)

// Genera una clave única por producto + opción elegida. Para productos por
// peso usamos una clave fija "kg" (sin importar qué opción tocó el usuario),
// así "1 kg" y "2 kg" del mismo producto caen en la misma línea y se puede
// recalcular la oferta según el total acumulado.
function makeCartKey(productId, optionLabel) {
  return `${productId}::${optionLabel || 'unico'}`
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  // `quantity` es opcional: si no se pasa, se usa la cantidad base de la
  // opción elegida (por ejemplo, elegir "2 kg" agrega 2, no 1).
  function addToCart(product, option, quantity) {
    const { optionLabel, unit, unitPrice, baseQuantity } = resolveCartLine(
      product,
      option
    )
    const qty = quantity ?? baseQuantity
    const kgTiers = getKgTiers(product)
    const isKg = kgTiers.length > 0 && parseKgFromLabel(optionLabel) != null
    const key = isKg ? makeCartKey(product.id, 'kg') : makeCartKey(product.id, optionLabel)

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key)

      if (isKg) {
        const newQuantity = (existing?.quantity ?? 0) + qty
        const tier = pickTierForQuantity(kgTiers, newQuantity)
        const line = {
          key,
          productId: product.id,
          name: product.name,
          image: product.image,
          optionLabel: tier.label,
          unit: 'kg',
          unitPrice: tier.price / tier.kg,
          quantity: newQuantity,
          kgTiers, // guardado para poder recalcular en updateQuantity sin el `product`
        }
        return existing
          ? prev.map((item) => (item.key === key ? line : item))
          : [...prev, line]
      }

      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + qty } : item
        )
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          image: product.image,
          optionLabel,
          unit,
          unitPrice,
          quantity: qty,
        },
      ]
    })
  }

  function removeFromCart(key) {
    setCartItems((prev) => prev.filter((item) => item.key !== key))
  }

  // Si el usuario cambia la cantidad a mano en el carrito (+/- o input),
  // también recalcula la oferta cuando la línea es por kg.
  function updateQuantity(key, quantity) {
    if (quantity < 1) {
      removeFromCart(key)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.key !== key) return item
        if (item.kgTiers && item.kgTiers.length > 0) {
          const tier = pickTierForQuantity(item.kgTiers, quantity)
          return {
            ...item,
            quantity,
            optionLabel: tier.label,
            unitPrice: tier.price / tier.kg,
          }
        }
        return { ...item, quantity }
      })
    )
  }

  function clearCart() {
    setCartItems([])
  }

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cartItems]
  )

  const cartItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>')
  }
  return context
}