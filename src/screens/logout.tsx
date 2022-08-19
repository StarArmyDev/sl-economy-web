import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";

export const Logout = () => {
    useEffect(() => {
        // window.localStorage.removeItem("user");
        window.location.replace(`${process.env.REACT_APP_API_URL}/oauth/logout`);
    });

    return (
        <Container className="text-center align-items-center">
            <Spinner animation="border" variant="warning" role="status" />
        </Container>
    );
};
