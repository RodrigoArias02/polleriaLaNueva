# Catálogo · Pollería

Sitio de catálogo hecho con React + Vite, sin backend. Pensado para que puedas
seguir editándolo vos: pocos archivos, CSS propio, sin librerías de UI.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí la URL que te muestre la terminal (por defecto `http://localhost:5173`).

Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## Qué editar según el caso

- **Productos, precios, categorías, disponibilidad** → `src/data/products.json`
- **Nombre del local y teléfono de WhatsApp** → `src/config.js`
- **Horarios de atención** → `src/utils/businessHours.js` (objeto `businessHours`)
- **Colores, tipografía, estilos** → `src/styles.css` (variables al inicio del archivo)
- **Categorías del menú de navegación** → `src/components/CategoryNav.jsx`
- **Imágenes de productos** → colocá los archivos en `public/images/` respetando
  el nombre de archivo indicado en cada producto del JSON (por ejemplo
  `/images/milanesas-pollo.webp` corresponde a `public/images/milanesas-pollo.webp`).
  Si una imagen falta, la tarjeta muestra un ícono de reemplazo en vez de romperse.

## Estructura

```
src/
├── components/
│   ├── Header.jsx        Logo, estado abierto/cerrado, botón del carrito
│   ├── CategoryNav.jsx    Navegación por categorías
│   ├── ProductCard.jsx    Tarjeta de producto con selector de opciones
│   └── Cart.jsx           Carrito lateral (drawer)
├── context/
│   └── CartContext.jsx    Estado global del carrito
├── data/
│   └── products.json      Catálogo de productos
├── utils/
│   ├── format.js          Formato de precios en pesos argentinos
│   ├── businessHours.js   Horarios y lógica de abierto/cerrado
│   └── whatsapp.js        Arma el mensaje y el link de WhatsApp
├── config.js              Nombre del local y teléfono de WhatsApp
├── App.jsx
├── main.jsx
└── styles.css
```

## Cómo funciona el carrito

Cada línea del carrito se identifica por producto + opción elegida (por
ejemplo "Milanesas de pollo · 1 kg" y "Milanesas de pollo · 2 kg" son líneas
distintas). Agregar el mismo producto con la misma opción suma cantidad en
vez de crear una línea nueva.

## Pedido por WhatsApp

Al tocar "Realizar pedido por WhatsApp" se arma un mensaje de texto con el
detalle del pedido y se abre `wa.me` con ese mensaje precargado. El carrito no
se vacía automáticamente después de enviar el pedido.
# polleriaLaNueva
