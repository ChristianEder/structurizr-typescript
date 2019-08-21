import { DeploymentElement } from "./deploymentElement";
import { Container } from "./container";
import { Element } from "./element";
import { HttpHealthCheck } from "./httpHealthCheck";
import { Tags } from "./tags";

export class ContainerInstance extends DeploymentElement {

    public static type = "ContainerInstance";
    public get type(): string { return ContainerInstance.type; }


    constructor(){
        super();
        this.tags.add(Tags.ContainerInstance);
    }

    public get canonicalName(): string {
        return this.container!.canonicalName + "[" + this.instanceId + "]"
    }

    public get parent(): Element | null {
        return this.container!.parent;
    }
    public set parent(p: Element | null) {
    }

    public instanceId!: number;

    public containerId?: string;
    public container?: Container;
    public healthChecks: HttpHealthCheck[] = [];

    public addHealthCheck(name: string, url: string, interval: number = 60, timeout: number = 0) {
        var healthCheck = new HttpHealthCheck();
        healthCheck.name = name;
        healthCheck.url = url;
        healthCheck.interval = interval;
        healthCheck.timeout = timeout;
        if (!this.healthChecks.find(h => h.equals(healthCheck))) {
            this.healthChecks.push(healthCheck);
        }
    }

    public toDto(): any {
        var dto = super.toDto();
        return {
            ...dto,
            environment: this.environment,
            containerId: this.containerId,
            instanceId: this.instanceId,
            healthChecks: this.healthChecks.map(h => h.toDto())
        };
    }

    public fromDto(dto: any) {
        super.fromDto(dto);
        this.environment = dto.environment;
        this.containerId = dto.containerId;
        this.instanceId = dto.instanceId;
        this.healthChecks = dto.healthChecks ? dto.healthChecks.map((h: any) => {
            var c = new HttpHealthCheck();
            c.fromDto(h);
            return c;
        }) : [];
    }
}