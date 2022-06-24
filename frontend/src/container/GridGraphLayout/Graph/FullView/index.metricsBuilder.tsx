import { Button, Typography } from 'antd';
import { GraphOnClickHandler } from 'components/Graph';
import Spinner from 'components/Spinner';
import TimePreference from 'components/TimePreferenceDropDown';
import GridGraphComponent from 'container/GridGraphComponent';
import {
	timeItems,
	timePreferance,
} from 'container/NewWidget/RightContainer/timeItems';
import getChartData from 'lib/getChartData';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { GetMetricQueryRange } from 'store/actions/dashboard/getQueryResults';
import { AppState } from 'store/reducers';
import { ErrorResponse, SuccessResponse } from 'types/api';
import { Widgets } from 'types/api/dashboard/getAll';
import { MetricRangePayloadProps } from 'types/api/metrics/getQueryRange';
import { GlobalReducer } from 'types/reducer/globalTime';

import { NotFoundContainer, TimeContainer } from './styles';

function FullView({
	widget,
	fullViewOptions = true,
	onClickHandler,
	name,
	yAxisUnit,
}: FullViewProps): JSX.Element {
	const { selectedTime: globalSelectedTime } = useSelector<
		AppState,
		GlobalReducer
	>((state) => state.globalTime);

	const getSelectedTime = useCallback(
		() =>
			timeItems.find((e) => e.enum === (widget?.timePreferance || 'GLOBAL_TIME')),
		[widget],
	);

	const [selectedTime, setSelectedTime] = useState<timePreferance>({
		name: getSelectedTime()?.name || '',
		enum: widget?.timePreferance || 'GLOBAL_TIME',
	});
	const response = useQuery<
		SuccessResponse<MetricRangePayloadProps> | ErrorResponse
	>(
		`FullViewGetMetricsQueryRange-${selectedTime.enum}-${globalSelectedTime}`,
		() =>
			GetMetricQueryRange({
				selectedTime: selectedTime.enum,
				graphType: widget.panelTypes,
				query: widget.query,
				globalSelectedInterval: globalSelectedTime,
			}),
	);

	const isError = response?.error;
	const isLoading = response.isLoading === true;
	const errorMessage = isError instanceof Error ? isError?.message : '';

	if (isLoading) {
		return <Spinner height="100%" size="large" tip="Loading..." />;
	}
	if (isError || !response?.data?.payload?.data?.result) {
		return (
			<NotFoundContainer>
				<Typography>{errorMessage}</Typography>
			</NotFoundContainer>
		);
	}

	return (
		<>
			{fullViewOptions && (
				<TimeContainer>
					<TimePreference
						{...{
							selectedTime,
							setSelectedTime,
						}}
					/>
					<Button
						onClick={(): void => {
							response.refetch();
						}}
						type="primary"
					>
						Refresh
					</Button>
				</TimeContainer>
			)}

			<GridGraphComponent
				{...{
					GRAPH_TYPES: widget.panelTypes,
					data: getChartData({
						queryData: [
							{
								queryData: response.data?.payload?.data?.result
									? response.data?.payload?.data?.result
									: [],
							},
						],
					}),
					isStacked: widget.isStacked,
					opacity: widget.opacity,
					title: widget.title,
					onClickHandler,
					name,
					yAxisUnit,
				}}
			/>
		</>
	);
}

interface FullViewProps {
	widget: Widgets;
	fullViewOptions?: boolean;
	onClickHandler?: GraphOnClickHandler;
	name: string;
	yAxisUnit?: string;
}

FullView.defaultProps = {
	fullViewOptions: undefined,
	onClickHandler: undefined,
	yAxisUnit: undefined,
};

export default FullView;
