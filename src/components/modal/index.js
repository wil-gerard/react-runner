import { StepLabel } from '@material-ui/core';
import { style } from '@material-ui/system';
import React from 'react';
import  styles  from './modal.module.scss';

// const MODAL_STYLES = {
//     position: 'fixed',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: '#FFF',
//     padding: '50px',
//     zIndex: 1000
// }

// const OVERLAY_STYLES = {
//     position: 'relative',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     zIndex: 1000
// }

export default function Modal({ open, children }) {
    if (!open) return null

    return (
        <>
            <div className={styles.overlay} />
            <div className={styles.modal}>
                { children }
            </div>
        </>
    );
};
