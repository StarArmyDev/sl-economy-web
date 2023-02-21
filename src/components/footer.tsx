import { Container, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer>
            <Container>
                <Row className="p-2 text-center">
                    <Col sm>
                        <p className="p-1 pt-4">
                            StarLight un bot proporcionado por{' '}
                            <Link to="/about" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                StarArmy
                            </Link>
                        </p>
                        <p className="p-1">Todos los derechos reservados</p>
                    </Col>
                    <Col sm={5}>
                        <Row>
                            <h3>Más</h3>
                            <Link to="/terms" className="p-1" style={{ textDecoration: 'none' }}>
                                Términos y condiciones
                            </Link>
                            <Link to="/privacy" className="p-1" style={{ textDecoration: 'none' }}>
                                Política de Privacidad
                            </Link>
                        </Row>
                    </Col>
                    <Col sm={12} className="pt-5 pb-4">
                        Sitio web y bot de Discord desarrollado y mantenido por{' '}
                        <Link to="/developer" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            DavichoStar
                        </Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};
