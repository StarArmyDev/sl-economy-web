import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react';
import { HelmetProvider } from 'react-helmet-async';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import React from 'react';

import '@app/styles/discord-theme.css';
import '@css/index.css';
import App from './App';
import './sentry';

const isDev = import.meta.env.MODE === 'development';

const link = new HttpLink({ uri: `${import.meta.env.VITE_API_URL}/graphql` });
const cache = new InMemoryCache();

const client = new ApolloClient({
    link,
    cache,
    devtools: { enabled: isDev },
    //credentials: 'same-origin', //includes
});

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container!, {
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
        console.warn('Uncaught error', error, errorInfo.componentStack);
    }),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </HelmetProvider>
    </React.StrictMode>,
);
