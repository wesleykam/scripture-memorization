import { useEffect, useState } from 'react';

import spaceship from '../../assets/spaceship.png';

import './game.css';

const game = () => {
    const [input, setInput] = useState('');

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
            <div className="user-input">
                <h2>{input}</h2>
                <div className='cursor'></div>
            </div>
            <div className="spaceship">
                <img src={spaceship}></img>
            </div>
        </section>
    );
};

export default game;
