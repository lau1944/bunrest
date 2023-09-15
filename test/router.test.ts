import Server from '../src';

const app = Server();
const router = app.router();

router.get('/', (req, res) => {
    res.status(200).send('GET /route')
})

router.post('/', (req, res) => {
    res.status(200).send('POST /route')
})

router.patch('/', (req, res) => {
    res.status(200).send('PATCH /route')
})

router.put('/', (req, res) => {
    res.status(200).send('PUT /route')
})

router.delete('/', (req, res) => {
    res.status(200).send('DELETE /route')
})

router.options('/', (req, res) => {
    res.status(200).send('OPTIONS /route')
})

router.head('/', (req, res) => {
    res.status(200).send('HEAD /route')
})

export default router;
