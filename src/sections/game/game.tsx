import { useEffect, useState } from 'react';

import spaceship from '../../assets/spaceship.png';
import Asteroids from '../asteroidLogic/asteroidLogic';
import Menu from '../menu/menu';

import './game.css';

const game = () => {
    const [input, setInput] = useState('');
    const [gameState, setGameState] = useState(0); // 0 = not started, 1 = playing, 2 = win, 3 = lose

    useEffect(() => {
        // add an event listener to the document to listen for key presses
        document.body.addEventListener('keydown', (e: KeyboardEvent) => {
            // prevent repeating key presses
            if (e.repeat) return;

            // append the key pressed to the input state
            setInput((prev) => prev + e.key);
        });
    }, []);

    return (
        <section className="game-section">
            {gameState === 1 ? <Asteroids /> : <></>}
            <div className="user-input">
                <h2>{input}</h2>
                <div className="cursor"></div>
            </div>
            <div className="spaceship">
                <img src={spaceship}></img>
            </div>
            {/* { gameState === 0 ? <Menu gameState={setGameState}/> : <></>} */}
            <Menu gameState={setGameState} />
        </section>
    );
};

export default game;
