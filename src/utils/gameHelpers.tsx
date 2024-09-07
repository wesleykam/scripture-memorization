interface Point {
    x: number;
    y: number;
}

const generateOvalPoints = (): Point[] => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const radiusX = screenWidth * 0.45; // horizontal radius
    const radiusY = screenHeight * 0.45; // vertical radius
    const numberOfPoints = 20; // number of points around the oval

    const points: Point[] = [];
    const angleStep = (2 * Math.PI) / numberOfPoints;

    for (let i = 0; i < numberOfPoints; i++) {
        const angle = i * angleStep;
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);
        points.push({ x, y });
    }

    return points;
};

export {
    generateOvalPoints
}