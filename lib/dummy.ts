import { Model } from "./core/model/model";

var model = new Model();
var user = model.addPerson("User", "uses the system");

var admin = model.addPerson("Admin", "administers the system");

admin!.interactsWith(user!, "manages rights");

console.log(JSON.stringify(model.toDto()));