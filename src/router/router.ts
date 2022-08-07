import { Handler, Middleware, RequestMethod } from "../server/request";

export type RouterMeta = {
    globalPath: string,
    request: Map<String, Handler>;
    middlewares: Map<String, Middleware>;
};

export class Router implements RequestMethod {
    private readonly requestMap: Map<string, Handler>;
    private readonly middlewareMap: Map<string, Middleware>;
    private localRequestMap: Map<string, Handler> = new Map<string, Handler>();
    private localMiddlewareMap: Map<string, Middleware> = new Map<string, Middleware>();

    constructor(requestMap: Map<string, Handler>, middlewareMap: Map<string, Middleware>) {
        this.requestMap = requestMap;
        this.middlewareMap = middlewareMap;
    }

    get(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "GET", handler, middleware);
    }

    post(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "POST", handler, middleware);
    };

    put(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "PUT", handler, middleware);
    };

    delete(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "DELETE", handler, middleware);
    };

    use(globalPath: string) {
        // iterate middlewares
        this.localMiddlewareMap.forEach((value, key) => {
            const temp: string[] = key.split(":");
            const newPath = globalPath + temp[1];
            const newKey = `${temp[0]}:${newPath}`
            this.middlewareMap.set(newKey, value);
        });
        // iterate request map
        this.localRequestMap.forEach((value, key) => {
            const temp: string[] = key.split(":");
            const newPath = globalPath + temp[1];
            const newKey = `${temp[0]}:${newPath}`
            this.requestMap.set(newKey, value);
        });
    }

    options(path: string, handler: Handler, middleware?: Middleware) {
        this.delegate(path, "OPTIONS", handler, middleware);
    };

    private delegate(localPath: string, method: string, handler: Handler, middleware?: Middleware) {
        if (middleware) {
            this.localMiddlewareMap.set(`${method}:${localPath}`, middleware);
        }
        this.localRequestMap.set(`${method}:${localPath}`, handler);
    }
}