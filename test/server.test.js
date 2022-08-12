const App = require('../index');
const router = require('./router.test');

const server = App.Server();

server.get('/', (req, res) => {
    console.log('call get /')
    res.status(200).send('Succeed');
});
//add error handler 
// server.use((req, res, err, next) => {
//     //next()
//     res.status(500).send('Error happened');
// });

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

// server.use((req, res, next) => {
//     console.log('hello world1');
//     //res.status(200).json('You got intercepted1!');
//     next()
// });

// server.use((req, res, next) => {
//     console.log('hello world22');
//     next();
//     //res.status(200).json('You got intercepted2!');
// });

server.use('/router', router);

server.listen(3000, () => {
    console.log('App is listening on port 3000');
});