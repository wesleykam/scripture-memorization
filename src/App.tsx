import Game from './sections/game/game';

const App = () => {
    return (
        <>
            <Game />
            <div className="mobile-warning">
                <h1>Warning!</h1>
                <p>
                    This game is not optimized for mobile devices. Please play
                    on a desktop.
                </p>
            </div>
        </>
    );
};

export default App;
