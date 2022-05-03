import { CopyOutlined } from '@ant-design/icons';
import { Button, Input, notification, Select, Space, Tooltip } from 'antd';
import getResetPasswordToken from 'api/user/getResetPasswordToken';
import ROUTES from 'constants/routes';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useCopyToClipboard } from 'react-use';
import { AppState } from 'store/reducers';
import AppReducer from 'types/reducer/app';
import { ROLES } from 'types/roles';

import { InputGroup, SelectDrawer, Title } from './styles';

const { Option } = Select;

function EditMembersDetails({
	emailAddress,
	name,
	role,
	setEmailAddress,
	setName,
	setRole,
}: EditMembersDetailsProps): JSX.Element {
	const [passwordLink, setPasswordLink] = useState<string>('');

	const { t } = useTranslation(['common']);
	const { user } = useSelector<AppState, AppReducer>((state) => state.app);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [state, copyToClipboard] = useCopyToClipboard();

	useEffect(() => {
		return (): void => {
			setName('');
			setRole('VIEWER');
			setEmailAddress('');
		};
	}, [setEmailAddress, setName, setRole]);

	const getPasswordLink = (token: string): string => {
		return `${window.location.origin}${ROUTES.PASSWORD_RESET}?token=${token}`;
	};

	const onChangeHandler = useCallback(
		(setFunc: React.Dispatch<React.SetStateAction<string>>, value: string) => {
			setFunc(value);
		},
		[],
	);

	useEffect(() => {
		if (state.error) {
			notification.error({
				message: t('something_went_wrong'),
			});
		}

		if (state.value) {
			notification.success({
				message: t('success'),
			});
		}
	}, [state.error, state.value, t]);

	const onPasswordChangeHandler = useCallback((event) => {
		setPasswordLink(event.target.value);
	}, []);

	const onGeneratePasswordHandler = async (): Promise<void> => {
		try {
			setIsLoading(true);
			const response = await getResetPasswordToken({
				userId: user?.userId || '',
			});

			if (response.statusCode === 200) {
				setPasswordLink(getPasswordLink(response.payload.token));
			} else {
				notification.error({
					message:
						response.error ||
						t('something_went_wrong', {
							ns: 'common',
						}),
				});
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);

			notification.error({
				message: t('something_went_wrong', {
					ns: 'common',
				}),
			});
		}
	};

	return (
		<Space direction="vertical" size="large">
			<Space direction="horizontal">
				<Title>Email address</Title>
				<Input
					placeholder="john@signoz.io"
					readOnly
					onChange={(event): void =>
						onChangeHandler(setEmailAddress, event.target.value)
					}
					disabled={isLoading}
					value={emailAddress}
				/>
			</Space>
			<Space direction="horizontal">
				<Title>Name (optional)</Title>
				<Input
					placeholder="John"
					onChange={(event): void => onChangeHandler(setName, event.target.value)}
					value={name}
					disabled={isLoading}
				/>
			</Space>
			<Space direction="horizontal">
				<Title>Role</Title>
				<SelectDrawer
					value={role}
					onSelect={(value: unknown): void => {
						if (typeof value === 'string') {
							setRole(value as ROLES);
						}
					}}
					disabled={isLoading}
				>
					<Option value="ADMIN">ADMIN</Option>
					<Option value="VIEWER">VIEWER</Option>
					<Option value="EDITOR">EDITOR</Option>
				</SelectDrawer>
			</Space>

			<Button
				loading={isLoading}
				disabled={isLoading}
				onClick={onGeneratePasswordHandler}
				type="primary"
			>
				Generate Reset Password link
			</Button>
			{passwordLink && (
				<InputGroup>
					<Input
						style={{ width: '100%' }}
						defaultValue="git@github.com:ant-design/ant-design.git"
						onChange={onPasswordChangeHandler}
						value={passwordLink}
						disabled={isLoading}
					/>
					<Tooltip title="COPY LINK">
						<Button
							icon={<CopyOutlined />}
							onClick={(): void => copyToClipboard(passwordLink)}
						/>
					</Tooltip>
				</InputGroup>
			)}
		</Space>
	);
}

interface EditMembersDetailsProps {
	emailAddress: string;
	name: string;
	role: ROLES;
	setEmailAddress: React.Dispatch<React.SetStateAction<string>>;
	setName: React.Dispatch<React.SetStateAction<string>>;
	setRole: React.Dispatch<React.SetStateAction<ROLES>>;
}

export default EditMembersDetails;
