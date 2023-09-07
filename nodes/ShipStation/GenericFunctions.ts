import { OptionsWithUri } from 'request';

import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodePropertyOptions
} from 'n8n-workflow';

export async function shipStationApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body: object, qs?: object): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('shipstationApi');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	const base64Key = Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64');
	const options: OptionsWithUri = {
		headers: { Authorization: `Basic ${base64Key}` },
		method,
		qs,
		body,
		uri: `${(credentials.server as string).replace(/\/$/, '')}/${endpoint}`,
		json: true
	};

	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw error;
	}
}

export function validateJSON(json: string | undefined): IDataObject { // tslint:disable-line:no-any
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = {};
	}
	return result;
}
