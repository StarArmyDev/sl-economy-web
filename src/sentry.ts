import * as Sentry from '@sentry/react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import React from 'react';

Sentry.init({
    dsn: 'https://e1d7fdd0c94248989d531eca33d3c062@o512819.ingest.sentry.io/4504718653980672',
    release: `${import.meta.env.VITE_NAME}@${import.meta.env.VITE_VERSION}`,
    environment: import.meta.env.MODE,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect: React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
        Sentry.replayIntegration({
            // @ts-ignore ignore
            collectFonts: true,
            inlineImages: true,
            blockAllMedia: false,
            maskAllInputs: false,
            maskAllText: false,
        }),
        Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error', 'info'] }),
        Sentry.feedbackIntegration({
            colorScheme: 'system',
        }),
    ],
    enableLogs: true,
    sendDefaultPii: true,
    normalizeDepth: 10,
    tracesSampleRate: import.meta.env.MODE === 'production' ? 1.0 : 0,
    replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.4 : 0,
    replaysOnErrorSampleRate: import.meta.env.MODE === 'production' ? 1.0 : 0,
    beforeSend(event) {
        if (event.exception) {
            Sentry.showReportDialog({ eventId: event.event_id });
        }
        return event;
    },
});

export default Sentry;
