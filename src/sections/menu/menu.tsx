import { useState } from 'react';

import './menu.css';

interface Verse {
    book: string;
    chapter: number;
    start_verse: number;
    end_verse: number;
}

interface MenuProps {
    gameState: (state: number) => void;
    verseState: (verse: Verse) => void;
    verse: Verse;
}

const menu = ({gameState}: MenuProps) => {

    const [isSliding, setIsSliding] = useState<boolean>(false);

    const handleSlide = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsSliding(!isSliding);
        gameState(1);

        // unfocus the button
        (e.target as HTMLButtonElement).blur();
    };

    return (
        <>
            <section
                className={`menu-section ${isSliding ? 'slide-right' : ''}`}
            >
                <h2>Menu</h2>
                <button className="button.game-start" onClick={handleSlide}>
                    {isSliding ? 'Reset' : 'Start'}
                </button>
            </section>
        </>
    );
};

export default menu;
