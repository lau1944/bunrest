import { Middleware } from "../server/request";
import { BunResponse } from "../server/response";

export function Chain(req: Request, res: BunResponse, middlewares: Middleware[]) {
    this.middlewares = middlewares.map((mid) => {
        return () => {
            mid.middlewareFunc(req, res, this.next);
            return res.isReady();
        }
    });
    this.index = 0;
    this.isReady = false;

    this.next = () => {
        if (this.isReady || this.isFinish()) {
            return;
        }

        const cur = this.middlewares[this.index++];
        this.isReady = cur();
    }

    this.isFinish = () => {
        return this.index === this.middlewares.length;
    };
}