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