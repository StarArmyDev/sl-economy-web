import { Container, Row, Col, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

export const Error500 = () => {
    const prevPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        window.history.back();
    };

    return (
        <Container>
            <Helmet>
                <title>Error Interno</title>
            </Helmet>
            <Row className="text-center pt-4">
                <Col md={12}>
                    <h2>
                        <p>
                            <i className="material-icons" style={{ fontSize: '300%' }}>
                                cloud_queue
                            </i>
                        </p>
                        Nube de polvo
                    </h2>
                </Col>
                <Col md={12}>
                    Ocurrió un error
                    <br />
                    Hubo un problema en algún lugar, pero no te preocupes, no es tu culpa.
                </Col>
                <Col md={12} className="pt-4">
                    <Button onClick={prevPage}>
                        <i className="material-icons align-middle">reply</i>Volver
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
