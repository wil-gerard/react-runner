import React, { useState, useEffect } from 'react';
import styles from './engine.module.scss';
import { useEvent } from "../../hooks";

function CreateEngine(setState) {
    this.settings = {
        tile: 100, //width of one tile
    };

    // current stage position
    this.stage = 0;

    // function that will continously run
    this.repaint = () => {
        // move stage by one tile
        this.stage += this.setting.tile;

        // set state for use in the component
        setState({ stage: this.stage });

        // start repaint on next frame
        return requestAnimationFrame(this.repaint);
    };

    // trigger intial paint
    this.repaint();
    return () => ({
    });
}

export default function Engine() {
    // game state
    const [gameState, setGameState] = useState({ stage: 0 });

    // trigger game to start
    const [start, setStart] = useState(false);

    // if game is running
    const [started, setStarted] =  useState(false);

    // instance of game engine
    const [engine, setEngine] = useState(null);

    const handleKeyPress = (e) => {
        // the ' ' char represents space bar key
        if (e.key === ' ') {
            // starts game on first spacebar press
            if (!started && !start) {
                setStart(true);
            }

            // if the game has not been initiliazed return
            if (engine === null) return;

            // otherwise JUMP
            // engine.jump();
        }
    };

    useEvent('keyup', handleKeyPress);

    useEffect(() => {
        if (start) {
            setStarted(true);
            setStart(false);
            // create new engine and save it to the state
            setEngine(
                new CreateEngine(
                    // set state
                    state => setGameState(state),
                ),
            );
        }
    });

    return (
        <div
            className={styles.container}
        >
                <div 
                    className={styles.stage}
                    style={{
                        transform: `translate(${gameState.stage}px, 0px)`, // moves the stage
                    }}
                >
                    <span
                        className={styles.character}
                        style={{
                            transform: `translate(${gameState.stage}px, 0px)` // moves char in opposite direction
                        }}
                    />
                </div>
        </div>
    );
}