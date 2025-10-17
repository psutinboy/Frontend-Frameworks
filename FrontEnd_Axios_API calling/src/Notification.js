import React, { useEffect } from "react";
import styles from "./Notification.module.css";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.closeBtn}>
        ×
      </button>
    </div>
  );
};

export default Notification;
