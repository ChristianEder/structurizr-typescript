import { expect } from "chai";
import { Workspace, StructurizrClient, InteractionStyle, Location } from "../lib";

export async function testApiCompatitbility() {
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
    user.uses(frontend, "view dashboards");
    admin.uses(factory, "configure users");
    admin.uses(frontend, "configure users");
    admin.uses(crm, "work on tickets");
    
    var ingressNode = workspace.model.addDeploymentNode("IoT Hub", "Ingress", "Azure IoT Hub", null, "DEV", 2)!;
    ingressNode.add(ingress);
    
    var storageNode = workspace.model.addDeploymentNode("Storage", "Storage", "Azure Storage Account with web hosting enabled", null, "DEV", 1)!;
    storageNode.add(storage);
    storageNode.add(frontend);;
    
    var systemContext = workspace.views.createSystemContextView(factory, "factory-context", "The system context view for the monkey factory");
    systemContext.addNearestNeighbours(factory);
    
    var containerView = workspace.views.createContainerView(factory, "factory-containers", "Container view for the monkey factory");
    containerView.addAllContainers();
    containerView.addNearestNeighbours(factory);
    
    var deploymentView = workspace.views.createDeploymentView("factory-deployment", "The deployment view fo the monkey factory", factory);
    deploymentView.addAllDeploymentNodes();
    
    var client = new StructurizrClient(process.env.STRUCTURIZR_API_KEY!, process.env.STRUCTURIZR_API_SECRET!);
    const resultJson = await client.putWorkspace(parseInt(process.env.STRUCTURIZR_WORKSPACE_ID!, 10), workspace);
    const result = JSON.parse(resultJson);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("OK");
}