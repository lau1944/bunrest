import Server from '../index';

const app = Server();

app.post('/user', (req, res) => {
    res.status(200).json(req.query);
})

app.listen(3000, () => {
    console.log('Running on port 3000');
})