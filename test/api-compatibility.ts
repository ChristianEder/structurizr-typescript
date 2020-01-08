import { expect } from "chai";
import { StructurizrClient } from "../src";
import { createWorkspace } from "./workspace";

export async function testApiCompatitbility() {
    var client = new StructurizrClient(process.env.STRUCTURIZR_API_KEY!, process.env.STRUCTURIZR_API_SECRET!);
    const resultJson = await client.putWorkspace(parseInt(process.env.STRUCTURIZR_WORKSPACE_ID!, 10), createWorkspace());
    const result = JSON.parse(resultJson);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("OK");
}

export async function testApiIdempotency() {
    await testApiCompatitbility();
    var client = new StructurizrClient(process.env.STRUCTURIZR_API_KEY!, process.env.STRUCTURIZR_API_SECRET!);
    const expectedWorkspace =  await client.getWorkspace(parseInt(process.env.STRUCTURIZR_WORKSPACE_ID!, 10)); 
    await testApiCompatitbility();
    const actualWorkspace = await client.getWorkspace(parseInt(process.env.STRUCTURIZR_WORKSPACE_ID!, 10)); 
    expect(actualWorkspace.lastModifiedDate).not.to.be.null;
    actualWorkspace.lastModifiedDate = expectedWorkspace.lastModifiedDate;
    expect(actualWorkspace.toDto()).to.deep.equalInAnyOrder(expectedWorkspace.toDto());   
}