import asteroid1 from '../../assets/asteroid1.png';
import { MovingPoint } from '../../utils/types';

interface AsteroidProps {
    point: MovingPoint;
    asteroidMode: React.MutableRefObject<number>;
}

const Asteroid = ({ point, asteroidMode }: AsteroidProps) => {
    return (
        <div
            key={point.id}
            className="asteroid"
            style={{
                position: 'absolute',
                left: `${point.x}px`,
                top: `${point.y}px`,
                zIndex: -1 * point.id,
            }}
        >
            <img className="asteroid-image" src={asteroid1} />
            <div
                className="asteroid-word"
                style={{
                    opacity: asteroidMode.current === 2 ? 0 : 1,
                }}
            >
                {asteroidMode.current === 0
                    ? point.word
                    : asteroidMode.current === 1
                    ? point.word[0]
                    : point.word}
            </div>
        </div>
    );
};

export default Asteroid;
