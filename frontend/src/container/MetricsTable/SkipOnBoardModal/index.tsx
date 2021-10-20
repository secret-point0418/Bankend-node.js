import { Button, Typography } from 'antd';
import Modal from 'components/Modal';
import React from 'react';

const SkipOnBoardingModal = ({ onContinueClick }: Props): JSX.Element => {
	return (
		<Modal
			title={'Setup instrumentation'}
			isModalVisible={true}
			closable={false}
			footer={[
				<Button key="submit" type="primary" onClick={onContinueClick}>
					Continue without instrumentation
				</Button>,
			]}
		>
			<>
				<iframe
					width="100%"
					height="265"
					src="https://www.youtube.com/embed/Ly34WBQ2640"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
				<div>
					<Typography>No instrumentation data.</Typography>
					<Typography>
						Please instrument your application as mentioned&nbsp;
						<a
							href={'https://signoz.io/docs/instrumentation/overview'}
							target={'_blank'}
							rel="noreferrer"
						>
							here
						</a>
					</Typography>
				</div>
			</>
		</Modal>
	);
};

interface Props {
	onContinueClick: () => void;
}

export default SkipOnBoardingModal;
