import './endMenu.css';

interface Point {
    x: number;
    y: number;
}

interface MovingPoint extends Point {
    id: number; // unique identifier for each point
    word: string; // word associated with the point
}

interface EndMenuProps {
    setGameState: (state: number) => void;
    nextWordRef: React.MutableRefObject<string>;
    pointId: React.MutableRefObject<number>;
    setVerseWords: (state: string[]) => void;
    setDirtyVerseWords: (state: string[]) => void;
    setVisiblePoints: (state: MovingPoint[]) => void;
    isAnimationStopped: React.MutableRefObject<boolean>;
    setCurrCompletion: (state: string) => void;
}

const endMenu = ({
    setGameState,
    nextWordRef,
    pointId,
    setVerseWords,
    setDirtyVerseWords,
    setCurrCompletion,
    setVisiblePoints,
    isAnimationStopped,
}: EndMenuProps) => {
    const handleGoToMenu = () => {
        setGameState(0);
        nextWordRef.current = '';
        pointId.current = 0;
        setVerseWords([]);
        setDirtyVerseWords([]);
        setCurrCompletion('');
    };

    const handleRestart = () => {
        setGameState(1);
        nextWordRef.current = '';
        pointId.current = 0;
        setVerseWords([]);
        setDirtyVerseWords([]);
        setCurrCompletion('');

        setVisiblePoints([]);

        isAnimationStopped.current = false;
    };

    return (
        <section className="end-menu-section">
            <h1>Complete!</h1>
            <div className="end-menu-options">
                <button onClick={handleRestart}>Restart</button>
                <button onClick={handleGoToMenu}>Back to Menu</button>
            </div>
        </section>
    );
};

export default endMenu;
