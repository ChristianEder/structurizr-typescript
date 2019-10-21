import { Model } from "../model/model";
import { Element } from "../model/element";
import * as assert from "assert";
import { Section } from "./section";
import { Decision } from "./decision";
import { SoftwareSystem } from "../model/softwareSystem";
import { DecisionStatus } from "./decisionStatus";
import { Format } from "./format";

export class Documentation {
    private model: Model;
    public sections: Set<Section> = new Set();
    public decisions: Set<Decision> = new Set();

    constructor(model: Model) {
        this.model = model;
    }

    public addSection(
        element: Element | undefined,
        title: string,
        format: any,
        content: string
    ) {
        if (element && !this.model.containsElement(element)) {
            throw new Error(
                `The element named ${element.name} does not exist in the model associated with this documentation.`
            );
        }

        assert(title, "A title must be specified.");
        assert(content, "Content must be specified.");
        assert(format, "A format must be specified.");
        this.checkSectionIsUnqiue(title, element);

        const section = new Section();
        section.fromDto({
            elementId: element && element.id,
            title,
            order: this.sections.size + 1,
            format,
            content
        });
        section.element = element;
        this.sections.add(section);
        return section;
    }

    public addDecision(
        element: SoftwareSystem | undefined,
        id: string,
        date: Date,
        title: string,
        status: DecisionStatus,
        format: Format,
        content: string
    ) {
        assert(id, `An id must be specifed`);
        assert(date, "A date must be specified");
        assert(title, "A title must be specified");
        assert(status, "A status must be specified");
        assert(format, "A format must be specified");
        this.checkDecisionIsUnqiue(id, element);

        const decision = new Decision();
        decision.fromDto({ id, date, title, status, format, content, elementId: element && element.id });
        decision.element = element;
        this.decisions.add(decision);
        return decision;
    }

    public toDto() {
        return {
            sections: Array.from(this.sections.values()).map(section =>
                section.toDto()
            ),
            decisions: Array.from(this.decisions.values()).map(decision =>
                decision.toDto()
            )
        };
    }

    public fromDto(dto: any) {
        if (dto.sections) {
            dto.sections.forEach((sectionDto: any) => {
                const section = new Section();
                section.fromDto(sectionDto);
                this.sections.add(section);
            });
        }
        if (dto.decisions) {
            dto.decisions.forEach((decisionDto: any) => {
                const decision = new Decision();
                decision.fromDto(decisionDto);
                this.decisions.add(decision);
            });
        }
    }

    public hydrate() {
        this.sections.forEach(section => this.findElementAndHydrate(section));
        this.decisions.forEach(decision =>
            this.findElementAndHydrate(decision)
        );
    }

    private findElementAndHydrate(documentationElement: {
        elementId?: string;
        element?: Element;
    }) {
        if (documentationElement.elementId) {
            documentationElement.element = this.model.getElement(
                documentationElement.elementId
            );
        }
    }

    private checkSectionIsUnqiue(title: string, element?: Element) {
        if (!element) {
            this.sections.forEach(section => {
                if (!section.element && section.title === title) {
                    throw new Error(
                        `A section with a title of ${title} already exists for this workspace.`
                    );
                }
            });
        } else {
            this.sections.forEach(section => {
                if (
                    element.id === section.elementId &&
                    section.title === title
                ) {
                    throw new Error(
                        `A section with a title of ${title} already exists for element named ${element.name}.`
                    );
                }
            });
        }
    }

    private checkDecisionIsUnqiue(id: string, element?: Element) {
        if (!element) {
            this.decisions.forEach(decision => {
                if (!decision.element && decision.id === id) {
                    throw new Error(
                        `A decision with an id of ${id} already exists for this workspace.`
                    );
                }
            });
        } else {
            this.decisions.forEach(decision => {
                if (element.id === decision.elementId && decision.id === id) {
                    throw new Error(
                        `A decision with an title of ${id} already exists for element named ${element.name}.`
                    );
                }
            });
        }
    }
}
