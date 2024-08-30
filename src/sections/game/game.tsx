import { useEffect, useState, useRef } from 'react';

import spaceship from '../../assets/spaceship.png';
import asteroid1 from '../../assets/asteroid1.png';
import Menu from '../menu/menu';
import getVerses from '../../API/bible';

import './game.css';

interface Verse {
    book: string;
    chapter: number;
    start_verse: number;
    end_verse: number;
}

interface Point {
    x: number;
    y: number;
}

interface MovingPoint extends Point {
    id: number; // unique identifier for each point
    word: string; // word associated with the point
}

const Game = () => {
    const [input, setInput] = useState('');
    const [gameState, setGameState] = useState(0); // 0 = not started, 1 = playing, 2 = win, 3 = lose

    const verse = useRef<Verse>({
        book: 'Genesis',
        chapter: 1,
        start_verse: 1,
        end_verse: 0,
    });
    const typingMode = useRef(1); // 0 = Regular, 1 = Typeracer

    const nextWordRef = useRef('');
    const [visiblePoints, setVisiblePoints] = useState<MovingPoint[]>([]);
    const pointId = useRef(0);
    const [verseWords, setVerseWords] = useState<string[]>([]);

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const radiusX = screenWidth * 0.45; // horizontal radius
    const radiusY = screenHeight * 0.45; // vertical radius
    const numberOfPoints = 20; // number of points around the oval
    const isAnimationStopped = useRef(false); // useRef to track animation state

    const generateOvalPoints = (
        numPoints: number,
        radiusX: number,
        radiusY: number
    ): Point[] => {
        const points: Point[] = [];
        const angleStep = (2 * Math.PI) / numPoints;

        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            const x = centerX + radiusX * Math.cos(angle);
            const y = centerY + radiusY * Math.sin(angle);
            points.push({ x, y });
        }

        return points;
    };

    const points = generateOvalPoints(numberOfPoints, radiusX, radiusY);

    useEffect(() => {
        if (gameState === 0) {
            setVisiblePoints([]);
            pointId.current = 0;
            setVerseWords([]);

            return;
        } // Do not fetch if game is not started

        if (verseWords.length > 0) return; // Do not fetch if verseWords is already

        getVerses(verse.current).then((data) => {
            setVerseWords(data);
        });
    }, [gameState]);

    // Spawn asteroids on an interval
    useEffect(() => {
        if (verseWords.length === 0) return; // Ensure verseWords is loaded

        // Set the first word to type
        if (typingMode.current === 0) nextWordRef.current = verseWords[0];
        if (typingMode.current === 1)
            nextWordRef.current = verseWords[0].toLowerCase();

        const interval = setInterval(() => {
            if (isAnimationStopped.current) return;

            if (pointId.current >= verseWords.length) {
                clearInterval(interval);
                console.log('all asteroids spawned');
                return; // Exit early to avoid adding more points
            }


            setVisiblePoints((prevPoints) => {
                const randomIndex = Math.floor(Math.random() * points.length);
                const selectedPoint = points[randomIndex];

                const newPoint = {
                    ...selectedPoint,
                    id: pointId.current,
                    word: verseWords[pointId.current],
                };

                pointId.current++; // Increment here after the point is created
                return [...prevPoints, newPoint];
            });
        }, 1000); // Adjust the interval as necessary

        return () => clearInterval(interval);
    }, [verseWords]); // Re-run this effect when verseWords or points change

    // Spawn asteroid immediately when empty
    useEffect(() => {
        if (
            pointId.current > 0 &&
            visiblePoints.length === 0 &&
            pointId.current < verseWords.length
        ) {
            setVisiblePoints((prevPoints) => {
                const randomIndex = Math.floor(Math.random() * points.length);
                const selectedPoint = points[randomIndex];

                const newPoint = {
                    ...selectedPoint,
                    id: pointId.current,
                    word: verseWords[pointId.current],
                };

                pointId.current++; // Increment here after the point is created
                return [...prevPoints, newPoint];
            });
        }
    }, [visiblePoints.length]);

    useEffect(() => {
        if (input === '') return;

        setVisiblePoints((prevPoints) => {
            if (typingMode.current === 0) {
                if (input === nextWordRef.current) {
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

    useEffect(() => {
        const movePoints = () => {
            if (isAnimationStopped.current) return; // Stop moving circles

            setVisiblePoints((prevPoints) =>
                prevPoints.map((point) => {
                    const dx = centerX - point.x;
                    const dy = centerY - point.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Check if the point has reached the center
                    const threshold = 100; // Adjust the threshold as necessary
                    if (distance < threshold) {
                        console.log(
                            `Point ${point.id} has reached the center.`
                        );
                        isAnimationStopped.current = true; // Stop all animations
                    }

                    // Determine how much to move the point towards the center
                    const speed = 0.5; // Adjust speed as necessary
                    const moveX = (dx / distance) * speed;
                    const moveY = (dy / distance) * speed;

                    return {
                        ...point,
                        x: point.x + moveX,
                        y: point.y + moveY,
                    };
                })
            );

            requestAnimationFrame(movePoints);
        };

        const animationId = requestAnimationFrame(movePoints);
        return () => cancelAnimationFrame(animationId);
    }, []);

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

    return (
        <section className="game-section">
            {gameState === 1 ? (
                <div>
                    {visiblePoints.map((point, index) => (
                        <div
                            key={index}
                            className="asteroid"
                            style={{
                                position: 'absolute',
                                left: `${point.x}px`,
                                top: `${point.y}px`,
                            }}
                        >
                            <img className="asteroid-image" src={asteroid1} />
                            <div className="asteroid-word">{point.word}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <></>
            )}
            <div className="user-input">
                <h2>{input}</h2>
                <div className="cursor"></div>
            </div>
            <div className="spaceship">
                <img src={spaceship} />
            </div>
            <Menu setGameState={setGameState} verse={verse} />
        </section>
    );
};

export default Game;
