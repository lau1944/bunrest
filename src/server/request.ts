import { BunResponse } from "./response";

export type Handler = (req: Request, res: BunResponse, err?: Error, next?: () => {}) => void;

export type MiddlewareFunc = (req: Request, res: BunResponse, next: Function) => void;

export type RequestHandler = (path: string, handler: Handler, middleware?: Handler) => void;

export type Middleware = {
    path: string;
    middlewareFunc: Handler;
}

export interface RequestMethod {
    get: RequestHandler;
    post: RequestHandler;
    put: RequestHandler;
    delete: RequestHandler;
    options: RequestHandler;
}