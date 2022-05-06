import api from 'api';
import { Dispatch } from 'redux';
import { GlobalTime } from 'types/actions/globalTime';

import { ActionTypes } from './types';

export interface ServiceMapStore {
	items: ServicesMapItem[];
	services: ServicesItem[];
	loading: boolean;
}

export interface ServicesItem {
	serviceName: string;
	p99: number;
	avgDuration: number;
	numCalls: number;
	callRate: number;
	numErrors: number;
	errorRate: number;
	num4XX: number;
	fourXXRate: number;
}

export interface ServicesMapItem {
	parent: string;
	child: string;
	callCount: number;
}

export interface ServiceMapItemAction {
	type: ActionTypes.getServiceMapItems;
	payload: ServicesMapItem[];
}

export interface ServicesAction {
	type: ActionTypes.getServices;
	payload: ServicesItem[];
}

export interface ServiceMapLoading {
	type: ActionTypes.serviceMapLoading;
	payload: {
		loading: ServiceMapStore['loading'];
	};
}

export const getDetailedServiceMapItems = (globalTime: GlobalTime) => {
	return async (dispatch: Dispatch): Promise<void> => {
		const start = `${globalTime.minTime}`;
		const end = `${globalTime.maxTime}`;

		const serviceMapPayload = {
			start,
			end,
			tags: [],
		};
		const [serviceMapDependenciesResponse, response] = await Promise.all([
			api.post<ServicesMapItem[]>(`/serviceMapDependencies`, serviceMapPayload),
			api.post<ServicesItem[]>(`/services`, serviceMapPayload),
		]);

		dispatch<ServicesAction>({
			type: ActionTypes.getServices,
			payload: response.data,
		});

		dispatch<ServiceMapItemAction>({
			type: ActionTypes.getServiceMapItems,
			payload: serviceMapDependenciesResponse.data,
		});

		dispatch<ServiceMapLoading>({
			type: ActionTypes.serviceMapLoading,
			payload: {
				loading: false,
			},
		});
	};
};
