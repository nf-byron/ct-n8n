import { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions } from 'n8n-core';
import { IDataObject } from 'n8n-workflow';
export declare function shipStationApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body: object, qs?: object): Promise<any>;
export declare function validateJSON(json: string | undefined): IDataObject;
