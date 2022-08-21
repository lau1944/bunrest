import { BunResponse } from "./response";

export type Handler = (
  req: BunRequest,
  res: BunResponse,
  next?: (err: Error) => {},
  err?: Error
) => void;

export type MiddlewareFunc = (
  req: Request,
  res: BunResponse,
  next: (err: Error) => {},
) => void;

export type RequestHandler = (path: string, ...handlers: Handler[]) => void;

export type Middleware = {
  path: string;
  middlewareFunc: Handler;
};

export interface RequestMethod {
  get: RequestHandler;
  post: RequestHandler;
  put: RequestHandler;
  delete: RequestHandler;
  options: RequestHandler;
}

export interface BunRequest {
  method: string;
  request: Request;
  path: string;
  headers?: { [key: string]: any };
  params?: { [key: string]: any };
  query?: { [key: string]: any };
  body?: { [key: string]: any };
  blob?: any;
}
