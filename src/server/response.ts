export class BunResponse {
    private response: Response;
    private options: ResponseInit = {};

    status(code: number) {
        this.options.status = code;
        return this;
    }

    statusText(text: string) {
        this.options.statusText = text;
        return this;
    }

    json(body: any) {
        this.response = Response.json(body, this.options);
    }

    headers(header: HeadersInit) {
        this.options.headers = header;
        return this;
    }

    getResponse() {
        return this.response;
    }
}