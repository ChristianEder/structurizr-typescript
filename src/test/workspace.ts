import { Workspace, Location, InteractionStyle } from "../lib";

var ws = new Workspace();
ws.name = "Monkey Factory";

var user = ws.model.addPerson("User", "uses the system")!;

var admin = ws.model.addPerson("Admin", "administers the system and manages user")!;

admin!.interactsWith(user!, "manages rights");

var factory = ws.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
factory.location = Location.Internal;
var ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
var storage = factory.addContainer("storage", "stores telemetry data", "Table Storage")!;
var frontend = factory.addContainer("frontend", "visualizes telemetry data", "React")!;
ingress.uses(storage, "store telemetry", "IoT Hub routing");
frontend.uses(storage, "load telemetry data", "Table Storage SDK");

var crm = ws.model.addSoftwareSystem("CRM system", "manage tickets")!;
crm.location = Location.External;
factory.uses(crm, "Create tickets", "AMQP", InteractionStyle.Asynchronous);

user.uses(factory, "view dashboards");
user.uses(frontend, "view dashboards");
admin.uses(factory, "configure users");
admin.uses(frontend, "configure users");
admin.uses(crm, "work on tickets");

var ingressNode = ws.model.addDeploymentNode("IoT Hub", "Ingress", "Azure IoT Hub", null, "DEV", 2)!;
ingressNode.add(ingress);

var storageNode = ws.model.addDeploymentNode("Storage", "Storage", "Azure Storage Account with web hosting enabled", null, "DEV", 1)!;
storageNode.add(storage);
storageNode.add(frontend);;

var systemContext = ws.views.createSystemContextView(factory, "factory-context", "The system context view for the monkey factory");
systemContext.addNearestNeighbours(factory);

var containerView = ws.views.createContainerView(factory, "factory-containers", "Container view for the monkey factory");
containerView.addAllContainers();
containerView.addNearestNeighbours(factory);

var deploymentView = ws.views.createDeploymentView("factory-deployment", "The deployment view fo the monkey factory", factory);
deploymentView.addAllDeploymentNodes();

export const workspace = ws;