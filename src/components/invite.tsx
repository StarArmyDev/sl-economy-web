import { Component } from "react";
import { Container, Spinner } from "react-bootstrap";
import { CLIENT_ID } from "../Constants";

export class Invite extends Component {
    render() {
        window.location.replace(
            `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=268437520&scope=bot%20applications.commands&response_type=code`
        );
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    }
}
