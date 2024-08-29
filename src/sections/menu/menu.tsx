import { useState } from 'react';

import './menu.css';

interface Verse {
    book: string;
    chapter: number;
    start_verse: number;
    end_verse: number;
}

interface MenuProps {
    setGameState: (state: number) => void;
    verse: React.MutableRefObject<Verse>;
}

const menu = ({ setGameState }: MenuProps) => {
    const [isSliding, setIsSliding] = useState<boolean>(false);

    const handleSlide = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsSliding(!isSliding);
        setGameState(1);

        // unfocus the button
        (e.target as HTMLButtonElement).blur();
    };

    return (
        <>
            <section
                className={`menu-section ${isSliding ? 'slide-right' : ''}`}
            >
                <h2>Menu</h2>
                <p>
                    Type to destroy the asteroids. You have to type the words in
                    the correct order.
                </p>
                <p>
                    Only correct inputs will be read to assist with typing. All
                    words are read as lowercase so do not use the Shift key
                </p>
                <button className="button.game-start" onClick={handleSlide}>
                    {isSliding ? 'Reset' : 'Start'}
                </button>
            </section>
        </>
    );
};

export default menu;
