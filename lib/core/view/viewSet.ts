import { Model } from "../model/model";
import { SystemContextView } from "./systemContextView";
import { SoftwareSystem } from "../model/softwareSystem";
import { View } from "./view";

export class ViewSet {

    private systemContextViews: SystemContextView[] = [];

    constructor(public model: Model) {
    }

    public createSystemContextView(softwareSystem: SoftwareSystem, key: string, description: string): SystemContextView {
        this.assertThatTheViewKeyIsUnique(key);
        var view = new SystemContextView(softwareSystem, key, description);
        this.systemContextViews.push(view);
        return view;
    }

    public toDto(): any {
        return {
            systemLandscapeViews: [],
            systemContextViews: this.systemContextViews.map(v => v.toDto()),
            containerViews: [],
            componentViews: [],
            dynamicViews: [],
            deploymentViews: [],
            filteredViews: [],
            configuration: {
                styles: {
                    relationships: [],
                    elements: []
                },
                branding: {},
                terminology: {},
                viewSortOrder: "Default"
            }
        };
    }

    public fromDto(dto: any): void {
        this.systemContextViews = dto.systemContextViews.map((viewDto: any) => {
            var view = new SystemContextView();
            view.fromDto(viewDto);
            return view;
        });
    }

    public hydrate(): void {
        this.systemContextViews.forEach(v => {
            v.softwareSystem = this.model.softwareSystems.find(s => s.id == v.softwareSystemId)!;
            this.hydrateView(v);
        });
    }

    public copyLayoutInformationFrom(source: ViewSet) {
        this.systemContextViews.forEach(v => {
            var s = source.findSystemContextView(v.key);
            if (s) {
                v.copyLayoutInformationFrom(s);
            }
        });
    }

    public getViewWithKey(key: string): View | undefined {
        if (!key) {
            throw "A key must be specified.";
        }

        return this.systemContextViews.find(v => v.key == key);
    }

    private assertThatTheViewKeyIsUnique(key: string): void {
        if (this.getViewWithKey(key)) {// || this.getFilteredViewWithKey(key)) {
            throw "A view with the key " + key + " already exists.";
        }
    }

    private findSystemContextView(key: string): SystemContextView | undefined {
        return this.systemContextViews.find(v => v.key == key);
    }

    private hydrateView(view: View): void {
        view.elements.forEach(e => {
            e.element = this.model.getElement(e.id);
        });
        view.relationships.forEach(r => {
            r.relationship = this.model.getRelationship(r.id)!;
        });
    }
}