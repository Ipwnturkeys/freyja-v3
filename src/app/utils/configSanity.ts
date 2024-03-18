import { createClient } from 'next-sanity';

export const client = createClient({
    projectId: 'z1fj7e4y',
    dataset: 'production',
    apiVersion: '2022-03-07',
    useCdn: true,
});