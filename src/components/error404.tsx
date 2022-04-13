import { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export class Error404 extends Component {
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
                                    error_outline
                                </i>
                            </p>
                            Galaxia Equivocada
                        </h2>
                    </Col>
                    <Col md={12}>
                        Ocurrió un error
                        <br />
                        La pagina que buscabas no existe.
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
