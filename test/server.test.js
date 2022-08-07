const App = require('../index');

const server = new App.BunServer();

server.get('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});

server.listen(3000, () => {
  console.log('App is listening on port 3000');
});