import React from 'react';

import QueryTypeTag from '../QueryTypeTag';

function PlotTag({ queryType }): JSX.Element | null {
	if (queryType === undefined) {
		return null;
	}

	return (
		<div style={{ marginLeft: '2rem', position: 'absolute', top: '1rem' }}>
			Plotted using <QueryTypeTag queryType={queryType} />
		</div>
	);
}

export default PlotTag;
