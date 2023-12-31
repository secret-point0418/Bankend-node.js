/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/// <reference types="@welldone-software/why-did-you-render" />
// ^ https://github.com/welldone-software/why-did-you-render/issues/161
import * as React from 'react';

if (process.env.NODE_ENV === 'development') {
	const whyDidYouRender = require('@welldone-software/why-did-you-render');
	whyDidYouRender(React, {
		trackAllPureComponents: false,
		trackExtraHooks: [[require('react-redux/lib'), 'useSelector']],
		include: [/^ConnectFunction/],
		logOnDifferentValues: true,
	});
}

export default '';
