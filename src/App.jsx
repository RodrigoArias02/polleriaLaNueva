import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header.jsx";
import CategoryNav from "./components/CategoryNav.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ProductModal from "./components/ProductModal.jsx";
import Cart from "./components/Cart.jsx";
import Footer from "./components/footer.jsx";
import productsData from "./data/products.json";
import Time from "./components/time.jsx";
import StoreInfoModal from "./components/StoreInfoModal.jsx";
import { CATEGORIES } from "./data/categories.js";

const CATEGORY_ORDER = CATEGORIES.filter(
  (c) => c.id !== "todos" && c.id !== "ofertas",
).reduce((acc, c, index) => {
  acc[c.id] = index;
  return acc;
}, {});

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const filteredProducts = useMemo(() => {
    const all = productsData.products.filter((product) => product.available);

    let result;

    if (selectedCategory === "todos") {
      result = all;
    } else if (selectedCategory === "ofertas") {
      result = all.filter((p) => p.promotion);
    } else {
      result = all.filter((p) => p.category === selectedCategory);
    }

    return [...result].sort(
      (a, b) =>
        (CATEGORY_ORDER[a.category] ?? 999) -
        (CATEGORY_ORDER[b.category] ?? 999),
    );
  }, [selectedCategory]);

  return (
    <div className="page">
      <Header onOpenCart={() => setIsCartOpen(true)} />

      <main className="main">
        <section className="hero">
          <h1>
            Calidad y sabor
            <span>En cada pedido</span>
          </h1>

          <p className="subtitle">
            Elegí tus productos y armamos el pedido para retirar por WhatsApp.
          </p>

          <Time onOpen={() => setIsStoreInfoOpen(true)} />
        </section>

        <CategoryNav
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <section className="product-grid" aria-label="Catálogo de productos">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={setModalProduct}
            />
          ))}

          {filteredProducts.length === 0 && (
            <p className="product-grid__empty">
              No hay productos en esta categoría por ahora.
            </p>
          )}
        </section>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
        />
      )}
      {isStoreInfoOpen && (
        <StoreInfoModal
          isOpen={isStoreInfoOpen}
          onClose={() => setIsStoreInfoOpen(false)}
        />
      )}
      <Footer />

      {/* Toast global */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#1B1A1A",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#fff",
              secondary: "#1B1A1A",
            },
          },
        }}
      />
    </div>
  );
}
