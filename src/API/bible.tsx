// import { bible_books_index } from '../data/bibleData';

import axios from 'axios';
import { QueryFunctionContext } from '@tanstack/react-query';
import { Verse } from '../utils/types';

const getVerses = ({ queryKey }: QueryFunctionContext<[string, Verse]>) => {
    const verse = queryKey[1];

    const response: Promise<{
        words: string[];
        dirtyWords: string[];
    }> = axios
        .post(
            'https://bible-proxy-server-349606288245.us-west2.run.app/getVerses',
            {
                verse,
            }
        )
        .then((res) => res.data)
        .catch((error) => {
            throw new Error('Error fetching verses:' + error);
        });

    return response;
};

export default getVerses;
