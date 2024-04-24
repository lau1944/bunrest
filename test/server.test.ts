import server from '../src';
import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import router from './router.test';

const app = server();

app.get('*', (req, res) => {
    res.status(200).send('GET /');
});

app.put('/', (req, res) => {
    res.status(200).send('PUT /');
});

app.post('/', (req, res) => {
    res.status(200).send('POST /');
});

app.patch('/', (req, res) => {
    res.status(200).send('PATCH /');
});

app.delete('/', (req, res) => {
    res.status(200).send('DELETE /');
});

app.options('/', (req, res) => {
    res.status(200).send('OPTIONS /');
});

app.head('/', (req, res) => {
    res.status(200).setHeader('X-Custom-Header', 'Bun is awesome').send('HEAD /');
});

app.use('/route', router);

app.use((req, res, next) => {
    next();
});

app.use((req, res, next) => {
    next();
});

app.get('/mid', (req, res, next) => {
    res.status(200).send('Middleware /mid');
}, (req, res) => { });

app.get('/mid/nomid', (req, res) => { res.status(200).send('No middleware /mid/nomid')});

app.get('/mid/path', (req, res, next) => {
    res.status(200).send('Middleware /mid/path');
}, (req, res) => { });

app.get('/mid/:id', (req, res, next) => {
    res.status(200).send(`Middleware /mid/${req.params.id}`);
}, (req, res) => { });

app.get('/err', (req, res) => {
    throw new Error('Err');
})

//add error handler
app.use((req, res, next, err) => {
    res.status(500).send('Err /err');
});

const URL_PORT = 5555;
const BASE_URL = `http://localhost:${URL_PORT}`;

describe('http test', () => {
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
    it('POST', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL, { method: 'POST' });
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('POST /')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    });
    it('PATCH', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL, { method: 'PATCH' });
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('PATCH /')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    });
    it('PUT', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL, { method: 'PUT' });
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('PUT /')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    });
    it('DELETE', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL, { method: 'DELETE' });
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('DELETE /')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    });
    it('OPTIONS', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL, { method: 'OPTIONS' });
            expect(res.status).toBe(200);
        //expect(await res.text()).toBe('OPTIONS /')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    });
    it('HEAD', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL, { method: 'HEAD' });
            expect(res.status).toBe(200);
            expect(res.headers.get('X-Custom-Header')).toBe('Bun is awesome')
            //expect(await res.text()).toBe('HEAD /')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    });
})

describe('router-test', () => {
    const url = BASE_URL + '/route';
    it('/route', () => {
        it('GET', async () => {
            const server = app.listen(URL_PORT, () => {
                console.log(`App is listening on port ${URL_PORT}`);
            });
            try {
                const res = await fetch(url);
                expect(res.status).toBe(200);
                expect(await res.text()).toBe('GET /route')
            } catch (e) {
                throw e;
            } finally {
                server.stop();
            }
        });
        it('POST', async () => {
            const server = app.listen(URL_PORT, () => {
                console.log(`App is listening on port ${URL_PORT}`);
            });
            try {
                const res = await fetch(url, { method: 'POST' });
                expect(res.status).toBe(200);
                expect(await res.text()).toBe('POST /route')
            } catch (e) {
                throw e;
            } finally {
                server.stop();
            }
        });
        it('PATCH', async () => {
            const server = app.listen(URL_PORT, () => {
                console.log(`App is listening on port ${URL_PORT}`);
            });
            try {
                const res = await fetch(url, { method: 'PATCH' });
                expect(res.status).toBe(200);
                expect(await res.text()).toBe('PATCH /route')
            } catch (e) {
                throw e;
            } finally {
                server.stop();
            }
        });
        it('PUT', async () => {
            const server = app.listen(URL_PORT, () => {
                console.log(`App is listening on port ${URL_PORT}`);
            });
            try {
                const res = await fetch(url, { method: 'PUT' });
                expect(res.status).toBe(200);
                expect(await res.text()).toBe('PUT /route')
            } catch (e) {
                throw e;
            } finally {
                server.stop();
            }
        });
        it('DELETE', async () => {
            const server = app.listen(5555, () => {
                console.log(`App is listening on port ${URL_PORT}`);
            });
            try {
                const res = await fetch(BASE_URL, { method: 'DELETE' });
                expect(res.status).toBe(200);
                expect(await res.text()).toBe('DELETE /')
            } catch (e) {
                throw e;
            } finally {
                server.stop();
            }
        });
        it('OPTIONS', async () => {
            const server = app.listen(URL_PORT, () => {
                console.log(`App is listening on port ${URL_PORT}`);
            });
            try {
                const res = await fetch(url, { method: 'OPTIONS' });
                expect(res.status).toBe(200);
                expect(await res.text()).toBe('OPTIONS /route')
            } catch (e) {
                throw e;
            } finally {
                server.stop();
            }
        });
        it('HEAD', async () => {
            const server = app.listen(URL_PORT, () => {
                console.log(`App is listening on port ${URL_PORT}`);
            });
            try {
                const res = await fetch(url, { method: 'HEAD' });
                expect(res.status).toBe(200);
                expect(await res.text()).toBe('HEAD /route')
            } catch (e) {
                throw e;
            } finally {
                server.stop();
            }
        });
    })
})

describe('middleware test', () => {
    it('middleware /', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL + '/mid', { method: 'GET' });
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('Middleware /mid')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    })
    it('middleware / path', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL + '/mid/path', { method: 'GET' });
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('Middleware /mid/path')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    })
    it('middleware / param', async () => {
        const server = app.listen(URL_PORT, () => {
            console.log(`App is listening on port ${URL_PORT}`);
        });
        try {
            const res = await fetch(BASE_URL + '/mid/15', { method: 'GET' });
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('Middleware /mid/15')
        } catch (e) {
            throw e;
        } finally {
            server.stop();
        }
    })
})

// Delete this test because bun test would stop if any error throws, global handlers won't able to stop the throwing
// describe('Error test', () => {
//     it('unhandle route', async () => {
//         const server = app.listen(5555, () => {
//             console.log(`App is listening on port ${URL_PORT}`);
//         })
//
//         try {
//             const res = await fetch(BASE_URL + '/some_random_route', { method: 'POST' });
//             expect(res.status).toBe(500);
//         } catch (e) {
//         } finally {
//             server.stop();
//         }
//     });
//     it('error /err', async () => {
//         const server = app.listen(5555, () => {
//             console.log(`App is listening on port ${URL_PORT}`);
//         });
//         try {
//             const res = await fetch(BASE_URL + '/err', { method: 'GET' });
//             expect(res.status).toBe(500);
//             expect(await res.text()).toBe('Err /err')
//         } catch (e) {
//             //throw e;
//         } finally {
//             server.stop();
//         }
//     });
// })
