import { Workspace, Location, InteractionStyle, StructurizrClient, PlantUMLWriter } from "structurizr-typescript"
import * as fs from "fs";

var workspace = new Workspace();
workspace.name = "Monkey Factory";

var user = workspace.model.addPerson("User", "uses the system")!;

var admin = workspace.model.addPerson("Admin", "administers the system and manages user")!;

admin!.interactsWith(user!, "manages rights");

var factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
factory.location = Location.Internal;
var ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
var storage = factory.addContainer("storage", "stores telemetry data", "Table Storage")!;
var frontend = factory.addContainer("frontend", "visualizes telemetry data", "React")!;
ingress.uses(storage, "store telemetry", "IoT Hub routing");
frontend.uses(storage, "load telemetry data", "Table Storage SDK");

var crm = workspace.model.addSoftwareSystem("CRM system", "manage tickets")!;
crm.location = Location.External;
factory.uses(crm, "Create tickets", "AMQP", InteractionStyle.Asynchronous);

user.uses(factory, "view dashboards");
admin.uses(factory, "configure users");
admin.uses(crm, "work on tickets");

var systemContext = workspace.views.createSystemContextView(factory, "factory-context", "The system context view for the monkey factory");
systemContext.addNearestNeighbours(factory);

var containerView = workspace.views.createContainerView(factory, "factory-containers", "Container view for the monkey factory");
containerView.addAllContainers();
containerView.addNearestNeighbours(factory);

// Now either write the workspace to the Structurizr backend...
var yourWorkspaceId = parseInt(process.env.STRUCTURIZR_WORKSPACE_ID!);
var client = new StructurizrClient(process.env.STRUCTURIZR_API_KEY!, process.env.STRUCTURIZR_API_SECRET!);
client.putWorkspace(yourWorkspaceId, workspace).then((c) => {
    console.log("done", c);
}).catch(e => {
    console.log("error", e);
});

// ... or render it as PlantUML
var plantUmlExport = new Promise((resolve, reject) => {
    const plantUML = new PlantUMLWriter().toPlantUML(workspace);
    fs.writeFile("plant.puml", plantUML, e => {
        if(e){
            reject(e);
        }
        resolve();
    });
});
plantUmlExport.then((c) => {
    console.log("done", c);
}).catch(e => {
    console.log("error", e);
});
