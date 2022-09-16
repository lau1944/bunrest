import { SSLServeOptions } from "bun";
import { BunResponse } from "./response";

export type Handler = (
  req: BunRequest,
  res: BunResponse,
  next?: (err?: Error) => {},
  err?: Error
) => void;

export type MiddlewareFunc = (
  req: Request,
  res: BunResponse,
  next: (err?: Error) => {}
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

export interface SSLOptions {
  keyFile: string;
  certFile: string;
  passphrase?: string;
  caFile?: string;
  dhParamsFile?: string;

  /**
   * This sets `OPENSSL_RELEASE_BUFFERS` to 1.
   * It reduces overall performance but saves some memory.
   * @default false
   */
  lowMemoryMode?: boolean;
}
