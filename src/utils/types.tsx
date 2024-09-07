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

export type {
    Verse,
    Point,
    MovingPoint
}