### bunrest

[![NPM Version][npm-version-image]][npm-url]


### bunrest is a express like api for [bun](https://github.com/oven-sh/bun) http server 

So you don't have to learn bun to create a http server.

`This project is only experimental, DO NOT use it on production`

## Get started

To create a bun project, see reference [here](https://github.com/oven-sh/bun#bun-create)

### Server set up

```js
const App = require('bunrest');
const server = new App.BunServer();
```

After that, you can call http method just like on `express`

```js
server.get('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});

server.put('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});

server.post('/test', (req, res) => {
  res.status(200).json({ message: 'succeed' });
});
```

### Router

```js
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

server.use('/your_route_path', router);
```

### Middlewares
```js
server.use((req, res, next) => {
  console.log("middlewares called");
  // to return result
  res.status(500).send("server denied");
});

server.use((req, res, next) => {
  console.log("middlewares called");
  // to call next middlewares
  next();
})

// or you can add the middlewares this way
server.get('/user', 
    (req, res) => { /** handle request **/ }, 
    (req, res, next) => {
      /**
       *  Handle middlewares
       * */
    });

// you can add middlewares on router too
router.get('/user', 
    (req, res) => { /** handle request **/ }, 
    (req, res, next) => {
      /**
       *  Handle middlewares
       * */
    }); 
```

### Start the server, listen to port

```js
server.listen(3000, () => {
  console.log('App is listening on port 3000');
});
```

### Next

Server rendering, websocket

[npm-url]: https://www.npmjs.com/package/bunrest
[npm-version-image]: https://badgen.net/npm/v/bunrest
