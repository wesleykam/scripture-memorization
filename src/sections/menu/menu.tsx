import { useState } from 'react';

import getVerses from '../../API/bible';

import './menu.css';

interface Verse {
    book: string;
    chapter: number;
    start_verse: number;
    end_verse: number;
}

const menu = () => {
    const [isSliding, setIsSliding] = useState<boolean>(false);
    const [verse, setVerse] = useState<Verse>({
        book: 'Genesis',
        chapter: 1,
        start_verse: 1,
        end_verse: 3,
    });

    const handleSlide = () => {
        getVerses(verse);
        setIsSliding(!isSliding);
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
