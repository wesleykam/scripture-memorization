import React, { useEffect, useState } from 'react';
import { MovingPoint } from '../../utils/types';

interface InputProps {
    nextWordRef: React.MutableRefObject<string>;
    typingMode: React.MutableRefObject<number>;
    setVisiblePoints: React.Dispatch<React.SetStateAction<MovingPoint[]>>;
    verseWords: string[];
    dirtyVerseWords: string[];
    pointId: React.MutableRefObject<number>;
    setCurrCompletion: React.Dispatch<React.SetStateAction<string>>;
}

const Input = ({
    nextWordRef,
    typingMode,
    setVisiblePoints,
    verseWords,
    dirtyVerseWords,
    pointId,
    setCurrCompletion,
}: InputProps) => {
    const [input, setInput] = useState('');

    useEffect(() => {
        // add an event listener to the document to listen for key presses
        document.body.addEventListener('keydown', (e: KeyboardEvent) => {
            if (nextWordRef.current.length === 0) return; // Ensure verseWords is loaded

            if (typingMode.current === 0) {
                // backspace
                if (e.ctrlKey && e.key === 'Backspace') {
                    setInput('');
                    return;
                }

                if (e.key === 'Backspace') {
                    setInput((prev) => prev.slice(0, -1));
                    return;
                }

                // only allow alphabet characters
                if (!e.key.match(/^[a-zA-Z]$/)) return;

                // prevent repeating key presses
                if (e.repeat) return;

                setInput((prev) => prev + e.key);
            }

            if (typingMode.current === 1) {
                // only allow alphabet characters
                if (!e.key.match(/^[a-zA-Z]$/)) return;

                // prevent repeating key presses
                if (e.repeat) return;

                // append the key pressed to the input state if equal to next letter in nextWord
                if (e.key === nextWordRef.current[0]) {
                    setInput((prev) => prev + e.key);
                    nextWordRef.current = nextWordRef.current.slice(1);
                }
            }
        });

        return () => {
            document.body.removeEventListener('keydown', () => {});
        };
    }, []);

    useEffect(() => {
        if (input === '') return;

        setVisiblePoints((prevPoints: MovingPoint[]) => {
            if (typingMode.current === 0) {
                if (input === nextWordRef.current) {
                    setCurrCompletion(
                        (prev) => prev + ' ' + dirtyVerseWords[prevPoints[0].id]
                    );

                    const updatedPoints = prevPoints.slice(1);
                    if (updatedPoints.length > 0) {
                        nextWordRef.current = verseWords[updatedPoints[0].id];
                    } else {
                        nextWordRef.current =
                            pointId.current < verseWords.length
                                ? verseWords[pointId.current]
                                : '';
                    }
                    setInput('');
                    return updatedPoints;
                }
            }

            if (typingMode.current === 1) {
                // Only proceed if `nextWordRef.current` is empty
                if (nextWordRef.current.length === 0) {
                    setCurrCompletion(
                        (prev) => prev + ' ' + dirtyVerseWords[prevPoints[0].id]
                    );

                    // Update `nextWordRef.current` with the new word
                    const updatedPoints = prevPoints.slice(1);
                    if (updatedPoints.length > 0) {
                        nextWordRef.current =
                            verseWords[updatedPoints[0].id].toLowerCase();
                    } else {
                        nextWordRef.current =
                            pointId.current < verseWords.length
                                ? verseWords[pointId.current].toLowerCase()
                                : '';
                    }

                    // Clear input
                    setInput('');

                    return updatedPoints; // Return the new state for `visiblePoints`
                }
            }

            return prevPoints;
        });
    }, [input]);

    return (
        <div className="user-input">
            <h2>{input}</h2>
            <div className="cursor"></div>
        </div>
    );
};

export default Input;
