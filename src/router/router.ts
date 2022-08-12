import { Handler, Middleware, RequestMethod } from "../server/request";

export type RouterMeta = {
    globalPath: string,
    request: Map<String, Handler>;
    middlewares: Map<String, Middleware>;
};

export class Router implements RequestMethod {
    private readonly requestMap: Map<string, Handler>;
    private readonly middlewares: Middleware[];
    private localRequestMap: Map<string, Handler> = new Map<string, Handler>();
    private localMiddlewares: Middleware[] = [];

    constructor(requestMap: Map<string, Handler>, middlewares: Middleware[]) {
        this.requestMap = requestMap;
        this.middlewares = middlewares;
    }

    get(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "GET", handler, middleware);
    }

    post(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "POST", handler, middleware);
    };

    put(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "PUT", handler, middleware);
    };

    delete(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "DELETE", handler, middleware);
    };

    use(middleware: Handler) {
        this.localMiddlewares.push({
            path: "/",
            middlewareFunc: middleware,
        });
    }

    attach(globalPath: string) {
        this.localMiddlewares.forEach((mid) => {
            const temp: string[] = mid.path.split(":");
            const newPath = globalPath + temp[1];
            const newKey = `${temp[0]}:${newPath}`
            this.middlewares.push({
                path: newKey,
                middlewareFunc: mid.middlewareFunc,
            });
        });
        // iterate request map
        this.localRequestMap.forEach((value, key) => {
            const temp: string[] = key.split(":");
            const newPath = globalPath + temp[1];
            const newKey = `${temp[0]}:${newPath}`
            this.requestMap.set(newKey, value);
        });
    }

    options(path: string, handler: Handler, middleware?: Handler) {
        this.delegate(path, "OPTIONS", handler, middleware);
    };

    private delegate(localPath: string, method: string, handler: Handler, middleware?: Handler) {
        if (middleware) {
            this.localMiddlewares.push({
                path: `${method}:${localPath}`,
                middlewareFunc: middleware
            });
        }
        this.localRequestMap.set(`${method}:${localPath}`, handler);
    }
}