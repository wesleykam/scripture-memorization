// import { bible_books_index } from '../data/bibleData';

import axios from 'axios';

interface Verse {
    book: string;
    chapter: number;
    start_verse: number;
    end_verse: number;
}

// const getVerses = (verse: Verse) => {
//     let wordArray: string[] = [];

//     return axios
//         .get(
//             `https://bible-go-api.rkeplin.com/v1/books/${
//                 bible_books_index[verse.book]
//             }/chapters/${verse.chapter}?translation=NIV`
//         )
//         .then((response) => {
//             const data = response.data;
//             if (verse.end_verse) {
//                 const verses: string[] = [];

//                 for (let i = verse.start_verse - 1; i < verse.end_verse; i++) {
//                     verses.push(data[i].verse.replace(/[^a-zA-Z\s]/g, ''));
//                 }

//                 verses.forEach((str) => {
//                     // Clean the string and split it into words
//                     let words = str.split(/\s+/); // Split by one or more spaces
//                     wordArray = wordArray.concat(words); // Combine the arrays
//                 });

//                 return wordArray;
//             } else {
//                 console.log(data[verse.start_verse - 1].verse);
//                 const cleanVerse = data[verse.start_verse - 1].verse.replace(
//                     /[^a-zA-Z\s]/g,
//                     ''
//                 );
//                 wordArray = cleanVerse.split(/\s+/);

//                 return wordArray;
//             }
//         });
// };

const getVerses = (verse: Verse) => {
    return axios
        .post(
            'https://bible-proxy-server-349606288245.us-west2.run.app/getVerses',
            {
                verse,
            }
        )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error('Error fetching verses:', error);
            return [];
        });
};

export default getVerses;
