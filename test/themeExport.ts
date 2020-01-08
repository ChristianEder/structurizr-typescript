import { expect } from "chai";
import { Styles, ElementStyle, Shape, RelationshipStyle, Routing, ITheme } from "../src";

export function testElementStyleThemeExport() {
    const styles = createElementStyles();
    const expectedTheme = createElementTheme(false);

    var actualTheme = JSON.parse(JSON.stringify(styles.toTheme()));

    expect(actualTheme).to.deep.equalInAnyOrder(expectedTheme);
}

export function testFullThemeExport() {
    const styles = createElementStyles();

    const asyncStyle = new RelationshipStyle("async");
    asyncStyle.dashed = true;
    asyncStyle.routing = Routing.Orthogonal;
    styles.addRelationshipStyle(asyncStyle)

    const expectedTheme = createElementTheme(true);

    var actualTheme = JSON.parse(JSON.stringify(styles.toTheme()));

    expect(actualTheme).to.deep.equalInAnyOrder(expectedTheme);
}

function createElementStyles() {
    const styles = new Styles();

    const systemStyle = new ElementStyle("Software System");
    systemStyle.background = "#1168bd";
    systemStyle.color = "#ffffff";

    const personStyle = new ElementStyle("Person");
    personStyle.background = "#08427b";
    personStyle.color = "#ffffff";
    personStyle.shape = Shape.Person;

    styles.addElementStyle(systemStyle);
    styles.addElementStyle(personStyle);

    return styles;
}

function createElementTheme(addRelationshipStyle: boolean) {
    return {
        "elements": [
            {
                "tag": "Software System",
                "background": "#1168bd",
                "color": "#ffffff"
            },
            {
                "tag": "Person",
                "background": "#08427b",
                "color": "#ffffff",
                "shape": "Person"
            }
        ],
        "relationships": addRelationshipStyle ? [{
            "tag": "async",
            "dashed": true,
            "routing": "Orthogonal"
        }]: []
    };
}