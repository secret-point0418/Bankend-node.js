import { Card, Typography } from 'antd';
import GridGraphComponent from 'container/GridGraphComponent';
import { NewWidgetProps } from 'container/NewWidget';
import getChartData from 'lib/getChartData';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { AppState } from 'store/reducers';
import DashboardReducer from 'types/reducer/dashboards';

import { NotFoundContainer } from './styles';

const WidgetGraph = ({ selectedGraph }: WidgetGraphProps): JSX.Element => {
	const { dashboards } = useSelector<AppState, DashboardReducer>(
		(state) => state.dashboards,
	);

	const [selectedDashboard] = dashboards;
	const { data } = selectedDashboard;
	const { widgets = [] } = data;
	const { search } = useLocation();

	const params = new URLSearchParams(search);
	const widgetId = params.get('widgetId');

	const selectedWidget = widgets.find((e) => e.id === widgetId);

	if (selectedWidget === undefined) {
		return <Card>Invalid widget</Card>;
	}

	const { queryData, title, opacity, isStacked } = selectedWidget;

	if (queryData.data.length === 0) {
		return (
			<NotFoundContainer>
				<Typography>No Data</Typography>
			</NotFoundContainer>
		);
	}

	const chartDataSet = getChartData({
		queryData,
	});

	return (
		<GridGraphComponent
			title={title}
			isStacked={isStacked}
			opacity={opacity}
			data={chartDataSet}
			GRAPH_TYPES={selectedGraph}
		/>
	);
};

type WidgetGraphProps = NewWidgetProps;

export default WidgetGraph;
