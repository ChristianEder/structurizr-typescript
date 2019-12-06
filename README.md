# Structurizr for TypeScript

This GitHub repository is a port of [Structurizr for .NET](https://github.com/structurizr/dotnet) to TypeScript, in order to help you visualise, document and explore the software architecture of a software system. In summary, it allows you to create a software architecture model based upon Simon Brown's [C4 model](https://structurizr.com/help/c4).

[![npm version](https://badge.fury.io/js/structurizr-typescript.svg)](https://www.npmjs.com/package/structurizr-typescript)

## How to use

- Set up a new project similar to this [sample](https://github.com/ChristianEder/structurizr-typescript/tree/master/sample)
  > npm init\
  > npm install -D @types/node\
  > npm install -D typescript\
  > npm install -S structurizr-typescript
- Start coding your architecture model similar to the [sample index.ts](https://github.com/ChristianEder/structurizr-typescript/blob/master/sample/index.ts)
  - For more detailed documentation on how to use Structurizr, please refer to [Structurizr for .NET](https://github.com/structurizr/dotnet) - the usage is pretty much the same
  - In the current version of this package, just a few of Structurizrs features are already implemented. See [Limitations](#Limitations) section below

## Limitations

The current version of this package only supports:
- Person, SoftwareSystem, Container, Component & CodeElement entities
- Relationships between those entities 
- System Context, Container & Component diagrams
- Deployment diagrams with DeploymentNode, ContainerInstance and HttpHealthCheck entities
- Custom Element & Relationship styles
- Documentation Sections & Decisions (kudos go to [Joe Ruello](https://github.com/joeruello))
- Diagram Autolayouting (kudos go to [Joe Ruello](https://github.com/joeruello))

This specifically excludes:
- Encrypted workspaces
- Dynamic diagrams 
- Enterprise context diagrams

Also, as of now the package has just a few automated tests - use at own risk :-)
