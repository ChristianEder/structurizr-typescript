import { Model } from "./core/model/model";
import { Workspace } from "./core/model/workspace";
import { StructurizrClient } from "./client/api/structurizrClient";
import { getMd5HmacBase64 } from "./client/api/hmac";
import { HttpClient } from "./client/api/httpClient";

var workspace = new Workspace();
workspace.name = "Monkey Factory";

var user = workspace.model.addPerson("User", "uses the system");

var admin = workspace.model.addPerson("Admin", "administers the system and manages user");

admin!.interactsWith(user!, "manages rights");

var client = new StructurizrClient("your-api-key", "your-api-secret");
client.putWorkspace(18991, workspace).then((c) => {
    console.log("done", c);
}).catch(e => {
    console.log("error", e);
});
