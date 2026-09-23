import { businessHours } from "../utils/businessHours.js";
import { LocationIcon, ClockIcon } from "../utils/icons.jsx";
import { useLockBodyScroll } from "../hooks/scroll.js";
const DAYS = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

export default function StoreInfoModal({ onClose, isOpen }) {
      useLockBodyScroll(isOpen)
  return (
    <div className="store-modal-overlay" onClick={onClose}>
      <div
        className="store-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="store-modal__header">
          <div className="store-modal__header-content">
            <ClockIcon />
            <span>
              <h2 id="store-modal-title"> Información del local</h2>

              <p> Ubicación y horarios de atención</p>
            </span>
          </div>

          <button
            type="button"
            className="store-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <div className="store-modal__content">
          <section className="store-modal__section_map">
            <LocationIcon />
            <span>
              <h3 className="store-modal__section-title">Ubicación</h3>
              <p className="store-modal__location-address">Av. 74 N° 3616, Necochea, Buenos Aires</p>
            </span>
          </section>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3120.1252111709123!2d-58.75665995891817!3d-38.553928871916774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x958fbd71fbf3222f%3A0x3db6940bd39d70e4!2sAv.%2074%203616%2C%20B7630FHW%20Necochea%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1790179347769!5m2!1ses-419!2sar"
            width="100%"
            height="120"
            loading="lazy"
          ></iframe>
          <section className="store-modal__section">
            <h3 className="store-modal__section-title">
              <ClockIcon /> Horarios
            </h3>

            <div className="store-modal__hours">
              {DAYS.map((day) => {
                const ranges = businessHours[day.key];

                return (
                  <div key={day.key} className={`store-modal__day`}>
                    <span className="store-modal__day-name">{day.label}</span>

                    <span className="store-modal__day-hours">
                      {!ranges
                        ? "Cerrado"
                        : ranges
                            .map((range) => `${range.open} - ${range.close}`)
                            .join(" · ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
