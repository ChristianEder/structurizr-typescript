import { Workspace } from "../../core/model/workspace";
import * as CryptoJS from "crypto-js";
import { HttpClient } from "./httpClient";

export class StructurizrClient {

    private httpClient!: HttpClient;
    public mergeFromRemote = true;

    constructor(private apiKey: string, private apiSecret: string, private url = "api.structurizr.com") {
        this.httpClient = new HttpClient(url);
    }

    public getWorkspace(workspaceId: number): Promise<Workspace> {
        var nonce = Date.now() + "";
        var md5Digest = this.getMD5digest("");
        var response = this.httpClient.get("/workspace/" + workspaceId, this.headers(workspaceId, "GET", md5Digest, nonce));
        return response.done.then(j => {
            var w = new Workspace();
            w.fromDto(JSON.parse(j));
            w.hydrate();
            return w;
        })
    }

    public async putWorkspace(workspaceId: number, workspace: Workspace): Promise<string> {

        if (this.mergeFromRemote) {
            var remoteWorkspace = await this.getWorkspace(workspaceId);
            workspace.views.copyLayoutInformationFrom(remoteWorkspace.views);
        }

        workspace.id = workspaceId;
        workspace.lastModifiedDate = new Date();
        var json = JSON.stringify(workspace.toDto());

        var nonce = Date.now() + "";
        var md5Digest = this.getMD5digest(json);
        return this.httpClient.put("/workspace/" + workspaceId, json, this.headers(workspaceId, "PUT", md5Digest, nonce, json)).done;
    }

    private headers(workspaceId: number, method: "GET" | "PUT", md5Digest: string, nonce: string, json?: string): any {
        var headers: any = {
            "X-Authorization": this.getAuthorizationHeader(method, workspaceId, md5Digest, nonce, json),
            "User-Agent": "structurizr-typescript/0.0.3",
            "Nonce": nonce
        };

        if (json) {
            headers["Content-Type"] = "application/json; charset=UTF-8";
            headers["Content-MD5"] = this.toBase64EncodedUTF8(md5Digest);
        }

        return headers;
    }

    private getAuthorizationHeader(method: "PUT" | "GET", workspaceId: number, md5Digest: string, nonce: string, json?: string, ) {
        var hmac = this.gethmac(method, "/workspace/" + workspaceId, md5Digest, json ? "application/json; charset=UTF-8" : "", nonce);
        var authHeader = this.apiKey + ":" + this.toBase64EncodedUTF8(hmac);
        return authHeader;
    }

    private gethmac(method: string, path: string, md5: string, contentType: string, nonce: string): string {
        var content = method + "\n" + path + "\n" + md5 + "\n" + contentType + "\n" + nonce + "\n";
        var contentBytes = CryptoJS.enc.Utf8.parse(content);
        var apiSecretBytes = CryptoJS.enc.Utf8.parse(this.apiSecret);
        var hash = CryptoJS.HmacSHA256(contentBytes, apiSecretBytes);
        var hmac = hash.toString();
        return hmac;
    }

    private getMD5digest(content: string) {
        var md5 = CryptoJS.MD5(content).toString(CryptoJS.enc.Base64);
        var digest = CryptoJS.enc.Base64.parse(md5).toString();
        return digest;
    }

    private toBase64EncodedUTF8(text: string): string {
        return CryptoJS.enc.Utf8.parse(text).toString(CryptoJS.enc.Base64);
    }
}