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

    get(path: string, ...handlers: Handler[]) {
        this.delegate(path, "GET", handlers);
    }

    post(path: string, ...handlers: Handler[]) {
        this.delegate(path, "POST", handlers);
    }

    put(path: string, ...handlers: Handler[]) {
        this.delegate(path, "PUT", handlers);
    }

    delete(path: string, ...handlers: Handler[]) {
        this.delegate(path, "DELETE", handlers);
    }

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

    options(path: string, ...handlers: Handler[]) {
        this.delegate(path, "OPTIONS", handlers);
    }

    private delegate(localPath: string, method: string, handlers: Handler[]) {
        const path = `${method}:${localPath}`;
        for (let i = 0; i < handlers.length; ++i) {
            const handler = handlers[i];
            if (i == handlers.length - 1) {
                this.localRequestMap.set(path, handler);
                break;
            }

            this.localMiddlewares.push({
                path: path,
                middlewareFunc: handler,
            });
        }
    }
}