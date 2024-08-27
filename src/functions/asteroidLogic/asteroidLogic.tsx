import { useEffect, useState } from 'react';
import asteroid1 from '../../assets/asteroid1.png';

import './asteroidLogic.css';

interface Point {
    x: number;
    y: number;
}

const OvalPoints: React.FC = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    const radiusX = screenWidth * 0.45; // horizontal radius
    const radiusY = screenHeight * 0.4; // vertical radius
    const numberOfPoints = 20; // number of points around the oval

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
    const [visiblePoints, setVisiblePoints] = useState<Point[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly select a point from the points array
            const randomIndex = Math.floor(Math.random() * points.length);
            const selectedPoint = points[randomIndex];

            // Add the selected point to the visible points array if it's not already there
            setVisiblePoints((prevPoints) => {
                if (!prevPoints.includes(selectedPoint)) {
                    return [...prevPoints, selectedPoint];
                }
                return prevPoints;
            });
        }, 1000); // Add a new point every second

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, [points]);

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
