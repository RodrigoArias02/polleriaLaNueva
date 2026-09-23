import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import { parseKgFromLabel } from "../utils/pricing.js";
import { PlusIcon, MinusIcon } from "../utils/icons.jsx";
import { useLockBodyScroll } from "../hooks/scroll.js";
import toast from "react-hot-toast";
export default function ProductModal({ product, onClose }) {
  useLockBodyScroll(true);
  const { addToCart } = useCart();
  const hasOptions = product.pricing.type === "options";

  const [selectedOption, setSelectedOption] = useState(
    hasOptions ? product.pricing.options[0] : null,
  );
  const [imageError, setImageError] = useState(false);

  // ¿Esta selección se vende por peso? (opción tipo "2 kg", o precio fijo con unit: "kg")
  const baseKg = hasOptions
    ? parseKgFromLabel(selectedOption.label)
    : product.pricing.unit === "kg"
      ? 1
      : null;
  const isWeightBased = baseKg != null;

  // Precio por unidad: si es por peso, se expresa por kilo.
  const unitPrice = hasOptions
    ? isWeightBased
      ? selectedOption.price / baseKg
      : selectedOption.price
    : product.pricing.price;

  const defaultQuantity = isWeightBased ? baseKg : 1;
  const [quantity, setQuantity] = useState(defaultQuantity);

  // Si el cliente cambia de opción (ej: de "1 kg" a "2 kg"), reiniciamos
  // la cantidad a la base de esa nueva opción.
  useEffect(() => {
    setQuantity(isWeightBased ? baseKg : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function changeQuantity(next) {
    const safeValue = Number.isFinite(next) ? next : 1;
    setQuantity(Math.max(1, safeValue));
  }

  function handleAdd() {
    addToCart(product, hasOptions ? selectedOption : null, quantity);

    toast.success(`${product.name} agregado al carrito`);

    onClose();
  }

  const total = unitPrice * quantity;

  // ✅ CORRECTO: Usar useEffect dependiente de product o quantity
  useEffect(() => {
    if (product?.pricing?.options) {
      const detecteOption = product.pricing.options.find((opt) => {
        const optionNumber = parseInt(opt.label.match(/\d+/)?.[0], 10);
        return optionNumber === quantity;
      });

      if (detecteOption) {
        setSelectedOption(detecteOption);
      }
    }
  }, [product, quantity]); // Solo se ejecuta si cambia el producto o la cantidad

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-card__close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="modal-card__image-wrap">
          {product.promotion && (
            <span className="modal-card__badge">Oferta</span>
          )}
          {!imageError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="modal-card__image"
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src="/images/not_found.jpg"
              alt={product.name}
              className="modal-card__image modal-card__image--fallback"
              loading="lazy"
            />
          )}
        </div>

        <div className="modal-card__body">
          <h2 className="modal-card__name">{product.name}</h2>
          <p className="modal-card__description">{product.description}</p>

          {hasOptions && (
            <div
              className="modal-card__options"
              role="group"
              aria-label="Presentación"
            >
              {product.pricing.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={`modal-card__option ${
                    selectedOption.label === option.label ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div className="modal-card__quantity-row">
            <span className="modal-card__quantity-label">
              Cantidad{isWeightBased ? " (kg)" : ""}
            </span>
            <div className="modal-card__stepper">
              <button
                type="button"
                onClick={() => changeQuantity(quantity - 1)}
                aria-label="Restar cantidad"
              >
                <MinusIcon />
              </button>
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={quantity}
                onChange={(event) => changeQuantity(Number(event.target.value))}
              />
              <button
                type="button"
                onClick={() => changeQuantity(quantity + 1)}
                aria-label="Sumar cantidad"
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          {isWeightBased && (
            <p className="modal-card__hint">
              Tarifa de referencia: {formatPrice(unitPrice)}/kg según la
              presentación "
              {selectedOption ? selectedOption.label : `${baseKg} kg`}".
            </p>
          )}

          <div className="modal-card__footer">
            <span className="modal-card__total">{formatPrice(total)}</span>
            <button
              type="button"
              className="modal-card__add-btn"
              onClick={handleAdd}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
