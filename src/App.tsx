import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistGate } from 'redux-persist/integration/react';
import { Analytics } from '@vercel/analytics/react';
import { setupIonicReact } from '@ionic/react';
import { Alert } from 'react-bootstrap';
import * as Sentry from '@sentry/react';
import { Provider } from 'react-redux';
import React, { useEffect } from 'react';

import { store, persistor, useAppDispatch, useAppSelector } from '@app/storage';
import { LoadingSpinner } from '@app/components';
import { getUserDetails } from '@app/services';
import ErrorBoundary from '@app/ErrorBoundary';
import { I18nProvider } from '@app/i18n';
import { router } from '@app/navigation';
import { setUser } from '@app/storage/slices/webSlice';
import { setLoading, setAlert } from '@app/storage/slices/uiSlice';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/palettes/dark.always.css';

setupIonicReact();

//? Cliente de consultas
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // Retry only once to avoid annoying the user if API is down
            retry: 1,
        },
    },
});

//! Clase App principal
const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, alertMessage } = useAppSelector(state => state.ui);

    const { data: user, isFetching } = useQuery({
        queryKey: ['getUserDetails'],
        queryFn: getUserDetails,
        refetchOnMount: true,
    });

    // Sync user state
    useEffect(() => {
        if (user !== undefined) {
            dispatch(setUser(user || null));

            if (user) {
                Sentry.setUser({
                    id: user._id,
                    username: user.username,
                    discriminator: user.discriminator,
                    permissions: user.permissions || [],
                    premium: user.premium,
                    guilds: user.guilds || [],
                });
            } else {
                Sentry.setUser(null);
            }
        }
    }, [user, dispatch]);

    // Sync loading state
    useEffect(() => {
        // Only set loading to false when fetching is done
        // If we want to show loading spinner initially, we can keep isLoading default true in redux
        // and set it to false when isFetching becomes false for the first time.
        if (!isFetching) {
            dispatch(setLoading(false));
        }
    }, [isFetching, dispatch]);

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <Alert
                show={!!alertMessage?.show}
                variant={alertMessage?.variant}
                className="text-center m-0 mx-md-5"
                dismissible
                style={{ zIndex: 999, position: 'absolute', top: 10, left: 0, right: 0 }}
                onClose={() => dispatch(setAlert({ ...alertMessage, show: false }))}>
                {alertMessage?.title && <Alert.Heading>{alertMessage?.title}</Alert.Heading>}
                {alertMessage?.message}
            </Alert>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    );
};

const AppProvider: React.FC = () => (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <I18nProvider>
                        <App />
                        <Analytics />
                    </I18nProvider>
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    </ErrorBoundary>
);

export default Sentry.withProfiler(AppProvider);
