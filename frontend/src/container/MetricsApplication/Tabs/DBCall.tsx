import { Col } from 'antd';
import FullView from 'container/GridGraphLayout/Graph/FullView';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Widgets } from 'types/api/dashboard/getAll';

import { Card, GraphContainer, GraphTitle, Row } from '../styles';

const DBCall = ({ getWidget }: DBCallProps): JSX.Element => {
	const { servicename } = useParams<{ servicename?: string }>();

	return (
		<>
			<Row gutter={24}>
				<Col span={12}>
					<Card>
						<GraphTitle>Database Calls RPS</GraphTitle>
						<GraphContainer>
							<FullView
								noDataGraph
								fullViewOptions={false}
								widget={getWidget([
									{
										query: `sum(rate(signoz_db_latency_count{service_name="${servicename}"}[1m])) by (db_system)`,
										legend: '{{db_system}}',
									},
								])}
							/>
						</GraphContainer>
					</Card>
				</Col>

				<Col span={12}>
					<Card>
						<GraphTitle>Database Calls Avg Duration (in ms)</GraphTitle>
						<GraphContainer>
							<FullView
								noDataGraph
								fullViewOptions={false}
								widget={getWidget([
									{
										query: `sum(rate(signoz_db_latency_sum{service_name="${servicename}"}[5m]))/sum(rate(signoz_db_latency_count{service_name="${servicename}"}[5m]))`,
										legend: '',
									},
								])}
							/>
						</GraphContainer>
					</Card>
				</Col>
			</Row>
		</>
	);
};

interface DBCallProps {
	getWidget: (query: Widgets['query']) => Widgets;
}

export default DBCall;
