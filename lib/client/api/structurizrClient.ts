import { Workspace } from "../../core/model/workspace";
import * as CryptoJS from "crypto-js";
import { HttpClient } from "./httpClient";

export class StructurizrClient {

    private httpClient!: HttpClient;

    constructor(private apiKey: string, private apiSecret: string, private url = "api.structurizr.com") {
        this.httpClient = new HttpClient(url);
    }

    public putWorkspace(workspaceId: number, workspace: Workspace): Promise<string> {
        workspace.id = workspaceId;
        workspace.lastModifiedDate = new Date();
        var json = JSON.stringify(workspace.toDto());

        console.log("#### WORKSPACE")
        console.log(json);
        console.log("#### /WORKSPACE")
        
        var nonce = Date.now() + ""; 
        var md5Digest = this.getMD5digest(json);
        return this.httpClient.put("/workspace/" + workspaceId, json, {
            "X-Authorization": this.getAuthorizationHeader("PUT", workspaceId, json, md5Digest, nonce),
            "User-Agent": "structurizr-dotnet/0.9.0",
            "Nonce": nonce,
            "Content-Type": "application/json; charset=UTF-8",
            "Content-MD5": this.toBase64EncodedUTF8(md5Digest)
        }).done;
    }

    private getAuthorizationHeader(method: "PUT" | "GET", workspaceId: number, json: string, md5Digest: string, nonce: string) {
        var hmac = this.gethmac(method, "/workspace/" + workspaceId, md5Digest, "application/json; charset=UTF-8", nonce);
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
        var bytes = CryptoJS.enc.Utf8.parse(content).toString(CryptoJS.enc.Base64);
        var md5 = CryptoJS.MD5(content).toString(CryptoJS.enc.Base64);
        var digest = CryptoJS.enc.Base64.parse(md5).toString();
        return digest;
    }

    private toBase64EncodedUTF8(text: string): string {
        return CryptoJS.enc.Utf8.parse(text).toString(CryptoJS.enc.Base64);
    }
}