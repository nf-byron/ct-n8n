"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericFunctions_1 = require("./GenericFunctions");
const OrdersDescription_1 = require("./OrdersDescription");
class ShipStation {
    constructor() {
        this.description = {
            displayName: 'Ship Station',
            name: 'shipStation',
            icon: 'file:shipstation.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["module"] + " " + $parameter["action"]}}',
            description: 'Shipping software company',
            defaults: {
                name: 'ShipStation',
                color: '#772244',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'shipstationApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Module',
                    name: 'module',
                    type: 'options',
                    options: [
                        {
                            name: 'Orders',
                            value: 'orders',
                            description: 'Orders module.',
                        },
                        {
                            name: 'Products',
                            value: 'products',
                            description: 'Products module.',
                        },
                        {
                            name: 'Shipments',
                            value: 'shipments',
                            description: 'Shipments module.',
                        },
                    ],
                    default: '',
                    description: 'Module on which to perform the action.',
                },
                {
                    displayName: 'Action',
                    name: 'action',
                    type: 'options',
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get Entity.',
                            displayOptions: {
                                show: {
                                    module: [
                                        'orders',
                                        'products',
                                    ],
                                },
                            },
                        },
                        {
                            name: 'Query',
                            value: 'query',
                            description: 'Query Entities.',
                            displayOptions: {
                                show: {
                                    module: [
                                        'orders',
                                        'shipments',
                                    ],
                                },
                            },
                        },
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create Entity.',
                            displayOptions: {
                                show: {
                                    module: [
                                        'orders',
                                    ],
                                },
                            },
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update Entity.',
                            displayOptions: {
                                show: {
                                    module: [
                                        'orders',
                                        'products',
                                    ],
                                },
                            },
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete Entity.',
                            displayOptions: {
                                show: {
                                    module: [
                                        'orders',
                                    ],
                                },
                            },
                        },
                        {
                            name: 'List',
                            value: 'list',
                            description: 'List Entities.',
                            displayOptions: {
                                show: {
                                    module: [
                                        'products',
                                    ],
                                },
                            },
                        },
                    ],
                    default: '',
                    description: 'Action to perform.',
                },
                {
                    displayName: 'Entity ID',
                    name: 'entityId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            action: [
                                'get',
                                'delete',
                            ],
                        },
                    },
                    required: true,
                    description: 'Bean\'s ID.',
                },
                {
                    displayName: 'Fields',
                    name: 'fields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            action: [
                                'create',
                                'update',
                            ],
                        },
                    },
                    options: [
                        ...OrdersDescription_1.orderFields,
                    ],
                },
                {
                    displayName: 'Fields Data',
                    name: 'fieldsJson',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            action: [
                                'create',
                                'update',
                                'query',
                            ],
                        },
                    },
                    description: 'JSON fields that will be added to the data.',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        let responseData;
        for (let i = 0; i < length; i++) {
            const module = this.getNodeParameter('module', i);
            const moduleSingle = module.slice(0, -1);
            const action = this.getNodeParameter('action', i);
            const entityId = this.getNodeParameter('entityId', i, '');
            const fields = this.getNodeParameter('fields', i, {});
            const fieldsJson = GenericFunctions_1.validateJSON(this.getNodeParameter('fieldsJson', i, '')) || {};
            let attributes = fields;
            for (const field in fieldsJson) {
                attributes[field] = fieldsJson[field];
            }
            let body = {};
            let qs = {};
            let endpoint = '';
            let method = '';
            switch (action) {
                case 'get':
                    endpoint = `${module}/${entityId}`;
                    method = 'GET';
                    body = attributes;
                    break;
                case 'query':
                    endpoint = `${module}`;
                    method = 'GET';
                    qs = attributes;
                    break;
                case 'update':
                    attributes[`${moduleSingle}Id`] = entityId;
                case 'create':
                    endpoint = `${module}/create${moduleSingle}`;
                    method = 'POST';
                    body = attributes;
                    break;
                case 'delete':
                    endpoint = `${module}/${entityId}`;
                    method = 'DELETE';
                    break;
            }
            responseData = await GenericFunctions_1.shipStationApiRequest.call(this, method, endpoint, body, qs);
            if (Array.isArray(responseData)) {
                returnData.push.apply(returnData, responseData);
            }
            else {
                returnData.push(responseData);
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.ShipStation = ShipStation;
//# sourceMappingURL=ShipStation.node.js.map