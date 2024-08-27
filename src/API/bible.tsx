import { bible_books_index } from '../data/bibleData';

import axios from 'axios';

interface Verse {
    book: string;
    chapter: number;
    start_verse: number;
    end_verse: number;
}

const getVerses = (verse: Verse) => {
    axios
        .get(
            `https://bible-go-api.rkeplin.com/v1/books/${bible_books_index[verse.book]}/chapters/${verse.chapter}?translation=NIV`
        )
        .then((response) => {
            const data = response.data;
            if (verse.end_verse) {
                for (let i = verse.start_verse - 1; i < verse.end_verse; i++) {
                    console.log(data[i].verse);
                }
                return;
            }
            else {
                console.log(data[verse.start_verse - 1].verse);
                return;
            }
        });
};

export default getVerses;
