import * as https from "https";
import { ClientRequest } from "http";

export class HttpClient {

    constructor(private baseUri: string) {
    }

    public get(path: string, additionalHeaders?: {}): HttpResponse {
        return new HttpResponse(this.getRequestOptions(path, "GET", additionalHeaders));
    }

    public put(path: string, content: {}, additionalHeaders?: {}): HttpResponse {
        return new HttpResponse(this.getRequestOptions(path, "PUT", additionalHeaders), content);
    }

    private getRequestOptions(path: string, method: string, additionalHeaders?: {}): https.RequestOptions {

        var headers = additionalHeaders || {};
        return {
            host: this.baseUri,
            protocol: 'https:',
            port: 443,
            path: path,
            method: method,
            headers: headers
        };
    }
}

export class HttpResponse {

    private data: string = "";
    private promise!: Promise<string>;

    constructor(options: https.RequestOptions, content?: any) {

        this.promise = new Promise<string>((resolve, reject) => {

            var request = https.request(options, r => {
                r.on('data', chunk => { this.data += chunk; });
                r.on('end', () => {
                    resolve(this.data);
                });
                r.on('error', (e) => {
                    reject(e);
                });
            });

            if (content) {
                request.write(content);
            }
            request.end();
        });
    }

    public get done(): Promise<string> {
        return this.promise;
    };

    public get responseBody(): string {
        return this.data;
    }
}