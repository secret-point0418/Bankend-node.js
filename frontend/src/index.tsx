import './wdyr';
import './ReactI18';

import AppRoutes from 'AppRoutes';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import reportWebVitals from 'reportWebVitals';
import store from 'store';

if (process.env.NODE_ENV === 'development') {
	reportWebVitals(console.log);
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

ReactDOM.render(
	<QueryClientProvider client={queryClient}>
		<Provider store={store}>
			<React.StrictMode>
				<AppRoutes />
			</React.StrictMode>
		</Provider>
		{process.env.NODE_ENV === 'development' && (
			<ReactQueryDevtools initialIsOpen />
		)}
	</QueryClientProvider>,
	document.querySelector('#root'),
);
