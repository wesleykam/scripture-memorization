import { useState } from 'react';
import { bible_books_chapters_verses } from '../../data/bibleData';

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
    typingMode: React.MutableRefObject<number>;
    asteroidMode: React.MutableRefObject<number>;
}

const menu = ({ setGameState, verse, typingMode, asteroidMode }: MenuProps) => {
    const [isSliding, setIsSliding] = useState<boolean>(false);

    const handleSlide = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsSliding(!isSliding);
        setGameState(1);

        // unfocus the button
        (e.target as HTMLButtonElement).blur();
    };

    const [selectedBook, setSelectedBook] = useState<string>(
        verse.current.book
    );
    const [selectedChapter, setSelectedChapter] = useState<number | null>(
        verse.current.chapter
    );
    const [selectedStartVerse, setSelectedStartVerse] = useState<number | null>(
        verse.current.start_verse
    );
    const [selectedEndVerse, setSelectedEndVerse] = useState<number | null>(
        verse.current.end_verse
    );

    const handleBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const book = event.target.value;
        setSelectedBook(book);
        setSelectedChapter(null);
        setSelectedStartVerse(null);
        setSelectedEndVerse(null);
        verse.current.book = book;
    };

    const handleChapterChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const chapter = parseInt(event.target.value);
        setSelectedChapter(chapter);
        setSelectedStartVerse(null);
        setSelectedEndVerse(null);
        verse.current.chapter = chapter;
    };

    const handleStartVerseChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const startVerse = parseInt(event.target.value);
        setSelectedStartVerse(startVerse);
        setSelectedEndVerse(null);
        verse.current.start_verse = startVerse;
    };

    const handleEndVerseChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const endVerse = parseInt(event.target.value);
        setSelectedEndVerse(endVerse);
        verse.current.end_verse = endVerse;
    };

    const getChapters = () => {
        if (selectedBook) {
            return Array.from(
                { length: bible_books_chapters_verses[selectedBook].chapters },
                (_, i) => i + 1
            );
        }
        return [];
    };

    const getVerses = () => {
        if (selectedBook && selectedChapter !== null) {
            return Array.from(
                {
                    length: bible_books_chapters_verses[selectedBook].verses[
                        selectedChapter - 1
                    ],
                },
                (_, i) => i + 1
            );
        }
        return [];
    };

    const [selectedTypingMode, setSelectedTypingMode] = useState<number>(
        typingMode.current
    ); // Default to Typeracer mode

    const handleTypingModeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const mode = parseInt(e.target.value, 10);
        setSelectedTypingMode(mode);
        typingMode.current = mode;
    };

    const [selectedAsteroidMode, setSelectedAsteroidMode] = useState<number>(0); // Default to Whole Word mode

    const handleAsteroidModeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const mode = parseInt(e.target.value, 10);
        setSelectedAsteroidMode(mode);
        asteroidMode.current = mode;
    };

    return (
        <>
            <section
                className={`menu-section ${isSliding ? 'slide-right' : ''}`}
            >
                <div>
                    <h2>Menu</h2>
                    <p>
                        Type to destroy the asteroids. You have to type the
                        words in the correct order.
                    </p>
                    <p>
                        You can choose your typing mode and asteroid appearance
                        in the menu.
                    </p>
                </div>

                <div className="verse-selector">
                    <select value={selectedBook} onChange={handleBookChange}>
                        <option value="" disabled>
                            Select Book
                        </option>
                        {Object.keys(bible_books_chapters_verses).map(
                            (book) => (
                                <option key={book} value={book}>
                                    {book}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={selectedChapter ?? ''}
                        onChange={handleChapterChange}
                        disabled={!selectedBook}
                    >
                        <option value="" disabled>
                            Select Chapter
                        </option>
                        {getChapters().map((chapter) => (
                            <option key={chapter} value={chapter}>
                                {chapter}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedStartVerse ?? ''}
                        onChange={handleStartVerseChange}
                        disabled={!selectedChapter}
                    >
                        <option value="" disabled>
                            Select Start Verse
                        </option>
                        {getVerses().map((verse) => (
                            <option key={verse} value={verse}>
                                {verse}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedEndVerse ?? ''}
                        onChange={handleEndVerseChange}
                        disabled={!selectedStartVerse}
                    >
                        <option value="" disabled>
                            Select End Verse
                        </option>
                        <option value="0">None</option>
                        {getVerses()
                            .filter((verse) => verse >= selectedStartVerse!)
                            .map((verse) => (
                                <option key={verse} value={verse}>
                                    {verse}
                                </option>
                            ))}
                    </select>
                </div>

                <select
                    value={selectedTypingMode}
                    onChange={handleTypingModeChange}
                >
                    <option value={0}>Regular</option>
                    <option value={1}>Typeracer</option>
                </select>

                <select
                    value={selectedAsteroidMode}
                    onChange={handleAsteroidModeChange}
                >
                    <option value={0}>Whole Word</option>
                    <option value={1}>Initials</option>
                    <option value={2}>Nothing</option>
                </select>

                <button className="button.game-start" onClick={handleSlide}>
                    {isSliding ? 'Reset' : 'Start'}
                </button>
            </section>
        </>
    );
};

export default menu;
