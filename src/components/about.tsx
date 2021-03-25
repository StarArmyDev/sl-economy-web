import { Component } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";

export class About extends Component {
    render() {
        return (
            <Container>
                <Row className="text-center pt-4">
                    <Col md={12}>
                        <ins
                            className="adsbygoogle"
                            style={{ display: "block" }}
                            data-ad-client="ca-pub-2365658233726619"
                            data-ad-slot="5039508803"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        ></ins>
                        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                    </Col>

                    <Col sm={12}>
                        <Image src="stararmy.png" rounded style={{ width: "200px" }} />
                    </Col>
                    <Col sm={12}>
                        <h1>StarArmy Soporte</h1>
                    </Col>
                    <Col md={12}>
                        <h4>¿Quienes Somos?</h4>
                        <p>
                            Este proyecto se inició con <a href="https://github.com/DavichoStar">DavichoStar</a> y se han sumando distintas personas al equipo
                            como moderadores y soportes.
                        </p>

                        <p>
                            Lo que buscamos es crear la soluciones a las comunidades de otros servidores, bots y código en español, soporte mas cercano al
                            creador de los mismos, un lugar donde su opinión se escucha y no es ignorada.
                        </p>
                        <h4>¿Qué podrás encontrar en nuestro servidor?</h4>
                        <p>
                            Un lugar donde pedir ayuda sobre los bots, ayuda con tu código, enterarte de todas las novedades, solucionar problemas, participar
                            en eventos, pero sobre todo es para socializar y convivir con el staff o con los miembros.
                        </p>
                        <h4>Nuestros Bots</h4>
                        <p>
                            - StarLight <a href="https://top.gg/bot/517786947171909643">TopGG</a>
                        </p>
                        <p>
                            - StarLight Economy <a href="https://top.gg/bot/696723299459268728">TopGG</a>
                        </p>
                        <br />
                        <p>
                            Puedes visitar <a href="https://github.com/StarArmyDev">StarArmyDev</a> pronto llegará cosas mas grandes.
                        </p>
                    </Col>
                    <Col md={12}>
                        <Button variant="info" href="https://discord.gg/VG6D4ss">
                            Servidor De Soporte
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}
