import {
  ShopIcon,
  LeaftIcon,
  ShieldIcon,
  WhatsappIcon,
} from "../utils/icons.jsx";
export default function Footer() {
  return (
    <footer>
      <div className="div-footer">
        <ShopIcon />
        <p>
          <strong>Retira tus productos</strong>{" "}
          <span>Preparados en el momento</span>
        </p>
      </div>
      <div className="line"></div>
      <div className="div-footer">
        <ShieldIcon />
        <p>
          <strong>Productos frescos</strong> <span>Calidad garantizada</span>
        </p>
      </div>
      <span className="line"></span>
      <div className="div-footer">
        <WhatsappIcon />
        <p>
          <strong>Hace tu pedido</strong> <span>Por Whatsapp</span>
        </p>
      </div>
      <span className="line"></span>
      <div className="div-footer">
        <LeaftIcon />
        <p>
          <strong>Atencion personalizada</strong> <span>Siempre para vos</span>
        </p>
      </div>
    </footer>
  );
}
