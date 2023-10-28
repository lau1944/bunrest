// import server from '../src';
// import { describe, it, expect, beforeAll, afterAll } from "bun:test";

// const app = server();

// app.get('/test', (req, res) => {
//     res.status(200).send('GET /');
// });

// //add error handler 
// app.use((req, res, next, err) => {
//     res.status(500).send('Err /err');
// });

// const BASE_URL = 'http://localhost:3000';

// describe('no handler test', () => {
//     it('GET', async () => {
//         const server = app.listen(3000, () => {
//             console.log('App is listening on port 3000');
//         });
//         try {
//             const res = await fetch(BASE_URL);
//             expect(res.status).toBe(404);
//             expect(await res.text()).toBe('GET / with a 404')
//         } catch (e) {
//             throw e;
//         } finally {
//             server.stop();
//         }
//     });
// })