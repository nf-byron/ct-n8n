import { IHookFunctions, IWebhookFunctions } from 'n8n-core';
import { INodeTypeDescription, INodeType, IWebhookResponseData } from 'n8n-workflow';
export declare class ShipStationTrigger implements INodeType {
    description: INodeTypeDescription;
    webhookMethods: {
        default: {
            checkExists(this: IHookFunctions): Promise<boolean>;
            create(this: IHookFunctions): Promise<boolean>;
            delete(this: IHookFunctions): Promise<boolean>;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
