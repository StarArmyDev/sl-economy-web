import { Container, Spinner } from "react-bootstrap";
import { CLIENT_ID } from "Constants";
import Helmet from "react-helmet";

export const Invite = () => {
    window.location.replace(
        `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=268437520&scope=bot%20applications.commands&response_type=code`
    );

    return (
        <Container
            style={{
                height: "67vh",
                width: "100vw",
                position: "relative",
                zIndex: 9999,
                alignItems: "center",
                justifyContent: "center",
                display: "flex"
            }}
        >
            <Helmet>
                <title>SL-Economy | Invitame</title>
            </Helmet>
            <Spinner animation="border" variant="warning" role="status" />
        </Container>
    );
};
