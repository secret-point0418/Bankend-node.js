// Action creator must have a type and optionally a payload
import { ActionTypes } from './types'

export interface TagItem {
    key: string;
    value: string;
    operator: 'equals'|'contains';
}

export interface LatencyValue {
    min:string;
    max:string;
}

export interface TraceFilters{
    tags?: TagItem[];
    service?:string;
    latency?:LatencyValue;
    operation?:string;
}

//define interface for action. Action creator always returns object of this type
export interface updateTraceFiltersAction {
    type: ActionTypes.updateTraceFilters,
    payload: TraceFilters,
}

export const updateTraceFilters = (traceFilters: TraceFilters) => {
    console.log('in update trace filters',traceFilters)
    return {
        type: ActionTypes.updateTraceFilters,
        payload: traceFilters,
    };

};

export interface updateInputTagAction {
    type: ActionTypes.updateInput,
    payload: string,
}

export const updateInputTag = (Input: string) => {

    return {
        type: ActionTypes.updateInput,
        payload: Input,
    };
};

//named export when you want to export multiple functions from the same file
