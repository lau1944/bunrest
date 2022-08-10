import { Server } from "bun";
import { BunResponse } from "./response";
import { RequestMethod, Handler, Middleware, MiddlewareFunc } from "./request";
import { Router } from "../router/router";
import { Chain } from "../utils/chain";

export class BunServer implements RequestMethod {
    private readonly requestMap: Map<string, Handler> = new Map<string, Handler>();
    private readonly middlewares: Middleware[] = [];

    get(path: string, handler: Handler, middleware?: MiddlewareFunc) {
        this.delegate(path, "GET", handler, middleware);
    };

    put(path: string, handler: Handler, middleware?: MiddlewareFunc) {
        this.delegate(path, "PUT", handler, middleware);
    };

    post(path: string, handler: Handler, middleware?: MiddlewareFunc) {
        this.delegate(path, "POST", handler, middleware);
    };

    delete(path: string, handler: Handler, middleware?: MiddlewareFunc) {
        this.delegate(path, "DELETE", handler, middleware);
    };

    options(path: string, handler: Handler, middleware?: MiddlewareFunc) {
        this.delegate(path, "OPTIONS", handler, middleware);
    };

    use(middleware: MiddlewareFunc): void;

    use(path: string, router: Router): void;

    use(arg1: string | MiddlewareFunc, arg2?: Router) {
        // pass router
        if (arg2 && typeof arg1 === "string") {
            arg2.use(arg1);
        }

        // pass middleware
        else {
            this.middlewares.push({
                path: "/",
                middlewareFunc: arg1 as MiddlewareFunc,
            })
        }
    }

    Router() {
        return new Router(this.requestMap, this.middlewares);
    }

    listen(port: string | number, callback?: () => void): Server {
        const baseUrl = "http://localhost:" + port;
        callback?.call(null);
        return this.openServer(port, baseUrl);
    }

    private openServer(port: string | number, baseUrl: string): Server {
        const that = this;
        return Bun.serve({
            port,
            development: process.env.NODE_ENV !== "production",
            fetch(req) {
                const path = req.url.replace(baseUrl, "");
                const handler: Handler = that.requestMap.get(`${req.method}:${path}`);

                var bunResponse = new BunResponse();
                const res = new Proxy(bunResponse, {
                    get(target, prop, receiver) {
                        if (typeof target[prop] === 'function'
                            && (prop === 'json' || prop === 'send')
                            && target.isReady()) {
                            throw new Error('You cannot send response twice');
                        } else {
                            return Reflect.get(target, prop, receiver);
                        }
                    }
                });

                if (that.middlewares.length !== 0) {
                    var plainMid = that.middlewares.filter((mid) => (mid.path === '/'));
                    const chain = new Chain(req, res, plainMid);
                    chain.next();

                    if (res.isReady()) {
                        return res.getResponse();
                    }

                    if (!chain.isFinish()) {
                        throw new Error('Please call next() at the end of your middleware');
                    }
                }

                var middlewares = [];
                for (var i = that.middlewares.length - 1; i >= 0; --i) {
                    const target = that.middlewares[i];
                    if (target.path === '/') {
                        continue;
                    }

                    if (target.path === `${req.method}:${path}`) {
                        middlewares.push(target);
                        break;
                    }
                }

                if (middlewares.length !== 0) {
                    const chain = new Chain(req, res, middlewares);
                    chain.next();

                    if (res.isReady()) {
                        return res.getResponse();
                    }

                    if (!chain.isFinish()) {
                        throw new Error('Please call next() at the end of your middleware');
                    }
                }

                if (handler) {
                    handler.apply(null, [req, res]);
                }

                return res.getResponse();
            }
        });
    }

    private delegate(path: string, method: string, handler: Handler, middleware?: MiddlewareFunc) {
        if (middleware) {
            this.middlewares.push({
                path: `${method}:${path}`,
                middlewareFunc: middleware,
            });
        }
        this.requestMap.set(`${method}:${path}`, handler);
    }
}