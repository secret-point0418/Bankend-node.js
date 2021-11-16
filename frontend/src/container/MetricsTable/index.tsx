import Table, { ColumnsType } from 'antd/lib/table';
import { SKIP_ONBOARDING } from 'constants/onboarding';
import ROUTES from 'constants/routes';
import history from 'lib/history';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { servicesListItem } from 'store/actions/MetricsActions/metricsInterfaces';
import { AppState } from 'store/reducers';
import MetricReducer from 'types/reducer/metrics';

import SkipBoardModal from './SkipOnBoardModal';
import { Container, Name } from './styles';

const Metrics = (): JSX.Element => {
	const [skipOnboarding, setSkipOnboarding] = useState(
		localStorage.getItem(SKIP_ONBOARDING) === 'true',
	);

	const { services, loading, error } = useSelector<AppState, MetricReducer>(
		(state) => state.metrics,
	);

	const onContinueClick = (): void => {
		localStorage.setItem(SKIP_ONBOARDING, 'true');
		setSkipOnboarding(true);
	};

	const onClickHandler = (to: string): void => {
		history.push(to);
	};

	if (
		(services.length === 0 && loading === false && !skipOnboarding) ||
		(loading == false && error === true)
	) {
		return <SkipBoardModal onContinueClick={onContinueClick} />;
	}

	const columns: ColumnsType<DataProps> = [
		{
			title: 'Application',
			dataIndex: 'serviceName',
			key: 'serviceName',
			// eslint-disable-next-line react/display-name
			render: (text: string): JSX.Element => (
				<div onClick={(): void => onClickHandler(ROUTES.APPLICATION + '/' + text)}>
					<Name>{text}</Name>
				</div>
			),
		},
		{
			title: 'P99 latency (in ms)',
			dataIndex: 'p99',
			key: 'p99',
			sorter: (a: DataProps, b: DataProps): number => a.p99 - b.p99,
			render: (value: number): string => (value / 1000000).toFixed(2),
		},
		{
			title: 'Error Rate (in %)',
			dataIndex: 'errorRate',
			key: 'errorRate',
			sorter: (a: DataProps, b: DataProps): number => a.errorRate - b.errorRate,
			render: (value: number): string => value.toFixed(2),
		},
		{
			title: 'Requests Per Second',
			dataIndex: 'callRate',
			key: 'callRate',
			sorter: (a: DataProps, b: DataProps): number => a.callRate - b.callRate,
			render: (value: number): string => value.toFixed(2),
		},
	];

	return (
		<Container>
			<Table
				loading={loading}
				dataSource={services}
				columns={columns}
				pagination={false}
				rowKey="serviceName"
			/>
		</Container>
	);
};

type DataProps = servicesListItem;

export default Metrics;
