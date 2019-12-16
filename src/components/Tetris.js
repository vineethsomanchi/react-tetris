import React, { useState } from 'react';
import { createStage, checkCollision } from '../utils/gameHelpers';

//Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Main Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

//Hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import {useInterval } from '../hooks/useInterval';

const Tetris = () => {
  
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage] = useStage(player, resetPlayer);

  //Horizontal movement
  const movePlayer = (dir) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 } )) {
      updatePlayerPos({ x: dir, y: 0 })
    }
  }

  //Restart game, clear everything
  const startGame = () => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
  }

  //Vertical movement
  const drop = () => {
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false })
    } else {
      
      //If you reach top, game is over
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }

      //If you reach bottom with no collision, merge tetro into stage
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }

  const dropPlayer = () => {
    setDropTime(null); //Stop interval when player presses down
    drop();
  }

  //On keyup of down arrow, restart interval
  const startInt = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        setDropTime(1000)
      }
    }
  }
 
  const move = ({ keyCode }) => {
    if (!gameOver) {
      //Left arrow
      if (keyCode === 37)  {
        movePlayer(-1);
      //Right arrow
      } else if (keyCode === 39) {
        movePlayer(1);
      //Down arrow
      } else if (keyCode === 40) {
        dropPlayer();
      //Up arrow
      } else if (keyCode === 38) {
        playerRotate(stage, 1)
      }
    }
  }

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    //Wrapper allows us to register keypresses even if they're outside Tetris game
    <StyledTetrisWrapper role="button" tabIndex = "0" onKeyDown={e => move(e)} onKeyUp={startInt}>
      <div className="title-wrapper"><h1 className="title">Vinny's React Tetris</h1></div>
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
          <div>
            <Display text="Score" />
            <Display text="Rows" />
            <Display text="Level" />
          </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
}

export default Tetris;