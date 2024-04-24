import server from '../src';
import { describe, it, expect} from "bun:test";

const app = server();

app.get('*', (req, res) => {
    res.status(200).send('GET /');
});

app.ws<{data: string}>((ws, msg) => {
    ws.send(ws.data.data + "|" + msg)
}, {
    open: (ws) => {
        console.log('Websocket is turned on')
    }, close: (ws) => {
        console.log('Websocket is closed')
    }, drain: (ws) => {
        console.log('Websocket is drained')
    }
},
(req) => ({data: "socket-data"})
)

const URL_PORT = 5555;
const BASE_URL = `http://localhost:${URL_PORT}`;

describe('http with websockets on test', () => {
    it('GET', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL);
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('GET /')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    });
})

describe('websocket test', () => {
    it(('ws'), async () => {
        let server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const msg = 'Hello world'
            expect(await new Promise((resolve) => {
                const socket = new WebSocket(`ws://localhost:${URL_PORT}`);
                // message is received
                socket.addEventListener("message", event => {
                    resolve(event.data);
                });
                // socket opened
                socket.addEventListener("open", event => {
                    console.log('Open')
                    socket.send(msg)
                });
                // socket closed
                socket.addEventListener("close", event => {
                    console.log('Close ' + event.code);
                    resolve(false);
                });

                // error handler
                socket.addEventListener("error", event => {
                    console.log('Error')
                    resolve(false);
                });
            })).toBe("socket-data|" + msg);
        } catch (e) {
            throw e
        } finally {
            server.stop()
        }
    })
})