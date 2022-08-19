export class BunResponse {
    private response: Response;
    private options: ResponseInit = {};

    status(code: number): BunResponse {
        this.options.status = code;
        return this;
    }

    option(option: ResponseInit): BunResponse {
        this.options = Object.assign(this.options, option);
        return this;
    }

    statusText(text: string): BunResponse {
        this.options.statusText = text;
        return this;
    }

    json(body: any): void {
        this.response = Response.json(body, this.options);
    }

    send(body: any): void {
        this.response = new Response(body, this.options);
    }

    // nodejs way to set headers
    setHeader(key: string, value: any) {
        if (!key || !value) {
            throw new Error('Headers key or value should not be empty');
        }

        const headers = this.options.headers;
        if (!headers) {
            this.options.headers = { keys: value };
        }
        this.options.headers[key] = value;
        return this;
    }

    // nodejs way to get headers
    getHeader() {
        return this.options.headers;
    }

    headers(header: HeadersInit): BunResponse {
        this.options.headers = header;
        return this;
    }

    getResponse(): Response {
        return this.response;
    }

    isReady(): boolean {
        return !!this.response;
    }
}