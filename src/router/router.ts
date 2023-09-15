import {
  Handler,
  Middleware,
  RequestMapFunc,
  RequestMapper,
  RequestMethod,
  RequestTuple,
  RouteRequestMapper,
} from "../server/request";
import path from "path";
// import { encodeBase64 } from "../utils/base64";

export type RouterMeta = {
  globalPath: string;
  request: Map<String, Handler>;
  middlewares: Map<String, Middleware>;
};

export class Router implements RequestMethod {
  private readonly requestMap: RequestMapper;
  private readonly middlewares: Middleware[];
  private readonly requestMapFunc: RequestMapFunc;
  private localRequestMap: RouteRequestMapper = {};
  private localMiddlewares: Middleware[] = [];

  constructor(requestMap: RequestMapper, middlewares: Middleware[], requestMapFunc: RequestMapFunc) {
    this.requestMap = requestMap;
    this.requestMapFunc = requestMapFunc;
    this.middlewares = middlewares;
  }

  get(path: string, ...handlers: Handler[]) {
    this.delegate(path, "GET", handlers);
  }

  post(path: string, ...handlers: Handler[]) {
    this.delegate(path, "POST", handlers);
  }

  patch(path: string, ...handlers: Handler[]) {
    this.delegate(path, "PATCH", handlers);
  }

  put(path: string, ...handlers: Handler[]) {
    this.delegate(path, "PUT", handlers);
  }

  delete(path: string, ...handlers: Handler[]) {
    this.delegate(path, "DELETE", handlers);
  }

  head(path: string, ...handlers: Handler[]) {
    this.delegate(path, "HEAD", handlers);
  }

  use(middleware: Handler) {
    this.localMiddlewares.push({
      path: "/",
      middlewareFunc: middleware,
    });
  }

  attach(globalPath: string) {
    this.localMiddlewares.forEach((mid) => {
      this.middlewares.push({
        path: path.join(globalPath, mid.path),
        middlewareFunc: mid.middlewareFunc,
      });
    });

    for (const k in this.localRequestMap) {
      const method = k;
      const reqArr: Array<RequestTuple> = this.localRequestMap[k];
      reqArr.forEach((v, _) => {
        this.requestMapFunc.apply(this, [method, path.join(globalPath, v.path), v.handler]);
      });
    }
  }

  options(path: string, ...handlers: Handler[]) {
    this.delegate(path, "OPTIONS", handlers);
  }

  private delegate(localPath: string, method: string, handlers: Handler[]) {
    for (let i = 0; i < handlers.length; ++i) {
      const handler = handlers[i];
      if (i == handlers.length - 1) {
        this.submitToMap(method.toLowerCase(), localPath, handler);
        break;
      }

      this.localMiddlewares.push({
        path: localPath,
        middlewareFunc: handler,
      });
    }
  }

  private submitToMap(method: string, path: string, handler: Handler) {
    let targetMap: RequestTuple[] = this.localRequestMap[method];
    if (!targetMap) {
      this.localRequestMap[method] = [];
      targetMap = this.localRequestMap[method];
    }

    targetMap.push({
      path,
      handler,
    });
  }
}
