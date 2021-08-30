import React from 'react';
import styles from './modal.module.scss';


export default function Modal({ open, children, onClose }) {
    if (!open) return null

    return (
        <>
            <div className={styles.overlay} />
            <div className={styles.modal}>
                <button onClick={onClose}>Close Modal</button>
                { children }
            </div>
        </>
    );
};
