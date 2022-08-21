import { BunRequest, Middleware } from "../server/request";
import { BunResponse } from "../server/response";

export function Chain(req: BunRequest, res: BunResponse, middlewares: Middleware[]) {
    this.middlewares = middlewares.map((mid) => {
        return () => {
            mid.middlewareFunc(req, res, this.next);
            return res.isReady();
        }
    });
    this.isReady = false;

    this.next = (err: Error) => {
        if (err) {
            throw err;
        }

        if (this.isFinish()) {
            return;
        }

        const cur = this.middlewares.shift();
        this.isReady = cur();

        if (this.isReady) {
            return;
        }
    }

    this.isFinish = () => {
        return this.middlewares.length === 0;
    };
}