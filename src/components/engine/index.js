import React, { useState, useEffect } from 'react';
import styles from './engine.module.scss';
import { useEvent } from "../../hooks";

const BLOCKS = [
    140,
    250,
    390,
];

const charWidth = 100;
const charHeight =100;

const blockWidth = 80;
const blockHeight = 200;

// this is in comparison to the rest of the game
// 2 is twice the speed
// 1 is the same speed

const JUMP_VELOCITY = 1.4;

class CreateEngine {
    constructor(setState) {
        this.settings = {
            tile: 10, //width of one tile
        };

        // current stage position
        this.stage = 0;
        this.jump = false;
        this.direction = 'up';
        this.position = 0;
        this.max = this.settings.tile * 40;
        this.blocks = BLOCKS.map(b => (b * this.settings.tile));

        const checkBlocks = () => {
            const charXPos = this.stage + 200;
            const charYPos = this.position;

            // has the character passed all the blocks?
            if (charXPos > this.blocks[this.blocks.length - 1] + 200 && this.position <= 0) {
                this.game = 'win';
            }

            this.blocks.forEach((block) => {
                //if character hits a block
                if (charXPos + charWidth >= block
                    && charYPos <= blockHeight
                    && charYPos + charHeight >= 0
                    && charXPos <= block + blockWidth) {
                    this.game = 'fail';
                }
            });
        };

        const doJump = () => {
            // if not jumping, reset position
            if (!this.jump) {
                this.position = 0;
                this.direction = 'up';
                return;
            }

            // when jumping finishes, reset and return
            if (this.direction === 'down' && this.position <= 0) {
                this.jump = false;
                this.position = 0;
                this.direction = 'up';
                return;
            }

            // if the jump is at its max, start falling
            if (this.position >= this.max)
                this.direction = 'down';

            // depending on the direction increment the jump
            if (this.position === 'up') {
                this.position += (this.settings.tile * JUMP_VELOCITY);
            } else {
                this.position -= (this.settings.tile * JUMP_VELOCITY);
            }
        };

        // function that will continously run
        this.repaint = () => {
            // move stage by one tile
            this.stage += this.settings.tile;

            // check if character has hit a block
            checkBlocks();

            // check and perform jump
            doJump();

            // set state for use in the component
            setState({
                stage: this.stage,
                jump: this.position,
                blocks: this.blocks,
                status: this.game,
            });

            // stop the game if the game var has been set to false
            if (this.game !== 'start') {
                //reset and stop
                this.game = 'start';
                this.stage = 0;
                this.jump = false;
                this.direction = 'up';
                this.position = 0;
                return null;
            }

            // start repaint on next frame
            return requestAnimationFrame(this.repaint);
        };

        // trigger intial paint
        this.repaint();
        return () => ({
            jump: () => {
                // if jump is not active, then trigger jump
                if (!this.jump) {
                    this.jump = true;
                }
            },
        });
    }
}

const initialState = {
    stage: 0,
    jump: 0,
    blocks: [],
    status: 'start',
};

export default function Engine() {
    // game state
    const [gameState, setGameState] = useState(initialState);

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
            engine.jump();
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

        if (gameState.status === 'fail' && started) {
            setStarted(false);
            alert('DAN IS STUPID');
            setGameState(initialState);
            setStart(true);
        }

        if (gameState.status === 'win' && started) {
            setStarted(false);
            alert('TURKEY IS GOOD');
            setGameState(initialState);
            setStart(true);
        }
    });

    return (
        <div
            className={styles.container}
        >
                <div 
                    className={styles.stage}
                    style={{
                        transform: `translate(-${gameState.stage}px, 0px)`, // moves the stage
                    }}
                >
                    <span
                        className={styles.character}
                        style={{
                            transform: `translate(${gameState.stage}px, -${gameState.jump}px)`, // moves char in opposite direction
                            height: charHeight,
                            width: charWidth,
                        }}
                    />
                    {
                        gameState.blocks.map(
                            block => (
                                <span
                                    className={styles.block}
                                    key={block}
                                    style={{
                                        transform: `translate(${block}px, 0px)`, // move stage
                                        height: blockHeight,
                                        width: blockWidth,
                                    }}
                                />
                            ),
                        )
                    }
                </div>
        </div>
    );
}