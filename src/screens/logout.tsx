import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';

export const Logout = () => {
    useEffect(() => {
        // window.localStorage.removeItem("user");
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
