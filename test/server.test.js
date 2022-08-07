const App = require('../index');

const server = new App.BunServer();

server.get('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});

server.put('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});

server.post('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});

server.delete('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});

server.options('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});

// add router
const router = server.Router();

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Router succeed' });
})

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