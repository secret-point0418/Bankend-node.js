import { SaveOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import createAlertsApi from 'api/alerts/create';
import Editor from 'components/Editor';
import ROUTES from 'constants/routes';
import { State } from 'hooks/useFetch';
import history from 'lib/history';
import React, { useCallback, useRef, useState } from 'react';
import { PayloadProps as CreateAlertPayloadProps } from 'types/api/alerts/create';

import { ButtonContainer, Title } from './styles';

const CreateAlert = (): JSX.Element => {
	const value = useRef<string>(
		`\n        alert: <alert name>\n        expr: system_cpu_load_average_1m > 0.01\n        for: 0m\n        labels:\n            severity: warning\n        annotations:\n            summary: High CPU load\n            description: "CPU load is > 0.01\n  VALUE = {{ $value }}\n LABELS = {{ $labels }}"\n    `,
	);

	const [newAlertState, setNewAlertState] = useState<
		State<CreateAlertPayloadProps>
	>({
		error: false,
		errorMessage: '',
		loading: false,
		payload: undefined,
		success: false,
	});
	const [notifications, Element] = notification.useNotification();

	const onSaveHandler = useCallback(async () => {
		try {
			setNewAlertState((state) => ({
				...state,
				loading: true,
			}));

			if (value.current.length === 0) {
				setNewAlertState((state) => ({
					...state,
					loading: false,
				}));
				notifications.error({
					description: `Oops! We didn't catch that. Please make sure the alert settings are not empty or try again`,
					message: 'Error',
				});
				return;
			}

			const response = await createAlertsApi({
				query: value.current,
			});

			if (response.statusCode === 200) {
				setNewAlertState((state) => ({
					...state,
					loading: false,
					payload: response.payload,
				}));
				notifications.success({
					message: 'Success',
					description: 'Congrats. The alert was saved correctly.',
				});

				setTimeout(() => {
					history.push(ROUTES.LIST_ALL_ALERT);
				}, 3000);
			} else {
				notifications.error({
					description:
						response.error ||
						'Oops! Some issue occured in saving the alert please try again or contact support@signoz.io',
					message: 'Error',
				});
				setNewAlertState((state) => ({
					...state,
					loading: false,
					error: true,
					errorMessage:
						response.error ||
						'Oops! Some issue occured in saving the alert please try again or contact support@signoz.io',
				}));
			}
		} catch (error) {
			notifications.error({
				message:
					'Oops! Some issue occured in saving the alert please try again or contact support@signoz.io',
			});
		}
	}, [notifications]);

	return (
		<>
			{Element}

			<Title>Create New Alert</Title>
			<Editor value={value} />

			<ButtonContainer>
				<Button
					loading={newAlertState.loading || false}
					type="primary"
					onClick={onSaveHandler}
					icon={<SaveOutlined />}
				>
					Save
				</Button>
			</ButtonContainer>
		</>
	);
};

export default CreateAlert;
