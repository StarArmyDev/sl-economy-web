import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export function Developer() {
    const ButtonMailto = ({ mailto, label }: { mailto: string; label: string }) => {
        return (
            <Link
                to=""
                onClick={e => {
                    window.location.href = mailto;
                    e.preventDefault();
                }}>
                {label}
            </Link>
        );
    };

    return (
        <Container>
            <Helmet>
                <title>Acerca del desarrollador</title>
            </Helmet>
            <Row className="text-center pt-4">
                <Col md={12}>
                    <h1>
                        <p>
                            <i className="material-icons" style={{ fontSize: '300%' }}>
                                code
                            </i>
                        </p>
                        Acerca del desarrollador
                    </h1>
                </Col>
                <Col md={12}>
                    <h3>¡Hola! 👋 Soy DavichoStar</h3>
                </Col>
            </Row>

            <Row className="text-center pt-4">
                <p>Soy el creador de esta página y los bots StarLight e StarLight Economy (La luz de las estrellas)</p>
                <p>
                    Soy un desarrollador mexicano con experiencia en ReactJS, React Native/Expo, TypeScript, NodeJS, Flutter principalmente
                    pero también conozco de Java, Micronaut, Grails, Symfony, Python con menor habilidad.
                </p>
                <p>
                    Soy desarrollador FUll-Stack, enfocado más en mobile y web, también soy técnico en diseño gráfico digital pero me
                    apasioné por la programación con StarLight, lo cual me llevó a estudiar una ingeniería en sistemas computacionales
                    actualmente y el conjunto de todo esto me permitieron crear bots, con sus diseños y banners, sus páginas web y su
                    servidor de soporte en Discord.
                </p>
                <h3>Cómo puedes contactarme</h3>
                <p>
                    Correo: <ButtonMailto label="davichostar@protonmail.com" mailto="mailto:davichostar@protonmail.com" />
                </p>
                <p>Discord: DavichoStar</p>
                <p>
                    Mi página web:{' '}
                    <a href="https://davichostar.dev" target="_blank" rel="noreferrer">
                        DavichoStar.dev
                    </a>
                </p>
            </Row>
        </Container>
    );
}
