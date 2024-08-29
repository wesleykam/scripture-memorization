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
    const [verse, setVerse] = useState<Verse>({
        book: 'Genesis',
        chapter: 1,
        start_verse: 1,
        end_verse: 3,
    });
    const nextWordRef = useRef('');
    const [visiblePoints, setVisiblePoints] = useState<MovingPoint[]>([]);
    const [pointId, setPointId] = useState(0);
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
            setPointId(0);
            setVerseWords([]);

            return;
        }; // Do not fetch if game is not started

        if (verseWords.length > 0) return; // Do not fetch if verseWords is already

        getVerses(verse).then((data) => {
            setVerseWords(data);
        });
    }, [gameState]);

    useEffect(() => {
        if (verseWords.length === 0) return; // Ensure verseWords is loaded

        nextWordRef.current = verseWords[0].toLowerCase();

        const interval = setInterval(() => {
            if (isAnimationStopped.current) return; // Stop spawning new circles

            setPointId((prevId) => {
                const randomIndex = Math.floor(Math.random() * points.length);
                const selectedPoint = points[randomIndex];

                setVisiblePoints((prevPoints) => [
                    ...prevPoints,
                    {
                        ...selectedPoint,
                        id: prevId,
                        word: verseWords[prevId], // Use the latest verseWords here
                    },
                ]);

                // Stop adding points once we reach the desired number of points
                if (prevId >= verseWords.length - 1) {
                    clearInterval(interval);
                    console.log('all asteroids spawned');
                }

                return prevId + 1; // Increment pointId
            });
        }, 1000); // Adjust the interval as necessary
    }, [verseWords]); // Re-run this effect when verseWords or points change

    useEffect(() => {
        if (visiblePoints.length === 0 && pointId < verseWords.length) {
            setPointId((prevId) => {
                const randomIndex = Math.floor(Math.random() * points.length);
                const selectedPoint = points[randomIndex];

                setVisiblePoints((prevPoints) => [
                    ...prevPoints,
                    {
                        ...selectedPoint,
                        id: prevId,
                        word: verseWords[prevId], // Use the latest verseWords here
                    },
                ]);

                return prevId + 1; // Increment pointId
            });
        }
    }, [visiblePoints]);

    useEffect(() => {
        if (input === '') return;

        setVisiblePoints((prevPoints) => {
            // Only proceed if `nextWordRef.current` is empty
            if (nextWordRef.current.length === 0) {
                // Update `nextWordRef.current` with the new word
                const updatedPoints = prevPoints.slice(1);
                if (updatedPoints.length > 0) {
                    nextWordRef.current =
                        verseWords[updatedPoints[0].id].toLowerCase();
                } else {
                    nextWordRef.current = pointId < verseWords.length ? verseWords[pointId].toLowerCase() : '';
                }

                // Clear input
                setInput('');

                return updatedPoints; // Return the new state for `visiblePoints`
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

            // only allow alphabet characters
            if (!e.key.match(/^[a-zA-Z]$/)) return;

            // prevent repeating key presses
            if (e.repeat) return;

            // append the key pressed to the input state if equal to next letter in nextWord
            if (e.key === nextWordRef.current[0]) {
                setInput((prev) => prev + e.key);
                nextWordRef.current = nextWordRef.current.slice(1);
            }
        });
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
                            <div className="asteroid-word">{point.word[0]}</div>
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
            <Menu
                gameState={setGameState}
                verseState={setVerse}
                verse={verse}
            />
        </section>
    );
};

export default Game;
