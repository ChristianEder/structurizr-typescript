import { expect } from "chai";
import { StructurizrClient } from "../src";
import { createWorkspace } from "./workspace";

export async function testApiCompatitbility() {
    const apiKey = process.env.STRUCTURIZR_API_KEY!
    const apiSecret = process.env.STRUCTURIZR_API_SECRET!
    const workspaceId = process.env.STRUCTURIZR_WORKSPACE_ID!;

    var client = new StructurizrClient(apiKey, apiSecret);

    const resultJson = await client.putWorkspace(parseInt(workspaceId, 10), createWorkspace());
    const result = JSON.parse(resultJson);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("OK");
}

export async function testApiIdempotency() {
    await testApiCompatitbility();
    const apiKey = process.env.STRUCTURIZR_API_KEY!
    const apiSecret = process.env.STRUCTURIZR_API_SECRET!
    const workspaceId = process.env.STRUCTURIZR_WORKSPACE_ID!;
    var client = new StructurizrClient(apiKey, apiSecret);
    const expectedWorkspace =  await client.getWorkspace(parseInt(workspaceId, 10)); 
    await testApiCompatitbility();
    const actualWorkspace = await client.getWorkspace(parseInt(workspaceId, 10)); 
    expect(actualWorkspace.lastModifiedDate).not.to.be.null;
    actualWorkspace.lastModifiedDate = expectedWorkspace.lastModifiedDate;
    expect(actualWorkspace.toDto()).to.deep.equalInAnyOrder(expectedWorkspace.toDto());   
}