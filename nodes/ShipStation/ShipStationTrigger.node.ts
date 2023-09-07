import {
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	INodeTypeDescription,
	INodeType,
	IWebhookResponseData,
} from 'n8n-workflow';

import {
	shipStationApiRequest,
} from './GenericFunctions';

export class ShipStationTrigger implements INodeType {
	description: INodeTypeDescription = {
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

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return false;
				}
				const endpoint = '/webhooks';
				try {
					const webhooks = await shipStationApiRequest.call(this, 'GET', endpoint, {});
					const existingWebhooks = webhooks.webhooks || [];
					for (const i in existingWebhooks) {
						if (existingWebhooks[i].WebHookID == webhookData.webhookId) {
							return true;
						}
					}
				} catch (err) {
					return false;
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event', '') as string;
				const store_id = this.getNodeParameter('store_id');
				const friendly_name = this.getNodeParameter('friendly_name', '') as string;
				const endpoint = '/webhooks/subscribe';
				const body = {
					'target_url': webhookUrl,
					event,
					store_id,
					friendly_name,
				};
				const responseData = await shipStationApiRequest.call(this, 'POST', endpoint, body);

				if (responseData.id === undefined) {
					// Required data is missing so was not successful
					throw new Error('ShipStation webhook creation failed');
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData.id as string;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const endpoint = `/webhooks/${webhookData.webhookId}`;

				try {
					await shipStationApiRequest.call(this, 'DELETE', endpoint, {});
				} catch (e) {
					return false;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		return {
			workflowData: [
				this.helpers.returnJsonArray(bodyData)
			],
		};
	}
}
