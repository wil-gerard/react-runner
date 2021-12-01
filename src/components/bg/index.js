import React from 'react';
import styles from './bg.module.scss';

export default function Bg() {

    return (
        <div className={styles.background}>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h1>react runner</h1>
                </header>
                <a href="https://wil-gerard.github.io/react-runner/">
                    <footer className={styles.about}>
                        <h2>about the game</h2>
                    </footer>
                </a>
            </div>
        </div>
    );
};
