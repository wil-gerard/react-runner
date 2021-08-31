import React, { useState } from 'react';
import Engine from './components/engine';
import Modal from './components/modal';

export default function App() {
    return (
        <div>
            <Engine />
            {/* <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                Fancy Modal
            </Modal> */}
        </div>
    )
}