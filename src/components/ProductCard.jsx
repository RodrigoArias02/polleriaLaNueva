import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import { CartOutLineIcon } from '../utils/icons.jsx'
export default function ProductCard({ product, onOpenModal }) {
  const { addToCart } = useCart()
  const hasOptions = product.pricing.type === 'options'
  const [selectedOption, setSelectedOption] = useState(
    hasOptions ? product.pricing.options[0] : null
  )
  const [imageError, setImageError] = useState(false)

  const displayPrice = hasOptions
    ? selectedOption.price
    : product.pricing.price
  const unitSuffix = !hasOptions && product.pricing.unit ? `/${product.pricing.unit}` : ''

  function handleAdd() {
    // Sin cantidad explícita: usa la cantidad base de la opción elegida
    // (por ejemplo, "2 kg" agrega 2, no 1). Ver src/utils/pricing.js
    addToCart(product, hasOptions ? selectedOption : null)
  }

  return (
    <article className="product-card" >
      {product.promotion && <span className="product-card__badge">Oferta</span>}

      <div
        className="product-card__image-wrap"
       onClick={() => onOpenModal(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') onOpenModal(product)
        }}
        aria-label={`Ver detalle de ${product.name}`}
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card__image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-card__image-fallback" aria-hidden="true">
            🐔
          </div>
        )}
      </div>

      <div className="product-card__body"  onClick={() => onOpenModal(product)}>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        {hasOptions && (
          <div className="product-card__options" role="group" aria-label="Presentación">
            {product.pricing.options.map((option) => (
              <button
                key={option.label}
                type="button"
                className={`product-card__option ${
                  selectedOption.label === option.label ? 'is-selected' : ''
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">
            {formatPrice(displayPrice)}
            {unitSuffix}
          </span>
          <button type="button" className="product-card__add-btn" onClick={handleAdd}>
            <CartOutLineIcon/>
            Agregar
          </button>
        </div>

      </div>
    </article>
  )
}
