import { Workspace, StructurizrClient } from "structurizr-typescript"

export const pushWorkspace = (workspace: Workspace) => {
    if (!process.env.WORKSPACE_ID) {
      return console.error('Please define WORKSPACE_ID environment variable in order to push your workspace');
    }
  
    if (!process.env.API_KEY || !process.env.API_SECRET) {
      return console.error('Please define API_KEY and API_SECRET environment variables in order to push your workspace');
    }
  
    const workspaceId = parseInt(process.env.WORKSPACE_ID);
  
    const client = new StructurizrClient(process.env.API_KEY, process.env.API_SECRET);
  
    return client.putWorkspace(workspaceId, workspace);
  }