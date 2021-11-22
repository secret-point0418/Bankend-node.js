import { Action, ActionTypes, usageDataItem } from 'store/actions';

export const usageDataReducer = (
	state: usageDataItem[] = [{ timestamp: 0, count: 0 }],
	action: Action,
): usageDataItem[] => {
	switch (action.type) {
		case ActionTypes.getUsageData:
			return action.payload;
		default:
			return state;
	}
};
