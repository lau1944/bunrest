export type Handler = (req: Request, res: Response) => Response;

export type Middleware = (req: Request, res: Response, next) => Response | undefined;

export type RequestHandler = (path: string, handler: Handler, middleware?: Middleware) => void;

export interface RequestMethod {
    get: RequestHandler;
    post: RequestHandler;
    put: RequestHandler;
    delete: RequestHandler;
    options: RequestHandler;
}