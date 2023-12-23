import { BunRequest, MiddlewareFunc } from "../server/request";
import { BunResponse } from "../server/response";

export class Chain {
    private index: number = 0;
    private req: BunRequest;
    private res: BunResponse;
    private middlewares: MiddlewareFunc[];
    private resolve: () => void;

    constructor(req: BunRequest, res: BunResponse, middlewares: MiddlewareFunc[]) {
        this.req = req;
        this.res = res;
        this.middlewares = middlewares;
    }

    private async processNext(err: Error) {
        if (err) {
            throw err;
        }
        if (this.index < this.middlewares.length) {
            const middleware = this.middlewares[this.index++];
            let nextCalled = false;

            const nextWrapper = (err: Error) => {
                nextCalled = true;
                this.processNext(err);
            };

            await middleware(this.req, this.res, nextWrapper);

            if (!nextCalled) {
              this.resolve();
            }
        } else {
            this.resolve();
        }
    }

    public run(): Promise<void> {
        return new Promise((resolve) => {
            this.resolve = resolve;
            this.processNext();
        });
    }

    public isFinish(): boolean {
        return this.index === this.middlewares.length;
    }

    public isReady(): boolean {
        return !this.isFinish();
    }
}
