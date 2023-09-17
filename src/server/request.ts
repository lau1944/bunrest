import { BunResponse } from "./response";
import { TrieTree } from "./trie-tree";

export type Handler = (
  req: BunRequest,
  res: BunResponse,
  next?: (err?: Error) => {},
  err?: Error
) => void | Promise<any>;

export type MiddlewareFunc = (
  req: Request,
  res: BunResponse,
  next: (err?: Error) => {}
) => void;

export type RequestMethodType = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export type RequestHandler = (path: string, ...handlers: Handler[]) => void;

export type Middleware = {
  path: string;
  middlewareFunc: Handler;
};

export interface RequestMethod {
  get: RequestHandler;
  post: RequestHandler;
  patch: RequestHandler;
  put: RequestHandler;
  delete: RequestHandler;
  options: RequestHandler;
  head: RequestHandler;
}

export interface BunRequest {
  method: string;
  request: Request;
  path: string;
  headers?: { [key: string]: any };
  params?: { [key: string]: any };
  query?: { [key: string]: any };
  body?: { [key: string]: any } | string | undefined;
  blob?: any;
  originalUrl: string;
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

/**
 * request method mapper
 */
export interface RequestMapper {
  get?: TrieTree<string, Handler>;
  post?: TrieTree<string, Handler>;
  patch?: TrieTree<string, Handler>;
  put?: TrieTree<string, Handler>;
  delete?: TrieTree<string, Handler>;
  options?: TrieTree<string, Handler>;
  head?: TrieTree<string, Handler>;
}

export interface RequestTuple {
  path: string;
  handler: Handler;
}

/**
 * Router method mapper
 */
export interface RouteRequestMapper {
  get?: Array<RequestTuple>;
  post?: Array<RequestTuple>;
  patch?: Array<RequestTuple>;
  put?: Array<RequestTuple>;
  delete?: Array<RequestTuple>;
  options?: Array<RequestTuple>;
  head?: Array<RequestTuple>;
}

export type RequestMapFunc = (method: string, path: string, handler: Handler) => void
