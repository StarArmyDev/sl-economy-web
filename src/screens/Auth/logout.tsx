import { Container, Spinner } from 'react-bootstrap';
import * as Sentry from '@sentry/react';
import React from 'react';

import { useAppDispatch } from '@app/storage';
import { setUser } from '@app/storage/slices/webSlice';

export const Logout: React.FC = () => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        // window.localStorage.removeItem("user");

        dispatch(setUser(null));
        Sentry.setUser(null);
        window.location.replace(`${import.meta.env.VITE_API_URL}/oauth/logout`);
    });

    return (
        <Container
            style={{
                height: '67vh',
                width: '100vw',
                position: 'relative',
                zIndex: 9999,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
            }}>
            <Spinner animation="border" variant="warning" role="status" />
        </Container>
    );
};
