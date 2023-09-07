"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function shipStationApiRequest(method, endpoint, body, qs) {
    const credentials = this.getCredentials('shipstationApi');
    if (credentials === undefined) {
        throw new Error('No credentials got returned!');
    }
    const base64Key = Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64');
    const options = {
        headers: { Authorization: `Basic ${base64Key}` },
        method,
        qs,
        body,
        uri: `${credentials.server.replace(/\/$/, '')}/${endpoint}`,
        json: true
    };
    console.log('options', options);
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw error;
    }
}
exports.shipStationApiRequest = shipStationApiRequest;
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = {};
    }
    return result;
}
exports.validateJSON = validateJSON;
//# sourceMappingURL=GenericFunctions.js.map