import { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export class Error403 extends Component {
    return = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        window.history.back();
    };

    render() {
        return (
            <Container>
                <Row className="text-center pt-4">
                    <Col md={12}>
                        <h2>
                            <p>
                                <i className="material-icons" style={{ fontSize: "300%" }}>
                                    lock_outline
                                </i>
                            </p>
                            No Autorizado
                        </h2>
                    </Col>
                    <Col md={12}>
                        Lugar equivocado
                        <br />
                        No tienes acceso a la pagina que intentabas entar.
                    </Col>
                    <Col md={12} className="pt-4">
                        <Button onClick={this.return}>
                            <i className="material-icons align-middle">reply</i>Volver
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}
