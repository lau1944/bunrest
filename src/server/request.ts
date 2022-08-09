import { BunResponse } from "./response";

export type Handler = (req: Request, res: BunResponse) => void;

export type MiddlewareFunc = (req: Request, res: BunResponse, next: Function) => void;

export type RequestHandler = (path: string, handler: Handler, middleware?: MiddlewareFunc) => void;

export type Middleware = {
    path: string;
    middlewareFunc: MiddlewareFunc;
}

export interface RequestMethod {
    get: RequestHandler;
    post: RequestHandler;
    put: RequestHandler;
    delete: RequestHandler;
    options: RequestHandler;
}