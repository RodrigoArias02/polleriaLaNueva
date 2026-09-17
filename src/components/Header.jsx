import { useCart } from "../context/CartContext.jsx";
import { useState, useEffect } from "react";
import { STORE_NAME } from "../config.js";
import { ChikenIcon, CartIcon } from "../utils/icons.jsx";
export default function Header({ onOpenCart }) {
  const { cartItemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Escuchamos el evento de scroll
    window.addEventListener("scroll", handleScroll);

    // Limpiamos el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header__inner">
        <div className="header__brand">
          <span className="header__logo">
            <ChikenIcon />
          </span>
          <div>
            <p className="header__name">
              <strong>{STORE_NAME}</strong> <span>polleria</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="header__cart-btn"
          onClick={onOpenCart}
          aria-label="Abrir carrito"
        >
          <span className="header__cart-icon" aria-hidden="true">
            <CartIcon />
          </span>
          <span className="header__cart-count">{cartItemCount}</span>
        </button>
      </div>
    </header>
  );
}
