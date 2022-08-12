import { Server } from "bun";
import { BunResponse } from "./response";
import { RequestMethod, Handler, Middleware, MiddlewareFunc } from "./request";
import { Router } from "../router/router";
import { Chain } from "../utils/chain";

export class BunServer implements RequestMethod {
    private readonly requestMap: Map<string, Handler> = new Map<string, Handler>();
    private readonly middlewares: Middleware[] = [];
    private readonly errorHandlers: Handler[] = [];

    get(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "GET", handler, middleware);
    };

    put(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "PUT", handler, middleware);
    };

    post(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "POST", handler, middleware);
    };

    delete(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "DELETE", handler, middleware);
    };

    options(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "OPTIONS", handler, middleware);
    };

    /**
     * Add middleware
     * @param middleware 
     */
    use(middleware: Handler): void;

    /**
     * Attach router
     * @param path 
     * @param router 
     */
    use(path: string, router: Router): void;

    /**
     * Attch middleware or router or global error handler
     * @param arg1 
     * @param arg2 
     */
    use(arg1: string | Handler, arg2?: Router) {
        // pass router
        if (arg2 && typeof arg1 === "string") {
            arg2.attach(arg1);
        }

        // pass middleware or global error handler
        else {
            if (arg1.length == 3) {
                this.middlewares.push({
                    path: "/",
                    middlewareFunc: arg1 as Handler,
                });
            }

            else if (arg1.length == 4) {
                this.errorHandlers.push(arg1 as Handler);
            }
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
        var res = new BunResponse();
        return Bun.serve({
            port,
            development: process.env.SERVER_ENV !== "production",
            fetch(req) {
                const path = req.url.replace(baseUrl, "");
                const handler: Handler = that.requestMap.get(`${req.method}:${path}`);

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
                    handler.apply(that, [req, res]);
                }

                return res.getResponse();
            },
            error(err: Error) {
                // basically, next here is to ignore the error
                const next = () => {}
                that.errorHandlers.forEach((handler) => {
                    // * no request object pass to error handler 
                    handler.apply(that, [null, res, err, next]);
                });
                
                if (res.isReady()) {
                    return res.getResponse();
                }
            }
        });
    }

    private delegate(path: string, method: string, handler: Handler, middleware?: Handler) {
        if (middleware) {
            this.middlewares.push({
                path: `${method}:${path}`,
                middlewareFunc: middleware,
            });
        }
        this.requestMap.set(`${method}:${path}`, handler);
    }
}