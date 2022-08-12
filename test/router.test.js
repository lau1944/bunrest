const App = require('../index');

const server = App.Server();

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

module.exports = router;