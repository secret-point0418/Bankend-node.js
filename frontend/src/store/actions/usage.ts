import { Dispatch } from "redux";
import metricsAPI from "../../api/metricsAPI";
import { ActionTypes } from "./types";
import { GlobalTime } from "./global";
import { toUTCEpoch } from "../../utils/timeUtils";

export interface usageDataItem {
	timestamp: number;
	count: number;
}

export interface getUsageDataAction {
	type: ActionTypes.getUsageData;
	payload: usageDataItem[];
}

export const getUsageData = (
	minTime: number,
	maxTime: number,
	step: number,
	service: string,
) => {
	return async (dispatch: Dispatch) => {
		let request_string = `usage?start=${toUTCEpoch(minTime)}&end=${toUTCEpoch(
			maxTime,
		)}&step=${step}&service=${service ? service : ""}`;
		//Step can only be multiple of 3600
		const response = await metricsAPI.get<usageDataItem[]>(request_string);

		dispatch<getUsageDataAction>({
			type: ActionTypes.getUsageData,
			payload: response.data,
			//PNOTE - response.data in the axios response has the actual API response
		});
	};
};
