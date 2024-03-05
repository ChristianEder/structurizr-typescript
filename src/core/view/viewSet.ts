import { Model } from "../model/model";
import { SystemContextView } from "./systemContextView";
import { SoftwareSystem } from "../model/softwareSystem";
import { View } from "./view";
import { ContainerView } from "./containerView";
import { DeploymentView } from "./deploymentView";
import { ViewConfiguration } from "./viewConfiguration";
import { ComponentView } from "./componentView";
import { Container } from "../model/container";
import { FilteredView, FilterMode } from "./filteredView";
import { StaticView } from "./staticView";

export class ViewSet {

    public systemContextViews: SystemContextView[] = [];
    public containerViews: ContainerView[] = [];
    public componentViews: ComponentView[] = [];
    public deploymentViews: DeploymentView[] = [];
    public filteredViews: FilteredView[] = [];
    public configuration = new ViewConfiguration();

    constructor(public model: Model) {
    }

    public createSystemContextView(softwareSystem: SoftwareSystem, key: string, description: string): SystemContextView {
        this.assertThatTheViewKeyIsUnique(key);
        var view = new SystemContextView(softwareSystem, key, description);
        view.order = this.getNextOrder();
        this.systemContextViews.push(view);
        return view;
    }

    public createContainerView(softwareSystem: SoftwareSystem, key: string, description: string): ContainerView {
        this.assertThatTheViewKeyIsUnique(key);
        var view = new ContainerView(softwareSystem, key, description);
        view.order = this.getNextOrder();
        this.containerViews.push(view);
        return view;
    }

    public createComponentView(container: Container, key: string, description: string): ComponentView {
        this.assertThatTheViewKeyIsUnique(key);
        var view = new ComponentView(container, key, description);
        view.order = this.getNextOrder();
        this.componentViews.push(view);
        return view;
    }

    public createDeploymentView(key: string, description: string, softwareSystem?: SoftwareSystem): DeploymentView {
        this.assertThatTheViewKeyIsUnique(key);
        var view = new DeploymentView(softwareSystem, key, description);
        view.order = this.getNextOrder();
        view.model = this.model;
        this.deploymentViews.push(view);
        return view;
    }

    public createFilteredView(view: StaticView, key: string, description: string, mode: FilterMode, ...tags: string[]): FilteredView {
        this.assertThatTheViewKeyIsUnique(key);

        const filteredView = new FilteredView(view, key, description, mode, ...tags);
        filteredView.order = this.getNextOrder();
        this.filteredViews.push(filteredView);

        return filteredView;
    }

    public toDto(): any {
        return {
            systemLandscapeViews: [],
            systemContextViews: this.systemContextViews.map(v => v.toDto()),
            containerViews: this.containerViews.map(v => v.toDto()),
            componentViews: this.componentViews.map(v => v.toDto()),
            dynamicViews: [],
            deploymentViews: this.deploymentViews.map(v => v.toDto()),
            filteredViews: this.filteredViews.map(v => v.toDto()),
            configuration: this.configuration.toDto()
        };
    }

    public fromDto(dto: any): void {
        this.systemContextViews = this.viewsFromDto(dto.systemContextViews, () => new SystemContextView());
        this.containerViews = this.viewsFromDto(dto.containerViews, () => new ContainerView());
        this.componentViews = this.viewsFromDto(dto.componentViews, () => new ComponentView());
        this.deploymentViews = this.viewsFromDto(dto.deploymentViews, () => new DeploymentView());
        this.filteredViews = this.viewsFromDto(dto.filteredViews, () => new FilteredView())
        if (dto.configuration) {
            this.configuration.fromDto(dto.configuration);
        }
    }

    public hydrate(): void {
        this.systemContextViews.forEach(v => {
            v.softwareSystem = this.model.softwareSystems.find(s => s.id === v.softwareSystemId)!;
            this.hydrateView(v);
        });

        this.containerViews.forEach(v => {
            v.softwareSystem = this.model.softwareSystems.find(s => s.id === v.softwareSystemId)!;
            this.hydrateView(v);
        });

        this.componentViews.forEach(v => {
            v.container = <Container>this.model.getElement(v.containerId!);
            v.softwareSystem = v.container.softwareSystem!;
            this.hydrateView(v);
        });

        this.deploymentViews.forEach(v => {
            if (v.softwareSystemId) {
                v.softwareSystem = this.model.softwareSystems.find(s => s.id == v.softwareSystemId)!;
            }
            v.model = this.model;
            this.hydrateView(v);
        });

        this.filteredViews.forEach(v => {
            v.baseView = this.getViewWithKey(v.baseViewKey);
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

        return this.systemContextViews.find(v => v.key == key)
            || this.containerViews.find(v => v.key == key)
            || this.componentViews.find(v => v.key == key)
            || this.deploymentViews.find(v => v.key == key);
    }

    private assertThatTheViewKeyIsUnique(key: string): void {
        if (this.getViewWithKey(key) || this.filteredViews.some(v => v.key == key)) {
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

    private viewsFromDto<TView extends (View | FilteredView)>(viewDtos: any[], ctor: () => TView): TView[] {
        if (!viewDtos) {
            return [];
        }

        return viewDtos.map((viewDto: any) => {
            var view = ctor();
            view.fromDto(viewDto);
            return view;
        });
    }

    private getNextOrder(): number {
        let maxOrder = 0;
        [
            ...this.systemContextViews,
            ...this.containerViews,
            ...this.componentViews,
            ...this.deploymentViews,
            ...this.filteredViews
        ].forEach(v => {
            if (v.order && v.order > maxOrder) {
                maxOrder = v.order;
            }
        })

        return maxOrder + 1;
    }
}