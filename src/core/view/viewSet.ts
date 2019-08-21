import { Model } from "../model/model";
import { SystemContextView } from "./systemContextView";
import { SoftwareSystem } from "../model/softwareSystem";
import { View } from "./view";
import { ContainerView } from "./containerView";
import { DeploymentView } from "./deploymentView";
import { ViewConfiguration } from "./viewConfiguration";

export class ViewSet {

    public systemContextViews: SystemContextView[] = [];
    public containerViews: ContainerView[] = [];
    public deploymentViews: DeploymentView[] = [];
    public configuration = new ViewConfiguration();

    constructor(public model: Model) {
    }

    public createSystemContextView(softwareSystem: SoftwareSystem, key: string, description: string): SystemContextView {
        this.assertThatTheViewKeyIsUnique(key);
        var view = new SystemContextView(softwareSystem, key, description);
        this.systemContextViews.push(view);
        return view;
    }

    public createContainerView(softwareSystem: SoftwareSystem, key: string, description: string): ContainerView {
        this.assertThatTheViewKeyIsUnique(key);
        var view = new ContainerView(softwareSystem, key, description);
        this.containerViews.push(view);
        return view;
    }

    public createDeploymentView(key: string, description: string, softwareSystem?: SoftwareSystem): DeploymentView {
        this.assertThatTheViewKeyIsUnique(key);
        var view = new DeploymentView(softwareSystem, key, description);
        view.model = this.model;
        this.deploymentViews.push(view);
        return view;
    }

    public toDto(): any {
        return {
            systemLandscapeViews: [],
            systemContextViews: this.systemContextViews.map(v => v.toDto()),
            containerViews: this.containerViews.map(v => v.toDto()),
            componentViews: [],
            dynamicViews: [],
            deploymentViews: this.deploymentViews.map(v => v.toDto()),
            filteredViews: [],
            configuration: this.configuration.toDto()
        };
    }

    public fromDto(dto: any): void {
        this.systemContextViews = this.viewsFromDto(dto.systemContextViews, () => new SystemContextView());
        this.containerViews = this.viewsFromDto(dto.containerViews, () => new ContainerView());
        this.deploymentViews = this.viewsFromDto(dto.deploymentViews, () => new DeploymentView());
        if (dto.configuration) {
            this.configuration.fromDto(dto.configuration);
        }
    }

    public hydrate(): void {
        this.systemContextViews.forEach(v => {
            v.softwareSystem = this.model.softwareSystems.find(s => s.id == v.softwareSystemId)!;
            this.hydrateView(v);
        });
        this.containerViews.forEach(v => {
            v.softwareSystem = this.model.softwareSystems.find(s => s.id == v.softwareSystemId)!;
            this.hydrateView(v);
        });
        this.deploymentViews.forEach(v => {
            if (v.softwareSystemId) {
                v.softwareSystem = this.model.softwareSystems.find(s => s.id == v.softwareSystemId)!;
            }
            v.model = this.model;
            this.hydrateView(v);
        });
    }

    public copyLayoutInformationFrom(source: ViewSet) {
        this.systemContextViews.forEach(v => {
            var s = ViewSet.findView(v.key, source.systemContextViews);
            if (s) {
                v.copyLayoutInformationFrom(s);
            }
        });
        this.containerViews.forEach(v => {
            var s = ViewSet.findView(v.key, source.containerViews);
            if (s) {
                v.copyLayoutInformationFrom(s);
            }
        });
        this.deploymentViews.forEach(v => {
            var s = ViewSet.findView(v.key, source.deploymentViews);
            if (s) {
                v.copyLayoutInformationFrom(s);
            }
        });
    }

    public getViewWithKey(key: string): View | undefined {
        if (!key) {
            throw "A key must be specified.";
        }

        return this.systemContextViews.find(v => v.key == key) || this.containerViews.find(v => v.key == key);
    }

    private assertThatTheViewKeyIsUnique(key: string): void {
        if (this.getViewWithKey(key)) {// || this.getFilteredViewWithKey(key)) {
            throw "A view with the key " + key + " already exists.";
        }
    }

    private static findView<TView extends View>(key: string, views: TView[]): TView | undefined {
        return views.find(v => v.key == key);
    }

    private hydrateView(view: View): void {
        view.elements.forEach(e => {
            e.element = this.model.getElement(e.id);
        });
        view.relationships.forEach(r => {
            r.relationship = this.model.getRelationship(r.id)!;
        });
    }

    private viewsFromDto<TView extends View>(viewDtos: any[], ctor: () => TView): TView[] {
        if (!viewDtos) {
            return [];
        }

        return viewDtos.map((viewDto: any) => {
            var view = ctor();
            view.fromDto(viewDto);
            return view;
        });
    }
}