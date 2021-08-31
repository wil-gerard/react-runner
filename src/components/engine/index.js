import React, { useState, useEffect } from 'react';
import styles from './engine.module.scss';
import { useEvent, useSpeech } from '../../hooks';
import { initSpeechRecognizer } from '../../speechCommand';
import Modal from '../modal';


const BLOCKS = [500, 1000, 1500];

const charWidth = 100;
const charHeight = 100;
const charOffset = 150;

const blockWidth = 80;
const blockHeight = 150;
const blockSpacing = 500;

// this is in comparison to the rest of the game
// 2 is twice the speed
// 1 is the same speed
const JUMP_VELOCITY = 1.4;

function CreateEngine(setState) {
  this.settings = {
    tile: 5, // width of one tile
  };

  // current stage position
  this.score = 0;
  this.game = 'start';
  this.stage = 0;
  this.jump = false;
  this.direction = 'up';
  this.position = 0;
  this.max = this.settings.tile * 100; // max jump height
  this.blocks = BLOCKS.map(b => (b * this.settings.tile));
  this.isOpen = false;

  const checkBlocks = () => {
    const charXPos = this.stage + charOffset;
    const charYPos = this.position;

    //if a block has moved past the screen, remove and replace it
    if (this.blocks[0] + blockWidth < this.stage) {
      this.blocks.shift();
      this.blocks.push(this.blocks[this.blocks.length - 1] + blockSpacing * this.settings.tile);
      this.score += 1;
      console.log(this.score)
    }

    this.blocks.forEach((block) => {
      // if char hits a block
      if (
        charXPos + charWidth >= block
        && charYPos <= blockHeight
        && charYPos + charHeight >= 0
        && charXPos <= block + blockWidth
      ) {
        this.game = 'fail';
      }
    });
  };

  const doJump = () => {
    // if not jumping, reset and return
    if (!this.jump) {
      this.position = 0;
      this.direction = 'up';
      return;
    }

    // if finished jumping, reset and return
    if (this.direction === 'down' && this.position <= 0) {
      this.jump = false;
      this.position = 0;
      this.direction = 'up';
      return;
    }

    // if the jump is at its max, start falling
    if (this.position >= this.max) this.direction = 'down';

    // depending on the direction increment the jump.
    if (this.direction === 'up') {
      this.position += (this.settings.tile * JUMP_VELOCITY);
    } else {
      this.position -= (this.settings.tile * JUMP_VELOCITY);
    }
  };

  // function that will be continuously ran
  this.repaint = () => {
    // move the stage by one tile
    this.stage += this.settings.tile;

    // check if char has hit a block
    checkBlocks();

    // check and perform jump
    doJump();

    // set state for use in the component
    setState({
      score: this.score,
      stage: this.stage,
      jump: this.position,
      blocks: this.blocks,
      status: this.game,
    });

    // stop the game if the game var has been set to false
    if (this.game !== 'start') {
      // reset and stop
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

  // trigger initial paint
  this.repaint();
  return () => ({
    jump: () => {
      // if jump is not active, trigger jump
      if (!this.jump) {
        this.jump = true;
      }
    },
  });
}


const initialState = {
  score: 0,
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
  const [started, setStarted] = useState(false);

  // instance of game engine
  const [engine, setEngine] = useState(null);

  // modal state
  const [isOpen, setIsOpen] = useState(true)

  const handleKeyPress = (e) => {
    // the ' ' char actually represents the space bar key.
    if (e.key === ' ') {
      // start the game when the user first presses the spacebar
      if (!started && !start && isOpen === true) {
        setStart(true);
        setIsOpen(false);
      }

      // if the game has not been initialized return
      if (engine === null) return;

      // otherwise jump
      engine.jump();
    }
  };

  const handleSpeechInput = () => {
    if (!started && !start && isOpen === true) {
      setStart(true);
      setIsOpen(false);
    }

    // if the game has not been initialized return
    if (engine === null) return;

    // otherwise jump
    engine.jump();
  }

  useEvent('keyup', handleKeyPress);
  initSpeechRecognizer(handleSpeechInput); // initializes imported speechCommand.js

  useEffect(() => {
    if (start) {
      setStarted(true);
      setStart(false);
      // create a new engine and save it to the state to use
      setEngine(
        new CreateEngine(
          // set state
          state => setGameState(state),
        ),
      );
    }



    if (gameState.status === 'fail' && started) {
      setStarted(false);
      setStart(false);
      setIsOpen(true);
    }
    
  });


  return (
    <div 
      className={styles.wrapper}
    >
      <div
        className={styles.container}
      >
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
          {`${gameState.score}` > 0 ? `Your score is ${gameState.score}. Press space or say 'UP' to try again!` : "Press space or say 'UP' to start the game"}

            </Modal>
        <span>{gameState.score}</span>
        <div
          className={styles.stage}
          style={{
            transform: `translate(-${gameState.stage}px, 0px)`, // move stage
          }}
        >
          <span
            className={styles.character}
            style={{
              transform: `translate(${gameState.stage + charOffset}px, -${gameState.jump}px)`, // move char in opposite direction
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
    </div>
  );
}
