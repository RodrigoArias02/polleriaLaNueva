import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import { CartOutLineIcon } from "../utils/icons.jsx";
export default function ProductCard({ product, onOpenModal }) {
  const { addToCart } = useCart();
  const hasOptions = product.pricing.type === "options";
  const [selectedOption, setSelectedOption] = useState(
    hasOptions ? product.pricing.options[0] : null,
  );
  const [imageError, setImageError] = useState(false);

  const displayPrice = hasOptions
    ? selectedOption.price
    : product.pricing.price;
  const unitSuffix =
    !hasOptions && product.pricing.unit ? `/${product.pricing.unit}` : "";

  function handleAdd() {
    // Sin cantidad explícita: usa la cantidad base de la opción elegida
    // (por ejemplo, "2 kg" agrega 2, no 1). Ver src/utils/pricing.js
    addToCart(product, hasOptions ? selectedOption : null);
  }

  return (
    <article className="product-card">
      {product.promotion && <span className="product-card__badge">Oferta</span>}

      <div
        className="product-card__image-wrap"
        onClick={() => onOpenModal(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onOpenModal(product);
        }}
        aria-label={`Ver detalle de ${product.name}`}
      >
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card__image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src="/images/not_found.jpg"
            alt={product.name}
            className="product-card__image product-card__image--fallback"
            loading="lazy"
          />
        )}
      </div>

      <div className="product-card__body" onClick={() => onOpenModal(product)}>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        {hasOptions && (
          <div
            className="product-card__options"
            role="group"
            aria-label="Presentación"
          >
            {product.pricing.options.map((option) => (
              <button
                key={option.label}
                type="button"
                className={`product-card__option ${
                  selectedOption.label === option.label ? "is-selected" : ""
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedOption(option);
                }}
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
          <button
            type="button"
            className="product-card__add-btn"
            onClick={(event) => {
              event.stopPropagation();
              handleAdd();
            }}
          >
            <CartOutLineIcon />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}