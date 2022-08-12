# 🧄 bunrest

[![NPM Version][npm-version-image]][npm-url]

## What is bunrest  👀

### bunrest is a ExpressJs like api for [bun](https://github.com/oven-sh/bun) http server.

## Features

1. ⚡ BLAZING FAST. Bun is super fast...

2. 0️⃣ dependencies, work seamlessly with Bun

3. 0️⃣ learning curve. If you know ExpressJs, you can start a bun server.

`This project is only experimental, DO NOT use it on production`

## Table of Contents

- [Set up](#get-started)
- [Usage](#usage)
- [Router](#router)
- [Middlewares](#middlewares)
- [Error handling](#error-handling)
- [Future](#next)


### Get started

To download bun

```shell
curl -fsSL https://bun.sh/install | bash
```

To create a bun project 

see reference [here](https://github.com/oven-sh/bun#bun-create)

### Server set up

```js
const App = require('bunrest');
const server = App.Server();
```

### Usage 

After that, you can write http method just like on `express`

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
The same as router, we create a router by calling `server.Router()`

After creation, we attach the router to server by calling `server.use(your_router_reference)`

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

We have two ways to add middlewares

1. `use` : Simply call `use` to add the middleware function.

2. Add middleware at the middle of your request function parameters.

```js
// use
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
    (req, res, next) => {
      // here to handle middleware for path '/user'
    },
    (req, res) => {
      res.status(200).send('Hello');
    });
```

### Error handling

To add a global handler, it's really similar to express but slightly different.

```js
server.use((req, res, err, next) => {
    res.status(500).send('Error happened');
 });

```

At this time, if we throw an error on default path `/`

```js
server.get('/', (req, res) => {
  throw new Error('Oops');
})
```

It will call the `error handler callback function` and return a `response`. 
But if we have not specified a `response` to return, a `error page` will be displayed on the browser on debug mode, check more on [bun error handling](https://github.com/oven-sh/bun#error-handling)


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