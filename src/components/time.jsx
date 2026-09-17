import { getStoreStatus } from "../utils/businessHours.js";
import { useState, useEffect } from "react";
import { ArrowRightIcon } from "../utils/icons.jsx";
export default function Time() {
  const [status, setStatus] = useState(() => getStoreStatus());

  useEffect(() => {
    const interval = setInterval(() => setStatus(getStoreStatus()), 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={`container_time ${status.isOpen ? "is-open" : "is-closed"}`}>
        <p
            className={`header__status ${status.isOpen ? "is-open" : "is-closed"}`}
        >
            <span className="header__status-dot" aria-hidden="true" >
            {status.message} </span>
            <span className="header__status_hour">{"Hoy de "+status.todayHours}</span>
        </p>
        <ArrowRightIcon/>
    </div>
  );
}
