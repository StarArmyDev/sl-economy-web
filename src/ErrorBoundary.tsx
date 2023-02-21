import * as Sentry from '@sentry/react';
import React from 'react';

import { ErrorUnknown } from '@app/screens';

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Sentry.ErrorBoundary fallback={() => <ErrorUnknown />}>{children}</Sentry.ErrorBoundary>;
};

export default ErrorBoundary;
