import { Model } from "../model/model";
import { Element } from "../model/element";
import * as assert from "assert";
import { Section, SectionDto } from "./section";
import { Decision, DecisionDto } from "./decision";
import { SoftwareSystem } from "../model/softwareSystem";
import { DecisionStatus } from "./decisionStatus";
import { Format } from "..";

interface DocumentationDto {
  sections?: SectionDto[];
  decisions?: DecisionDto[];
}

export class Documentation {
  private model: Model;
  sections: Set<Section> = new Set();
  decisions: Set<Decision> = new Set();

  constructor(model: Model) {
    this.model = model;
  }

  addSection(element: Element, title: string, format: any, content: string) {
    if (element && !this.model.containsElement(element)) {
      throw new Error(
        `The element named ${element.name} does not exist in the model associated with this documentation.`
      );
    }

    assert(title, "A title must be specified.");
    assert(content, "Content must be specified.");
    assert(format, "A format must be specified.");
    checkIsUnqiue(this.sections, "title", title, element);

    const section = new Section(
      element,
      title,
      this.sections.size + 1,
      format,
      content
    );
    this.sections.add(section);
    return section;
  }

  addDecision(
    element: SoftwareSystem,
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
    checkIsUnqiue(this.decisions, "id", id, element);

    const decision = new Decision(
      element,
      id,
      date,
      title,
      status,
      format,
      content
    );
    this.decisions.add(decision);
    return decision;
  }

  toDto(): DocumentationDto {
    return {
      sections: Array.from(this.sections.values()).map(section =>
        section.toDto()
      ),
      decisions: Array.from(this.decisions.values()).map(decision =>
        decision.toDto()
      )
    };
  }

  fromDto(dto: DocumentationDto) {
    if (dto.sections) {
      dto.sections.map(dto => {
        const section = new Section(
          null,
          dto.title,
          dto.order,
          dto.format,
          dto.content
        );
        if (dto.elementId) {
          section.elementId = dto.elementId;
        }
        this.sections.add(section);
      });
    }

    if (dto.decisions) {
      dto.decisions.map(dto => {
        const decision = new Decision(
          null,
          dto.id,
          new Date(dto.date),
          dto.title,
          dto.status,
          dto.format,
          dto.content
        );
        if (dto.elementId) {
          decision.elementId = dto.elementId;
        }
        this.decisions.add(decision);
      });
    }
  }

  hydrate() {
    this.sections.forEach(section => this.findElementAndHydrate(section));
    this.decisions.forEach(decision => this.findElementAndHydrate(decision));
  }

  private findElementAndHydrate(section: {
    elementId?: string;
    element: Element | null;
  }) {
    if (section.elementId) {
      section.element = this.model.getElement(section.elementId);
    }
  }
}

function checkIsUnqiue(
  collection: Set<any>,
  idField: string,
  id: string,
  element?: Element
) {
  if (element) {
    collection.forEach(item => {
      assert(
        element.id === item.elementId && id === item[idField],
        `A section with an ${idField} of ${id}  already exists for the element named ${element.name}`
      );
    });
  } else {
    collection.forEach(item => {
      assert(
        !item.element && id === item[idField],
        `A section with an ${idField} of ${id} already exists for this workspace.`
      );
    });
  }
}
