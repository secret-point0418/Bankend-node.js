import {
	APPLY_SETTINGS_TO_PANEL,
	CREATE_DEFAULT_WIDGET,
	CREATE_NEW_QUERY,
	DashboardActions,
	DELETE_DASHBOARD_SUCCESS,
	DELETE_QUERY,
	DELETE_WIDGET_SUCCESS,
	GET_ALL_DASHBOARD_ERROR,
	GET_ALL_DASHBOARD_LOADING_START,
	GET_ALL_DASHBOARD_SUCCESS,
	GET_DASHBOARD_ERROR,
	GET_DASHBOARD_LOADING_START,
	GET_DASHBOARD_SUCCESS,
	IS_ADD_WIDGET,
	QUERY_ERROR,
	QUERY_SUCCESS,
	SAVE_SETTING_TO_PANEL_SUCCESS,
	TOGGLE_EDIT_MODE,
	UPDATE_QUERY,
	UPDATE_TITLE_DESCRIPTION_TAGS_SUCCESS,
} from 'types/actions/dashboard';
import InitialValueTypes from 'types/reducer/dashboards';

const InitialValue: InitialValueTypes = {
	dashboards: [],
	loading: false,
	error: false,
	errorMessage: '',
	isEditMode: false,
	isQueryFired: false,
	isAddWidget: false,
};

const dashboard = (
	state = InitialValue,
	action: DashboardActions,
): InitialValueTypes => {
	switch (action.type) {
		case GET_ALL_DASHBOARD_LOADING_START: {
			return {
				...state,
				loading: true,
			};
		}

		case GET_DASHBOARD_LOADING_START: {
			return {
				...state,
				loading: true,
			};
		}

		case GET_ALL_DASHBOARD_SUCCESS: {
			return {
				...state,
				loading: false,
				dashboards: action.payload,
			};
		}

		case GET_DASHBOARD_SUCCESS: {
			const dashboard = action.payload;
			const { data } = dashboard;
			return {
				...state,
				loading: false,
				dashboards: [
					{
						...dashboard,
						data: {
							...data,
						},
					},
				],
			};
		}

		case GET_ALL_DASHBOARD_ERROR: {
			const { payload } = action;

			return {
				...state,
				loading: false,
				error: true,
				errorMessage: payload.errorMessage,
			};
		}

		case GET_DASHBOARD_ERROR: {
			return {
				...state,
				loading: false,
				errorMessage: action.payload.errorMessage,
				error: true,
			};
		}

		case UPDATE_TITLE_DESCRIPTION_TAGS_SUCCESS: {
			const [dashboard] = state.dashboards;

			const dashboardData = dashboard.data;
			const { tags, title, description } = action.payload;

			return {
				...state,
				dashboards: [
					{
						created_at: dashboard.created_at,
						id: dashboard.id,
						updated_at: dashboard.updated_at,
						uuid: dashboard.uuid,
						data: {
							...dashboardData,
							tags,
							title,
							description,
						},
					},
				],
			};
		}

		case TOGGLE_EDIT_MODE: {
			return {
				...state,
				isEditMode: !state.isEditMode,
			};
		}

		case DELETE_DASHBOARD_SUCCESS: {
			return {
				...state,
				dashboards: state.dashboards.filter((e) => e.uuid !== action.payload.uuid),
			};
		}

		// NOTE: this action will will be dispatched in the single dashboard only
		case CREATE_DEFAULT_WIDGET: {
			const [selectedDashboard] = state.dashboards;

			const data = selectedDashboard.data;
			const widgets = data.widgets;
			const defaultWidget = action.payload;
			const query = action.payload.query;

			const isPresent = widgets?.find((e) => e.id === action.payload.id);

			if (isPresent !== undefined) {
				return {
					...state,
				};
			}

			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
						data: {
							...data,
							widgets: [
								...(widgets || []),
								{
									...defaultWidget,
									query: query,
									id: action.payload.id,
								},
							],
						},
					},
				],
			};
		}

		case CREATE_NEW_QUERY: {
			const [selectedDashboard] = state.dashboards;

			const data = selectedDashboard.data;
			const widgets = data.widgets;
			const selectedWidgetId = action.payload.widgetId;
			const selectedWidgetIndex = data.widgets?.findIndex(
				(e) => e.id === selectedWidgetId,
			);

			const preWidget = data.widgets?.slice(0, selectedWidgetIndex);
			const afterWidget = data.widgets?.slice(
				(selectedWidgetIndex || 0) + 1, // this is never undefined
				widgets?.length,
			);

			const selectedWidget = (data.widgets || [])[selectedWidgetIndex || 0];

			// this condition will never run as there will a widget with this widgetId
			if (selectedWidget === undefined) {
				return {
					...state,
				};
			}

			const newQuery = [...selectedWidget.query, { query: '', legend: '' }];

			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
						data: {
							...data,
							widgets: [
								...(preWidget || []),
								{
									...selectedWidget,
									query: newQuery,
								},
								...(afterWidget || []),
							],
						},
					},
				],
			};
		}

		case QUERY_ERROR: {
			const { widgetId, errorMessage } = action.payload;

			const [selectedDashboard] = state.dashboards;
			const data = selectedDashboard.data;

			const selectedWidgetIndex = data.widgets?.findIndex(
				(e) => e.id === widgetId,
			);
			const widgets = data.widgets;

			const preWidget = data.widgets?.slice(0, selectedWidgetIndex);
			const afterWidget = data.widgets?.slice(
				(selectedWidgetIndex || 0) + 1, // this is never undefined
				widgets?.length,
			);
			const selectedWidget =
				(selectedDashboard.data.widgets || [])[selectedWidgetIndex || 0] || {};

			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
						data: {
							...data,
							widgets: [
								...(preWidget || []),
								{
									...selectedWidget,
									queryData: {
										...selectedWidget.queryData,
										error: true,
										errorMessage,
									},
								},
								...(afterWidget || []),
							],
						},
					},
				],
				isQueryFired: true,
			};
		}

		case QUERY_SUCCESS: {
			const { widgetId, data: queryDataResponse } = action.payload;
			const { dashboards } = state;
			const [selectedDashboard] = dashboards;
			const { data } = selectedDashboard;
			const { widgets = [] } = data;

			const selectedWidgetIndex = widgets.findIndex((e) => e.id === widgetId) || 0;

			const preWidget = widgets?.slice(0, selectedWidgetIndex) || [];
			const afterWidget =
				widgets.slice(
					selectedWidgetIndex + 1, // this is never undefined
					widgets.length,
				) || [];
			const selectedWidget = widgets[selectedWidgetIndex];

			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
						data: {
							...data,
							widgets: [
								...preWidget,
								{
									...selectedWidget,
									queryData: {
										data: [...queryDataResponse],
										error: selectedWidget.queryData.error,
										errorMessage: selectedWidget.queryData.errorMessage,
										loading: false,
									},
								},
								...afterWidget,
							],
						},
					},
				],
				isQueryFired: true,
			};
		}

		case APPLY_SETTINGS_TO_PANEL: {
			const { widgetId } = action.payload;

			const { dashboards } = state;
			const [selectedDashboard] = dashboards;
			const { data } = selectedDashboard;
			const { widgets } = data;

			const selectedWidgetIndex = data.widgets?.findIndex(
				(e) => e.id === widgetId,
			);

			const preWidget = data.widgets?.slice(0, selectedWidgetIndex) || [];
			const afterWidget =
				data.widgets?.slice(
					(selectedWidgetIndex || 0) + 1, // this is never undefined
					widgets?.length,
				) || [];

			const selectedWidget = (selectedDashboard.data.widgets || [])[
				selectedWidgetIndex || 0
			];

			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
						data: {
							...data,
							widgets: [
								...preWidget,
								{
									...selectedWidget,
									description: action.payload.description,
									id: action.payload.widgetId,
									isStacked: action.payload.isStacked,
									nullZeroValues: action.payload.nullZeroValues,
									opacity: action.payload.opacity,
									timePreferance: action.payload.timePreferance,
									title: action.payload.title,
								},
								...afterWidget,
							],
						},
					},
				],
			};
		}

		case SAVE_SETTING_TO_PANEL_SUCCESS: {
			const selectedDashboard = action.payload;
			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
					},
				],
			};
		}

		case DELETE_WIDGET_SUCCESS: {
			const { widgetId } = action.payload;

			const { dashboards } = state;
			const [selectedDashboard] = dashboards;
			const { data } = selectedDashboard;
			const { widgets = [] } = data;

			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
						data: {
							...data,
							widgets: widgets.filter((e) => e.id !== widgetId),
						},
					},
				],
			};
		}

		case IS_ADD_WIDGET: {
			return {
				...state,
				isAddWidget: action.payload.isAddWidget,
			};
		}

		case UPDATE_QUERY: {
			const { query, widgetId } = action.payload;
			const { dashboards } = state;
			const [selectedDashboard] = dashboards;
			const { data } = selectedDashboard;
			const { widgets = [] } = data;

			const selectedWidgetIndex = widgets.findIndex((e) => e.id === widgetId) || 0;

			const preWidget = widgets?.slice(0, selectedWidgetIndex) || [];
			const afterWidget =
				widgets?.slice(
					selectedWidgetIndex + 1, // this is never undefined
					widgets.length,
				) || [];

			const selectedWidget = widgets[selectedWidgetIndex];

			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
						data: {
							...data,
							widgets: [
								...preWidget,
								{
									...selectedWidget,
									query,
								},
								...afterWidget,
							],
						},
					},
				],
			};
		}

		case DELETE_QUERY: {
			const { currentIndex, widgetId } = action.payload;
			const { dashboards } = state;
			const [selectedDashboard] = dashboards;
			const { data } = selectedDashboard;
			const { widgets = [] } = data;

			const selectedWidgetIndex = widgets.findIndex((e) => e.id === widgetId) || 0;

			const preWidget = widgets?.slice(0, selectedWidgetIndex) || [];
			const afterWidget =
				widgets?.slice(
					selectedWidgetIndex + 1, // this is never undefined
					widgets.length,
				) || [];

			const selectedWidget = widgets[selectedWidgetIndex];

			const query = selectedWidget.query;

			const preQuery = query.slice(0, currentIndex);
			const postQuery = query.slice(currentIndex + 1, query.length);

			return {
				...state,
				dashboards: [
					{
						...selectedDashboard,
						data: {
							...data,
							widgets: [
								...preWidget,
								{
									...selectedWidget,
									query: [...preQuery, ...postQuery],
								},
								...afterWidget,
							],
						},
					},
				],
			};
		}
		default:
			return state;
	}
};

export default dashboard;
