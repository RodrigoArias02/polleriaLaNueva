import { getStoreStatus } from "../utils/businessHours.js";
import { useState, useEffect } from "react";
import { ArrowRightIcon } from "../utils/icons.jsx";

export default function Time({ onOpen }) {
  const [status, setStatus] = useState(() => getStoreStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getStoreStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      type="button"
      className={`container_time ${
        status.isOpen ? "is-open" : "is-closed"
      }`}
      onClick={onOpen}
      aria-label="Ver horarios y ubicación"
    >
      <p
        className={`header__status ${
          status.isOpen ? "is-open" : "is-closed"
        }`}
      >
        <span className="header__status-dot" aria-hidden="true">
          {status.message}
        </span>

        <span className="header__status_hour">
          {"Hoy de " + status.todayHours}
        </span>
      </p>

      <ArrowRightIcon />
    </button>
  );
}