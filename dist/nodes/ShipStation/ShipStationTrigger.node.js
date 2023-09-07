"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericFunctions_1 = require("./GenericFunctions");
class ShipStationTrigger {
    constructor() {
        this.description = {
            displayName: 'Ship Station Trigger',
            name: 'shipStationTrigger',
            icon: 'file:shipstation.png',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Starts the workflow by Ship Station webhook.',
            defaults: {
                name: 'ShipStation Trigger',
                color: '#0088cc',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'shipstationApi',
                    required: true,
                }
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    options: [
                        {
                            name: 'Order Notify',
                            value: 'ORDER_NOTIFY',
                            description: '',
                        },
                        {
                            name: 'Item Order Notify',
                            value: 'ITEM_ORDER_NOTIFY',
                            description: '',
                        },
                        {
                            name: 'Ship Notify',
                            value: 'SHIP_NOTIFY',
                            description: '',
                        },
                        {
                            name: 'Item Ship Notify',
                            value: 'ITEM_SHIP_NOTIFY',
                            description: '',
                        },
                    ],
                    default: 'ORDER_NOTIFY',
                    required: true,
                    description: 'The type of webhook to subscribe to',
                },
                {
                    displayName: 'Store ID',
                    name: 'store_id',
                    type: 'number',
                    default: '',
                    description: 'If passed in, the webhooks will only be triggered for this store_id',
                },
                {
                    displayName: 'Friendly Name',
                    name: 'friendly_name',
                    type: 'string',
                    default: '',
                    description: 'Display name for the webhook',
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (webhookData.webhookId === undefined) {
                        return false;
                    }
                    const endpoint = '/webhooks';
                    try {
                        const webhooks = await GenericFunctions_1.shipStationApiRequest.call(this, 'GET', endpoint, {});
                        const existingWebhooks = webhooks.webhooks || [];
                        for (const i in existingWebhooks) {
                            if (existingWebhooks[i].WebHookID == webhookData.webhookId) {
                                return true;
                            }
                        }
                    }
                    catch (err) {
                        return false;
                    }
                    return false;
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const event = this.getNodeParameter('event', '');
                    const store_id = this.getNodeParameter('store_id');
                    const friendly_name = this.getNodeParameter('friendly_name', '');
                    const endpoint = '/webhooks/subscribe';
                    const body = {
                        'target_url': webhookUrl,
                        event,
                        store_id,
                        friendly_name,
                    };
                    const responseData = await GenericFunctions_1.shipStationApiRequest.call(this, 'POST', endpoint, body);
                    if (responseData.id === undefined) {
                        throw new Error('ShipStation webhook creation failed');
                    }
                    const webhookData = this.getWorkflowStaticData('node');
                    webhookData.webhookId = responseData.id;
                    return true;
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const endpoint = `/webhooks/${webhookData.webhookId}`;
                    try {
                        await GenericFunctions_1.shipStationApiRequest.call(this, 'DELETE', endpoint, {});
                    }
                    catch (e) {
                        return false;
                    }
                    return true;
                },
            },
        };
    }
    async webhook() {
        const bodyData = this.getBodyData();
        return {
            workflowData: [
                this.helpers.returnJsonArray(bodyData)
            ],
        };
    }
}
exports.ShipStationTrigger = ShipStationTrigger;
//# sourceMappingURL=ShipStationTrigger.node.js.map