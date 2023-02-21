import { RouterProvider, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserTracing } from '@sentry/tracing';
import { Alert } from 'react-bootstrap';
import * as Sentry from '@sentry/react';
import { Provider } from 'react-redux';
import React from 'react';

import { store, persistor, useAppDispatch, WebAction } from '@app/storage';
import { LoadingSpinner } from '@app/components';
import type { AlertMessage } from '@app/models';
import { getUserDetails } from '@app/services';
import ErrorBoundary from '@app/ErrorBoundary';
import { EventRegister } from '@app/helpers';
import { I18nProvider } from '@app/i18n';
import { router } from '@app/navigation';

import '@ionic/react/css/core.css';

//? Sentry
Sentry.init({
    dsn: 'https://e1d7fdd0c94248989d531eca33d3c062@o512819.ingest.sentry.io/4504718653980672',
    release: `${import.meta.env.VITE_NAME}@${import.meta.env.VITE_VERSION}`,
    environment: import.meta.env.MODE,
    integrations: [
        new BrowserTracing({
            tracePropagationTargets: ['localhost', 'trackcash.ideosoftware.com.mx', /^\//],
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                React.useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes,
            ),
            tracingOrigins: ['localhost', 'trackcash.ideosoftware.com.mx', /^\//],
        }),
    ],
    normalizeDepth: 10,
    tracesSampleRate: import.meta.env.MODE === 'production' ? 1.0 : 0,
    beforeSend(event) {
        // Compruebe si es una excepción, y si es así, muestre el cuadro de diálogo del informe
        if (event.exception) {
            Sentry.showReportDialog({ eventId: event.event_id });
        }
        return event;
    },
});

//? CLiente de consultas
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

//! Clase App principal
const App = () => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = React.useState(true);
    const [initializing, setInitializing] = React.useState(true);
    const [alertMessage, setAlertMessage] = React.useState<AlertMessage>({ show: false, message: '' });
    const [timeout, setTimeo] = React.useState<NodeJS.Timeout>();

    const userDetails = useQuery(
        ['getUserDetails'],
        async () => {
            const user = await getUserDetails();

            if (user) dispatch(WebAction.onSetUser(user));
            setIsLoading(false);

            return user;
        },
        { enabled: false },
    );

    React.useEffect(() => {
        const init = async () => {
            setInitializing(false);

            await userDetails.refetch();

            EventRegister.on('changeLoaging', state => {
                setIsLoading(state);

                // Si después de un tiempo, el loading no se ha desactivado, se desactiva.
                if (!state && timeout) {
                    clearTimeout(timeout);
                    setTimeo(undefined);
                } else
                    setTimeo(
                        setTimeout(() => {
                            setIsLoading(false);
                        }, 8_000 /* 8 segundos */),
                    );
            });

            EventRegister.on('changeAlert', state => {
                setAlertMessage(state);
            });
        };

        if (initializing) init();
    }, [initializing]);

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <Alert
                show={!!alertMessage?.show}
                variant={alertMessage?.variant}
                className="text-center m-0 mx-md-5"
                dismissible
                style={{ zIndex: 999, position: 'absolute', top: 10, left: 0, right: 0 }}
                onClose={() => setAlertMessage(prev => ({ ...prev!, show: false }))}>
                {alertMessage?.title && <Alert.Heading>{alertMessage?.title}</Alert.Heading>}
                {alertMessage?.message}
            </Alert>
            {!initializing && <RouterProvider router={router} />}
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
                    </I18nProvider>
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    </ErrorBoundary>
);

export default Sentry.withProfiler(AppProvider);
