import { Server } from "bun";
import { BunResponse } from "./response";

type Middleware = (req: Request, res: Response, next) => Response | undefined;

type Handler = (req: Request, res: Response) => Response;

type RequestHandler = (path: string, handler: Handler, middleware?: Middleware) => void;

interface RequestMethod {
    get: RequestHandler;
    post: RequestHandler;
    put: RequestHandler;
    delete: RequestHandler;
    options: RequestHandler;
}

export class BunServer implements RequestMethod {
    private readonly requestMap: Map<String, Handler> = new Map<String, Handler>();
    private readonly middielwareMap: Map<String, Middleware> = new Map<String, Middleware>();

    get(path: string, handler: Handler, middleware?: Middleware) {
        if (middleware) {
            this.middielwareMap.set(`GET:${path}`, middleware);
        }
        this.requestMap.set(`GET:${path}`, handler);
    };

    put(path: string, handler: Handler, middleware?: Middleware) {
        if (middleware) {
            this.middielwareMap.set(`PUT:${path}`, middleware);
        }
        this.requestMap.set(`PUT:${path}`, handler);
    };

    post(path: string, handler: Handler, middleware?: Middleware) {
        if (middleware) {
            this.middielwareMap.set(`POST:${path}`, middleware);
        }
        this.requestMap.set(`POST:${path}`, handler);
    };

    delete(path: string, handler: Handler, middleware?: Middleware) {
        if (middleware) {
            this.middielwareMap.set(`DELETE:${path}`, middleware);
        }
        this.requestMap.set(`DELETE:${path}`, handler);
    };

    options(path: string, handler: Handler, middleware?: Middleware) {
        if (middleware) {
            this.middielwareMap.set(`OPTIONS:${path}`, middleware);
        }
        this.requestMap.set(`OPTIONS:${path}`, handler);
    };


    listen(port: string | number, callback?: () => void): Server {
        const baseUrl = "http://localhost:" + port;
        const that = this;
        callback?.call(null);
        return Bun.serve({
            port,
            development: process.env.NODE_ENV !== 'production',
            fetch(req) {
                const path = req.url.replace(baseUrl, '');
                const handler: Handler = that.requestMap.get(`${req.method}:${path}`);
                const middleware = that.middielwareMap.get(`${req.method}:${path}`);

                const res = new BunResponse();
                if (middleware) {
                    middleware.apply(null, [req, res]);
                }

                if (handler) {
                    handler.apply(null, [req, res]);
                }

                return res.getResponse();
            }
        })
    }
}