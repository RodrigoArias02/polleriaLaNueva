import { useMemo, useState } from 'react'
import Header from './components/Header'
import CategoryNav from './components/CategoryNav'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import Cart from './components/Cart'
import Footer from './components/footer.jsx'
import productsData from './data/products.json'
import Time from './components/time.jsx'
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [modalProduct, setModalProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    const all = productsData.products.filter((product) => product.available)
    if (selectedCategory === 'todos') return all
    if (selectedCategory === 'ofertas') return all.filter((p) => p.promotion)
    return all.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="page">
      <Header onOpenCart={() => setIsCartOpen(true)} />

      <main className="main">
        <section className="hero">
          <h1>Calidad y sabor<span>En cada pedido</span></h1>
          <p className='subtitle'>Elegí tus productos y armamos el pedido para retirar por WhatsApp.</p>
        <Time/>
        </section>

        <CategoryNav selected={selectedCategory} onSelect={setSelectedCategory} />

        <section className="product-grid" aria-label="Catálogo de productos">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={setModalProduct}
            />
          ))}

          {filteredProducts.length === 0 && (
            <p className="product-grid__empty">No hay productos en esta categoría por ahora.</p>
          )}
        </section>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
      <Footer/>
    </div>
  )
}
