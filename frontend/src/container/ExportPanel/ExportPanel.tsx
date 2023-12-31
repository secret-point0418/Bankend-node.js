import { Button, Typography } from 'antd';
import createDashboard from 'api/dashboard/create';
import axios from 'axios';
import { useGetAllDashboard } from 'hooks/dashboard/useGetAllDashboard';
import { useNotifications } from 'hooks/useNotifications';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { ExportPanelProps } from '.';
import {
	DashboardSelect,
	NewDashboardButton,
	SelectWrapper,
	Title,
	Wrapper,
} from './styles';
import { getSelectOptions } from './utils';

function ExportPanel({ isLoading, onExport }: ExportPanelProps): JSX.Element {
	const { notifications } = useNotifications();
	const { t } = useTranslation(['dashboard']);

	const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(
		null,
	);

	const {
		data,
		isLoading: isAllDashboardsLoading,
		refetch,
	} = useGetAllDashboard();

	const {
		mutate: createNewDashboard,
		isLoading: createDashboardLoading,
	} = useMutation(createDashboard, {
		onSuccess: (data) => {
			onExport(data?.payload || null);
			refetch();
		},
		onError: (error) => {
			if (axios.isAxiosError(error)) {
				notifications.error({
					message: error.message,
				});
			}
		},
	});

	const options = useMemo(() => getSelectOptions(data?.payload || []), [data]);

	const handleExportClick = useCallback((): void => {
		const currentSelectedDashboard = data?.payload?.find(
			({ uuid }) => uuid === selectedDashboardId,
		);

		onExport(currentSelectedDashboard || null);
	}, [data, selectedDashboardId, onExport]);

	const handleSelect = useCallback(
		(selectedDashboardValue: string): void => {
			setSelectedDashboardId(selectedDashboardValue);
		},
		[setSelectedDashboardId],
	);

	const handleNewDashboard = useCallback(async () => {
		createNewDashboard({
			title: t('new_dashboard_title', {
				ns: 'dashboard',
			}),
			uploadedGrafana: false,
		});
	}, [t, createNewDashboard]);

	const isDashboardLoading = isAllDashboardsLoading || createDashboardLoading;

	const isDisabled =
		isAllDashboardsLoading ||
		!options?.length ||
		!selectedDashboardId ||
		isLoading;

	return (
		<Wrapper direction="vertical">
			<Title>Export Panel</Title>

			<SelectWrapper direction="horizontal">
				<DashboardSelect
					placeholder="Select Dashboard"
					options={options}
					loading={isDashboardLoading}
					disabled={isDashboardLoading}
					value={selectedDashboardId}
					onSelect={handleSelect}
				/>
				<Button
					type="primary"
					loading={isLoading}
					disabled={isDisabled}
					onClick={handleExportClick}
				>
					Export
				</Button>
			</SelectWrapper>

			<Typography>
				Or create dashboard with this panel -
				<NewDashboardButton
					disabled={createDashboardLoading}
					loading={createDashboardLoading}
					type="link"
					onClick={handleNewDashboard}
				>
					New Dashboard
				</NewDashboardButton>
			</Typography>
		</Wrapper>
	);
}

export default ExportPanel;
