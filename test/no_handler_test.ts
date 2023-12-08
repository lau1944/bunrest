import server from '../src';
import { describe, it, expect, beforeAll, afterAll } from "bun:test";

const app = server();

app.get('/test', (req, res) => {
    res.status(200).send('GET /');
});

//add error handler
app.use((req, res, next, err) => {
    res.status(500).send('Err /err');
});

const URL_PORT = 5555;
const BASE_URL = `http://localhost:${URL_PORT}`;

describe('no handler test', () => {
    it('GET', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL);
            expect(res.status).toBe(404);
            expect(await res.text()).toBe('GET / with a 404')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    });
})
