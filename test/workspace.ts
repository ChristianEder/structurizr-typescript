import { Workspace, Location, InteractionStyle, ElementStyle, RelationshipStyle, Shape, Tags, Format, DecisionStatus, RankDirection } from "../src";

export const createWorkspace: () => Workspace = () => {
    const workspace = new Workspace();
    workspace.name = "Monkey Factory";

    const user = workspace.model.addPerson("User", "uses the system")!;

    const admin = workspace.model.addPerson("Admin", "administers the system and manages user")!;

    admin!.interactsWith(user!, "manages rights");

    const factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
    factory.location = Location.Internal;

    const ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
    ingress.tags.add("queue");

    const storage = factory.addContainer("storage", "stores telemetry data", "Table Storage")!;
    storage.tags.add("database");

    const frontend = factory.addContainer("frontend", "visualizes telemetry data", "React")!;
    ingress.uses(storage, "store telemetry", "IoT Hub routing", InteractionStyle.Asynchronous);
    frontend.uses(storage, "load telemetry data", "Table Storage SDK");

    frontend.addComponent("user account", "allows the user to signup or sign in, and see his profile");
    const dashboard = frontend.addComponent("dashboard", "allows the user get an overvew of telementry data", "src/components/dashboard", "Typescript")!;
    dashboard.primaryCodeElement!.language = "TypeScript";
    const chart = dashboard.addSupportingType("src/components/chart")!;
    chart.language = "TypeScript";

    const crm = workspace.model.addSoftwareSystem("CRM system", "manage tickets")!;
    crm.location = Location.External;
    factory.uses(crm, "Create tickets", "AMQP", InteractionStyle.Asynchronous);

    user.uses(dashboard, "view dashboards");
    user.uses(factory, "view dashboards");
    user.uses(frontend, "view dashboards");
    admin.uses(factory, "configure users");
    admin.uses(frontend, "configure users");
    admin.uses(crm, "work on tickets");

    const ingressNode = workspace.model.addDeploymentNode("IoT Hub", "Ingress", "Azure IoT Hub", null, "DEV", 2)!;
    ingressNode.add(ingress);

    const storageNode = workspace.model.addDeploymentNode("Storage", "Storage", "Azure Storage Account with web hosting enabled", null, "DEV", 1)!;
    storageNode.add(storage);
    storageNode.add(frontend);;

    const systemContext = workspace.views.createSystemContextView(factory, "factory-context", "The system context view for the monkey factory");
    systemContext.addNearestNeighbours(factory);
    systemContext.setAutomaticLayout(true);

    const containerView = workspace.views.createContainerView(factory, "factory-containers", "Container view for the monkey factory");
    containerView.addAllContainers();
    containerView.addNearestNeighbours(factory);
    containerView.setAutomaticLayout(RankDirection.LeftRight, 100, 200, 100, true);

    const frontendComponentView = workspace.views.createComponentView(frontend, "factory-frontend-components", "Component View for the monkey factory frontend");
    frontendComponentView.addAllComponents();
    frontendComponentView.addNearestNeighbours(frontend);
    frontendComponentView.setAutomaticLayout(true);

    const deploymentView = workspace.views.createDeploymentView("factory-deployment", "The deployment view fo the monkey factory", factory);
    deploymentView.addAllDeploymentNodes();

    const dbStyle = new ElementStyle("database");
    dbStyle.shape = Shape.Cylinder;

    const queueStyle = new ElementStyle("queue");
    queueStyle.shape = Shape.Pipe;

    const syncStyle = new RelationshipStyle(Tags.Synchronous);
    syncStyle.dashed = false;

    const asyncStyle = new RelationshipStyle(Tags.Asynchronous);
    asyncStyle.dashed = true;

    workspace.views.configuration.styles.addElementStyle(dbStyle);
    workspace.views.configuration.styles.addElementStyle(queueStyle);
    workspace.views.configuration.styles.addRelationshipStyle(asyncStyle);
    workspace.views.configuration.styles.addRelationshipStyle(syncStyle);
    workspace.views.configuration.theme = "https://raw.githubusercontent.com/structurizr/java/master/structurizr-examples/src/com/structurizr/example/theme/theme.json";

    workspace.documentation.addSection(factory, "Monkey Factory", Format.Markdown, `The monkey factory oversees the production of stuffed monkey animals`);
    workspace.documentation.addSection(frontend, "Frontend", Format.AsciiDoc, `The frontend is written in javascript`);
    workspace.documentation.addSection(undefined, "Unrelated", Format.AsciiDoc, `Text goes here`);
    workspace.documentation.addDecision(factory, '1', new Date('2008-09-15T15:53:00'), 'Use ISO 8601 Format for Dates', DecisionStatus.Accepted, Format.Markdown, `We should use ISO 8601`);
    workspace.documentation.addDecision(undefined, '2', new Date('2008-09-15T15:53:00'), 'Use angular as the frontend framework', DecisionStatus.Proposed, Format.Markdown, `We should use angular`);

    return workspace;
}