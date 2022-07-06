import { Container, Spinner } from "react-bootstrap";

export const Logout = () => {
    window.localStorage.removeItem("user");
    window.location.replace(`${process.env.REACT_APP_API_URL}/oauth/logout`);

    return (
        <Container className="text-center">
            <Spinner animation="border" variant="warning" role="status" />
        </Container>
    );
};
