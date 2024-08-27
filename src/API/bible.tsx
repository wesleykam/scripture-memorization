import { bible_books_index } from '../data/bibleData';

import axios from 'axios';

interface Verse {
    book: string;
    chapter: string;
    start_verse: string;
    end_verse: string;
}

const getVerses = (verse: Verse) => {
    axios
        .get(
            `https://bible-go-api.rkeplin.com/v1/books/${bible_books_index[verse.book]}/chapters/${verse.chapter}?translation=NIV`
        )
        .then((response) => {
            const data = response.data;
            console.log(data);
        });
};

export default getVerses;
