import { notification } from 'antd';
import patchAlert from 'api/alerts/patch';
import { State } from 'hooks/useFetch';
import React, { useState } from 'react';
import { GettableAlert } from 'types/api/alerts/get';
import { PayloadProps as PatchPayloadProps } from 'types/api/alerts/patch';

import { ColumnButton } from './styles';

function ToggleAlertState({
	id,
	disabled,
	setData,
}: ToggleAlertStateProps): JSX.Element {
	const [apiStatus, setAPIStatus] = useState<State<PatchPayloadProps>>({
		error: false,
		errorMessage: '',
		loading: false,
		success: false,
		payload: undefined,
	});

	const defaultErrorMessage = 'Something went wrong';

	const onToggleHandler = async (
		id: number,
		disabled: boolean,
	): Promise<void> => {
		try {
			setAPIStatus((state) => ({
				...state,
				loading: true,
			}));

			const response = await patchAlert({
				id,
				data: {
					disabled,
				},
			});

			if (response.statusCode === 200) {
				setData((state) => {
					return state.map((alert) => {
						if (alert.id === id) {
							return {
								...alert,
								disabled: response.payload.disabled,
								state: response.payload.state,
							};
						}
						return alert;
					});
				});

				setAPIStatus((state) => ({
					...state,
					loading: false,
					payload: response.payload,
				}));
				notification.success({
					message: 'Success',
				});
			} else {
				setAPIStatus((state) => ({
					...state,
					loading: false,
					error: true,
					errorMessage: response.error || defaultErrorMessage,
				}));

				notification.error({
					message: response.error || defaultErrorMessage,
				});
			}
		} catch (error) {
			setAPIStatus((state) => ({
				...state,
				loading: false,
				error: true,
				errorMessage: defaultErrorMessage,
			}));

			notification.error({
				message: defaultErrorMessage,
			});
		}
	};

	return (
		<ColumnButton
			disabled={apiStatus.loading || false}
			loading={apiStatus.loading || false}
			onClick={(): Promise<void> => onToggleHandler(id, !disabled)}
			type="link"
		>
			{disabled ? 'Enable' : 'Disable'}
		</ColumnButton>
	);
}

interface ToggleAlertStateProps {
	id: GettableAlert['id'];
	disabled: boolean;
	setData: React.Dispatch<React.SetStateAction<GettableAlert[]>>;
}

export default ToggleAlertState;
