import { Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Component } from "react";

export class Footer extends Component {
    render() {
        return (
            <footer>
                <Container>
                    <Row className="p-2 text-center">
                        <Col sm>
                            <p className="p-1">
                                StarLight un bot proporcionado por{" "}
                                <Link to="/about" rel="noreferrer" style={{ textDecoration: "none" }}>
                                    StarArmy
                                </Link>
                            </p>
                            <p className="p-1">Todos los derechos reservados</p>
                        </Col>
                        {/* <Col sm={5}>
                            <Row>
                                <Link to="/" className="nav-link p-1">
                                    Términos de Uso
                                </Link>
                                <Link to="/" className="nav-link p-1">
                                    Privacidad
                                </Link>
                                <Link to="/" className="nav-link p-1">
                                    Política de cookies
                                </Link>
                            </Row>
                        </Col> */}
                    </Row>
                </Container>
            </footer>
        );
    }
}
