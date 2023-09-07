"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ShipStationApi {
    constructor() {
        this.name = 'shipstationApi';
        this.displayName = 'Ship Station API';
        this.properties = [
            {
                displayName: 'ShipStation Server',
                name: 'server',
                type: 'string',
                default: 'https://ssapi.shipstation.com/',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'API Secret',
                name: 'apiSecret',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.ShipStationApi = ShipStationApi;
//# sourceMappingURL=ShipStationApi.credentials.js.map