/* eslint-disable */
// @ts-nocheck
import { Col } from 'antd';
import FullView from 'container/GridGraphLayout/Graph/FullView/index.metricsBuilder';
import {
	databaseCallsAvgDuration,
	databaseCallsRPS,
} from 'container/MetricsApplication/MetricsPageQueries/DBCallQueries';
import useResourceAttribute from 'hooks/useResourceAttribute';
import {
	convertRawQueriesToTraceSelectedTags,
	resourceAttributesToTagFilterItems,
} from 'hooks/useResourceAttribute/utils';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Widgets } from 'types/api/dashboard/getAll';

import { Card, GraphContainer, GraphTitle, Row } from '../styles';
import { Button } from './styles';
import {
	dbSystemTags,
	handleNonInQueryRange,
	onGraphClickHandler,
	onViewTracePopupClick,
} from './util';

function DBCall({ getWidgetQueryBuilder }: DBCallProps): JSX.Element {
	const { servicename } = useParams<{ servicename?: string }>();
	const [selectedTimeStamp, setSelectedTimeStamp] = useState<number>(0);
	const { queries } = useResourceAttribute();

	const tagFilterItems = useMemo(
		() =>
			handleNonInQueryRange(resourceAttributesToTagFilterItems(queries)) || [],
		[queries],
	);

	const selectedTraceTags: string = useMemo(
		() =>
			JSON.stringify(
				convertRawQueriesToTraceSelectedTags(queries).concat(...dbSystemTags) || [],
			),
		[queries],
	);

	const legend = '{{db_system}}';

	const databaseCallsRPSWidget = useMemo(
		() =>
			getWidgetQueryBuilder({
				queryType: 1,
				promQL: [],
				// TODO: change it later to actual builder
				metricsBuilder: databaseCallsRPS({
					servicename,
					legend,
					tagFilterItems,
				}),
				clickHouse: [],
			}),
		[getWidgetQueryBuilder, servicename, tagFilterItems],
	);
	const databaseCallsAverageDurationWidget = useMemo(
		() =>
			getWidgetQueryBuilder({
				queryType: 1,
				promQL: [],
				// TODO: change it later to actual builder
				metricsBuilder: databaseCallsAvgDuration({
					servicename,
					tagFilterItems,
				}),
				clickHouse: [],
			}),
		[getWidgetQueryBuilder, servicename, tagFilterItems],
	);

	return (
		<Row gutter={24}>
			<Col span={12}>
				<Button
					type="default"
					size="small"
					id="database_call_rps_button"
					onClick={onViewTracePopupClick({
						servicename,
						selectedTraceTags,
						timestamp: selectedTimeStamp,
					})}
				>
					View Traces
				</Button>
				<Card>
					<GraphTitle>Database Calls RPS</GraphTitle>
					<GraphContainer>
						<FullView
							name="database_call_rps"
							fullViewOptions={false}
							widget={databaseCallsRPSWidget}
							yAxisUnit="reqps"
							onClickHandler={(ChartEvent, activeElements, chart, data): void => {
								onGraphClickHandler(setSelectedTimeStamp)(
									ChartEvent,
									activeElements,
									chart,
									data,
									'database_call_rps',
								);
							}}
						/>
					</GraphContainer>
				</Card>
			</Col>

			<Col span={12}>
				<Button
					type="default"
					size="small"
					id="database_call_avg_duration_button"
					onClick={onViewTracePopupClick({
						servicename,
						selectedTraceTags,
						timestamp: selectedTimeStamp,
					})}
				>
					View Traces
				</Button>
				<Card>
					<GraphTitle>Database Calls Avg Duration</GraphTitle>
					<GraphContainer>
						<FullView
							name="database_call_avg_duration"
							fullViewOptions={false}
							widget={databaseCallsAverageDurationWidget}
							yAxisUnit="ms"
							onClickHandler={(ChartEvent, activeElements, chart, data): void => {
								onGraphClickHandler(setSelectedTimeStamp)(
									ChartEvent,
									activeElements,
									chart,
									data,
									'database_call_avg_duration',
								);
							}}
						/>
					</GraphContainer>
				</Card>
			</Col>
		</Row>
	);
}

interface DBCallProps {
	getWidgetQueryBuilder: (query: Widgets['query']) => Widgets;
}

export default DBCall;
