import React, { useState } from 'react';
import Engine from './components/Engine';
import Modal from './components/Modal';

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