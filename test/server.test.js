const App = require('../index');

const server = new App.BunServer();

server.get('/', (req, res) => {
    res.status(200).json({ message: 'succeed' });
}, (req, res, next) => {
    console.log('get');
    next();
});

server.put('/', (req, res) => {
    res.status(200).json({ message: 'succeed' });
}, (req, res, next) => {
    console.log('put');
});

server.post('/', (req, res) => {
    res.status(200).json({ message: 'succeed' });
});

server.delete('/', (req, res) => {
    res.status(200).json({ message: 'succeed' });
});

server.options('/', (req, res) => {
    res.status(200).json({ message: 'succeed' });
});

server.use((req, res, next) => {
    console.log('hello world1');
    //res.status(200).json('You got intercepted1!');
    next()
});

server.use((req, res, next) => {
    console.log('hello world2');
    //res.status(200).json('You got intercepted2!');
});

// add router
const router = server.Router();

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Router succeed' });
});

router.post('/test', (req, res) => {
    res.status(200).json({ message: 'Router succeed' });
})

router.put('/test', (req, res) => {
    res.status(200).json({ message: 'Router succeed' });
})

router.delete('/test', (req, res) => {
    res.status(200).json({ message: 'Router succeed' });
})

router.options('/test', (req, res) => {
    res.status(200).json({ message: 'Router succeed' });
})

server.use('/router', router);

server.listen(3000, () => {
    console.log('App is listening on port 3000');
});