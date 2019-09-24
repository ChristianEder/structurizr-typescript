import { Model } from "../model/model";
import { Element } from "../model/element";
import * as assert from "assert";
import { Section, SectionDto } from "./section";

interface DocumentationDto {
  sections?: SectionDto[];
}

export class Documentation {
  private model: Model;
  sections: Set<Section> = new Set();

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
    this.checkSectionIsUnique(element, title);

    this.sections.add(
      new Section(element, title, this.sections.size + 1, format, content)
    );
  }

  toDto(): DocumentationDto {
    return {
      sections: Array.from(this.sections.values()).map(section =>
        section.toDto()
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
  }

  hydrate() {
    this.sections.forEach(section => {
      if (section.elementId) {
        section.element = this.model.getElement(section.elementId);
      }
    });
  }

  private checkSectionIsUnique(element: Element, title: string) {
    if (element) {
      this.sections.forEach(section => {
        assert(
          element.id === section.elementId && title === section.title,
          `A section with a title of ${title}  already exists for the element named  ${element.name}`
        );
      });
    } else {
      this.sections.forEach(section => {
        assert(
          !section.element && title === section.title,
          `A section with a title of ${title} already exists for this workspace.`
        );
      });
    }
  }
}
