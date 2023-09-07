import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';


export class ShipStationApi implements ICredentialType {
	name = 'shipstationApi';
	displayName = 'Ship Station API';
	properties = [
		{
			displayName: 'ShipStation Server',
			name: 'server',
			type: 'string' as NodePropertyTypes,
			default: 'https://ssapi.shipstation.com/',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
