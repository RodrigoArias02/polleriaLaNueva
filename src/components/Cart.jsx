import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'
import { buildWhatsAppOrderUrl } from '../utils/whatsapp.js'

export default function Cart({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()
  const hasItems = cartItems.length > 0
  
  function handleWhatsAppOrder() {
    const url = buildWhatsAppOrderUrl(cartItems, cartTotal)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-label="Carrito de compras"
        aria-hidden={!isOpen}
      >
        <div className="cart-drawer__header">
          <h2>Tu pedido</h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer__content">
          {!hasItems && (
            <p className="cart-drawer__empty">Todavía no agregaste productos.</p>
          )}

          {hasItems && (
            <ul className="cart-drawer__list">
              {cartItems.map((item) => (
                <li key={item.key} className="cart-item">
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    {item.optionLabel && (
                      <p className="cart-item__option">
                        {item.unit === 'kg'
                          ? `Tarifa de referencia: ${item.optionLabel}`
                          : item.optionLabel}
                      </p>
                    )}
                    <p className="cart-item__unit-price">
                      {formatPrice(item.unitPrice)}
                      {item.unit ? `/${item.unit}` : ''} c/u
                    </p>
                  </div>

                  <div className="cart-item__controls">
                    <div className="cart-item__stepper">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        aria-label="Restar cantidad"
                      >
                        −
                      </button>
                      <span>
                        {item.quantity}
                        {item.unit ? ` ${item.unit}` : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        aria-label="Sumar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item__subtotal">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.key)}
                      aria-label={`Quitar ${item.name} del carrito`}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-drawer__footer">
          <div className="cart-drawer__total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <button
            type="button"
            className="cart-drawer__whatsapp-btn"
            onClick={handleWhatsAppOrder}
            disabled={!hasItems}
          >
            Realizar pedido por WhatsApp
          </button>
        </div>
      </aside>
    </>
  )
}
