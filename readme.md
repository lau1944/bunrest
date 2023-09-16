<p align="center">
  <a href="https://bun.sh"><img src="https://img.icons8.com/external-victoruler-flat-victoruler/344/external-baozi-chinese-new-year-victoruler-flat-victoruler.png" alt="Logo" height=200></a>
  <br />
</p>

# 🧄 bunrest

[![NPM Version][npm-version-image]][npm-url]
[![CodeFactor](https://www.codefactor.io/repository/github/lau1944/bunrest/badge/main)](https://www.codefactor.io/repository/github/lau1944/bunrest/overview/main)
![NPM Downloads][npm-downloads-image]

## What is bunrest  👀

### bunrest is an ExpressJs-like API for [bun](https://github.com/oven-sh/bun) http server.

## Features

1. ⚡ BLAZING FAST. Bun is super fast...

2.   0️⃣   dependencies, work seamlessly with Bun

3.   0️⃣   learning curve. If you know ExpressJs, you can start a bun server.

## Table of Contents

- [Set up](#get-started)
- [Usage](#usage)
- [Router](#router)
- [Middlewares](#middlewares)
- [Error handling](#error-handling)
- [Request and Response object](#request-and-response-object)
- [Websocket](#websocket)


### Get started

To download bun

```shell
curl -fsSL https://bun.sh/install | bash
```

To create a bun project 

```shell
bun init
```

This will create a blank bun project

see reference [here](https://github.com/oven-sh/bun#bun-create)

### Server set up

Download the package

```shell
bun install bunrest
```


```js
import server from "bunrest";
const app = server();
```

### Usage 

After that, you can write http method just like on `express`

```js
app.get('/test', (req, res) => {
  res.status(200).json({ message: req.query });
});

app.put('/test/:id', (req, res) => {
  res.status(200).json({ message: req.params.id });
});

app.post('/test/:id/:name', (req, res) => {
  res.status(200).json({ message: req.params });
});
```

### Router
The same as above, we create a router by calling `server.Router()`

After creation, we attach the router to server by calling `server.use(your_router_reference)`

```js
// add router
const router = app.router();

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Router succeed' });
})

router.post('/test', (req, res) => {
  res.status(200).json({ message: 'Router succeed' });
})

router.put('/test', (req, res) => {
  res.status(200).json({ message: 'Router succeed' });
})

app.use('/your_route_path', router);
```

### Middlewares

We have two ways to add middlewares

1. `use` : Simply call `use` to add the middleware function.

2. Add middleware at the middle of your request function parameters.

```js
// use
app.use((req, res, next) => {
  console.log("middlewares called");
  // to return result
  res.status(500).send("server denied");
});

app.use((req, res, next) => {
  console.log("middlewares called");
  // to call next middlewares
  next();
})

// or you can add the middlewares this way
app.get('/user', 
    (req, res, next) => {
      // here to handle middleware for path '/user'
    },
    (req, res) => {
      res.status(200).send('Hello');
    });
```

### Error handling

To add a global handler, it's really similar to express but slightly different. The fourth argument is the error object, but I only get `[native code]` from error object, this might related to bun.

```js
app.use((req, res, next, err) => {
    res.status(500).send('Error happened');
 });

```

At this time, if we throw an error on default path `/`

```js
app.get('/', (req, res) => {
  throw new Error('Oops');
})
```

It will call the `error handler callback function` and return a `response`. 
But if we have not specified a `response` to return, a `error page` will be displayed on the browser on debug mode, check more on [bun error handling](https://github.com/oven-sh/bun#error-handling)


### Start the server, listen to port

```js
app.listen(3000, () => {
  console.log('App is listening on port 3000');
});
```

<br />

### Request and Response object

To simulate the `ExpressJs` API, the default `request` and `response` object on `bunjs` is not ideal.

On `bunrest`, we create our own `request` and `response` object, here is the blueprint of these two objects.


Request interface

```js
export interface BunRequest {
  method: string;
  request: Request;
  path: string;
  header?: { [key: string]: any };
  params?: { [key: string]: any };
  query?: { [key: string]: any };
  body?: { [key: string]: any };
  blob?: any;
}
```

Response interface
```js
export interface BunResponse {
    status(code: number): BunResponse;
    option(option: ResponseInit): BunResponse;
    statusText(text: string): BunResponse;
    json(body: any): void;
    send(body: any): void;
    // nodejs way to set headers
    setHeader(key: string, value: any);
    // nodejs way to get headers
    getHeader();this.options.headers;
    headers(header: HeadersInit): BunResponse;
    getResponse(): Response;
    isReady(): boolean;turn !!this.response;
}
```

The `req` and `res` arguments inside every handler function is with the type of `BunRequest` and `BunResponse`.

So you can use it like on Express

```js
const handler = (req, res) => {
  const { name } = req.params;
  const { id } = req.query;
  res.setHeader('Content-Type', 'application/text');
  res.status(200).send('No');
}
```

# websocket

<br> To handle websocket request, just a few steps to do </br>

```js
app.ws((ws, msg) => {
   // here to handle incoming message
    ws.send(msg)
}, {
    open: (ws) => {
        console.log('Websocket is turned on')
    }, close: (ws) => {
        console.log('Websocket is closed')
    }, drain: (ws) => {
        console.log('Websocket is drained')
    }
})
```

<br> To connect to your websocket server </br>

```js
const socket = new WebSocket("ws://localhost:3000");
            const msg = 'Hello world'
            // message is received
            socket.addEventListener("message", event => {
                console.log(event.data)
            });

            // socket opened
            socket.addEventListener("open", event => {
                console.log('Open')
                // here to send message
                socket.send(msg)
            });

            // socket closed
            socket.addEventListener("close", event => {
                console.log('Close')
            });

            // error handler
            socket.addEventListener("error", event => {
                console.log('Error')
            });
```

[npm-url]: https://www.npmjs.com/package/bunrest
[npm-version-image]: https://badgen.net/npm/v/bunrest
[npm-downloads-image]: https://badgen.net/npm/dm/bunrest
