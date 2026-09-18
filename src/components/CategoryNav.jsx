import { CATEGORIES } from "../data/categories.js";

export default function CategoryNav({ selected, onSelect }) {
  return (
    <nav className="category-nav" aria-label="Categorías de productos">
      <ul className="category-nav__list">
        {CATEGORIES.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={`category-nav__pill ${
                selected === category.id ? "is-active" : ""
              }`}
              onClick={() => onSelect(category.id)}
            >
              {category.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
