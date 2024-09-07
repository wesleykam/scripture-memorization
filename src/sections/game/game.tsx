import { useEffect, useState, useRef, useMemo } from 'react';

import spaceship from '../../assets/spaceship.png';
import Menu from '../menu/menu';
import EndMenu from '../endMenu/endMenu';

import getVerses from '../../API/bible';

import './game.css';
import Asteroid from '../../components/Asteroid/Asteroid';
import { generateOvalPoints } from '../../utils/gameHelpers';
import Input from '../../components/Input/Input';

import { Verse, MovingPoint } from '../../utils/types';
import { useQuery } from '@tanstack/react-query';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

const Game = () => {
    const [gameState, setGameState] = useState(0); // 0 = not started, 1 = playing, 2 = win, 3 = lose

    const verse = useRef<Verse>({
        book: 'Romans',
        chapter: 8,
        start_verse: 28,
        end_verse: 0,
    });
    const typingMode = useRef(1); // 0 = Regular, 1 = Typeracer
    const asteroidMode = useRef(0); // 0 = Whole Word, 1 = Initials, 2 = Nothing

    // (in the future, randomize betweeen word and initials and nothing?
    // will probably need to give asteroids their setting when they are created (visiblePoints))

    const nextWordRef = useRef('');
    const [visiblePoints, setVisiblePoints] = useState<MovingPoint[]>([]);
    const pointId = useRef(0);
    const [verseWords, setVerseWords] = useState<string[]>([]);
    const [dirtyVerseWords, setDirtyVerseWords] = useState<string[]>([]);

    const [currCompletion, setCurrCompletion] = useState('');

    const isAnimationStopped = useRef(true); // useRef to track animation state

    const points = useMemo(() => {
        return generateOvalPoints();
    }, []);

    const result = useQuery({
        queryKey: ['verses', verse.current],
        queryFn: getVerses,
        enabled: gameState === 1 && verseWords.length === 0, // Only fetch if game has started and verseWords is empty
    });

    // Handle the result outside of useEffect
    if (result.isLoading) {
        console.log('Loading...');
    }

    if (result.isError) {
        console.log('Error fetching verses:', result.error);
    }

    if (result.isSuccess && verseWords.length === 0) {
        // Set verseWords and dirtyVerseWords when data is successfully fetched
        setVerseWords(result.data.words);
        setDirtyVerseWords(result.data.dirtyWords);
    }

    useEffect(() => {
        console.log('gameState:', gameState);

        if (gameState === 0) {
            console.log('reset');
            setVisiblePoints([]);
            pointId.current = 0;
            setVerseWords([]);
            setDirtyVerseWords([]);

            return;
        } // Do not fetch if game is not started
    }, [gameState]);

    // Spawn asteroids on an interval
    useEffect(() => {
        if (verseWords.length === 0 || gameState != 1) return; // Ensure verseWords is loaded

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
    }, [verseWords, gameState]); // Re-run this effect when verseWords or game state change

    // Spawn asteroid immediately when empty
    useEffect(() => {
        if (gameState != 1) return;

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

        if (
            verseWords.length > 0 &&
            pointId.current >= verseWords.length &&
            visiblePoints.length <= 0
        ) {
            isAnimationStopped.current = true; // Stop all animations
            setGameState(4);
        }
    }, [visiblePoints.length]);

    useEffect(() => {
        if (gameState != 1) return; // on run when game starts

        const movePoints = () => {
            if (isAnimationStopped.current) return; // Stop moving circles

            setVisiblePoints((prevPoints) =>
                prevPoints.map((point) => {
                    const dx = CENTER_X - point.x;
                    const dy = CENTER_Y - point.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Check if the point has reached the center
                    const threshold = 100; // Adjust the threshold as necessary
                    if (distance < threshold) {
                        console.log(
                            `Point ${point.id} has reached the center.`
                        );
                        isAnimationStopped.current = true; // Stop all animations
                        setGameState(3); // Set game state to lose
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
    }, [gameState]);

    return (
        <>
            <section className="game-section">
                {gameState === 1 ? (
                    <>
                        {visiblePoints.map((point) => (
                            <Asteroid
                                key={point.id}
                                point={point}
                                asteroidMode={asteroidMode}
                            />
                        ))}
                    </>
                ) : (
                    <></>
                )}
                <Input
                    nextWordRef={nextWordRef}
                    typingMode={typingMode}
                    verseWords={verseWords}
                    dirtyVerseWords={dirtyVerseWords}
                    setVisiblePoints={setVisiblePoints}
                    setCurrCompletion={setCurrCompletion}
                    pointId={pointId}
                />
                <div className="spaceship">
                    <img src={spaceship} />
                </div>
                <div className="completion">
                    <p>{currCompletion}</p>
                </div>
            </section>
            <Menu
                gameState={gameState}
                setGameState={setGameState}
                verse={verse}
                typingMode={typingMode}
                asteroidMode={asteroidMode}
                isAnimationStopped={isAnimationStopped}
            />
            {gameState === 3 || gameState === 4 ? (
                <EndMenu
                    setGameState={setGameState}
                    nextWordRef={nextWordRef}
                    pointId={pointId}
                    setVerseWords={setVerseWords}
                    setDirtyVerseWords={setDirtyVerseWords}
                    setCurrCompletion={setCurrCompletion}
                    setVisiblePoints={setVisiblePoints}
                    isAnimationStopped={isAnimationStopped}
                />
            ) : (
                <></>
            )}
        </>
    );
};

export default Game;
