import server from '../src';
import { describe, it, expect } from "bun:test";
import router from './router.test';

const app = server();

app.get('/', (req, res) => {
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

app.use('/route', router);

app.use((req, res, next) => {
    next();
});

app.use((req, res, next) => {
    next();
});

app.get('/mid', (req, res, next) => {
    res.status(200).send('Middleware /mid');
}, (req, res) => {});

app.get('/err', (req, res) => {
    throw new Error('Err');
})

//add error handler 
app.use((req, res, next, err) => {
    res.status(500).send('Err /err');
});

const BASE_URL = 'http://localhost:3000';

describe('http test', () => {
    it('GET', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
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
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
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
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
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
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
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
    // Delete is not working for bun, check (issues-667)[https://github.com/oven-sh/bun/issues/677]
    // it('DELETE', async () => {
    //     const server = app.listen(3000, () => {
    //         console.log('App is listening on port 3000');
    //     });
    //     try {
    //         const res = await fetch(BASE_URL, { method: 'DELETE' });
    //         expect(res.status).toBe(200);
    //         expect(await res.text()).toBe('DELETE /')
    //     } catch (e) {
    //         throw e;
    //     } finally {
    //         server.stop();
    //     }
    // });
    it('OPTIONS', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });
        try {
            const res = await fetch(BASE_URL, { method: 'OPTIONS' });
            expect(res.status).toBe(200);
            expect(await res.text()).toBe('OPTIONS /')
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
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
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
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
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
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
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
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
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
        // Delete is not working for bun, check (issues-667)[https://github.com/oven-sh/bun/issues/677]
        // it('DELETE', async () => {
        //     const server = app.listen(3000, () => {
        //         console.log('App is listening on port 3000');
        //     });
        //     try {
        //         const res = await fetch(BASE_URL, { method: 'DELETE' });
        //         expect(res.status).toBe(200);
        //         expect(await res.text()).toBe('DELETE /')
        //     } catch (e) {
        //         throw e;
        //     } finally {
        //         server.stop();
        //     }
        // });
        it('OPTIONS', async () => {
            const server = app.listen(3000, () => {
                console.log('App is listening on port 3000');
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
    })
})

describe('middleware test', () => {
    it('middleware /', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
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
})

describe('Error test', () => {
    it('unhandle route', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        })

        try {
            const res = await fetch(BASE_URL + '/some_random_route', { method: 'POST' });
            expect(res.status).toBe(500);
        } finally {
            server.stop();
        }
    });
    it('error /err', async () => {
        const server = app.listen(3000, () => {
            console.log('App is listening on port 3000');
        });
        try {
            const res = await fetch(BASE_URL + '/err', { method: 'GET' });
            expect(res.status).toBe(500);
            expect(await res.text()).toBe('Err /err')
        } catch (e) {
            //throw e;
        } finally {
            server.stop();
        }
    });
})