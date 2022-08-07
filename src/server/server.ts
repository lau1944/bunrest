import { Server } from "bun";
import { BunResponse } from "./response";
import { RequestMethod, Handler, Middleware } from "./request";
import { Router } from "../router/router";

export class BunServer implements RequestMethod {
    private readonly requestMap: Map<string, Handler> = new Map<string, Handler>();
    private readonly middlewareMap: Map<string, Middleware> = new Map<string, Middleware>();

    get(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "GET", handler, middleware);
    };

    put(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "PUT", handler, middleware);
    };

    post(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "POST", handler, middleware);
    };

    delete(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "DELETE", handler, middleware);
    };

    options(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "OPTIONS", handler, middleware);
    };

    use(path: string, router: Router) {
        router.use(path);
    }

    Router() {
        return new Router(this.requestMap, this.middlewareMap);
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
            development: process.env.NODE_ENV !== 'production',
            fetch(req) {
                const path = req.url.replace(baseUrl, '');
                const handler: Handler = that.requestMap.get(`${req.method}:${path}`);
                const middleware = that.middlewareMap.get(`${req.method}:${path}`);

                const res = new BunResponse();
                if (middleware) {
                    middleware.apply(null, [req, res]);
                }

                if (handler) {
                    handler.apply(null, [req, res]);
                }

                return res.getResponse();
            }
        });
    }

    private delegate(path: string, method: string, handler: Handler, middleware?: Middleware) {
        if (middleware) {
            this.middlewareMap.set(`${method}:${path}`, middleware);
        }
        this.requestMap.set(`${method}:${path}`, handler);
    }
}