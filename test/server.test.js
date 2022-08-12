const App = require('../index');

const server = new App.BunServer();

server.get('/', (req, res) => {
    console.log('call get /')
    res.status(200).send('Succeed');
});
//add error handler 
// server.use((req, res, err, next) => {
//     //next()
//     res.status(500).send('Error happened');
// });

server.get('/test', (req, res, next) => {
    console.log('get');
    //next();
}, (req, res) => {
    //throw new Error('error test');
    res.status(200).json({ message: 'succeed' });
});

server.put('/', (req, res, next) => {
    console.log('put');
}, (req, res) => {
    res.status(200).json({ message: 'succeed' });
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
    console.log('hello world22');
    next();
    //res.status(200).json('You got intercepted2!');
});

// add router
const router = server.Router();

router.get('/test', (req, res, next) => {
    console.log('middleware on /test called');
}, (req, res) => {
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