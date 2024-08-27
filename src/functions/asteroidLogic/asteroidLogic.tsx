import { useEffect, useState, useRef } from 'react';
import asteroid1 from '../../assets/asteroid1.png';

import './asteroidLogic.css';

interface Point {
    x: number;
    y: number;
}

interface MovingPoint extends Point {
    id: number; // unique identifier for each point
}

const OvalPoints: React.FC = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    const radiusX = screenWidth * 0.45; // horizontal radius
    const radiusY = screenHeight * 0.4; // vertical radius
    const numberOfPoints = 20; // number of points around the oval

    const isAnimationStopped = useRef(false); // useRef to track animation state

    // Function to generate points around the oval
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

    // State to track the points that are currently visible
    const [visiblePoints, setVisiblePoints] = useState<MovingPoint[]>([]);

    // Randomly spawn asteroid around the center
    useEffect(() => {
        let pointId = 0;
        const interval = setInterval(() => {
            if (isAnimationStopped.current) return; // Stop spawning new circles

            const randomIndex = Math.floor(Math.random() * points.length);
            const selectedPoint = points[randomIndex];

            setVisiblePoints((prevPoints) => [
                ...prevPoints,
                { ...selectedPoint, id: pointId++},
            ]);

            // Stop adding points once we reach the desired number of points
            if (pointId >= 5) {
                clearInterval(interval);
            }
        }, 1000);
    }, []);

    // Move Asteroids towards the center of the page
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
                    const speed = 2; // Adjust speed as necessary
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

    return (
        <div>
            {visiblePoints.map((point, index) => (
                <img
                    key={index}
                    className="asteroid"
                    style={{
                        position: 'absolute',
                        left: `${point.x}px`,
                        top: `${point.y}px`,
                        width: '100px',
                    }}
                    src={asteroid1}
                />
            ))}
        </div>
    );
};

export default OvalPoints;
