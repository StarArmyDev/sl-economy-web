import { Container, Row, Col, Image } from "react-bootstrap";
import { Component } from "react";

export class About extends Component {
    render() {
        return (
            <Container>
                <Row className="text-center pt-4">
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
                        <img
                            alt=""
                            onClick={() => {
                                window.open("https://discord.gg/VG6D4ss", "", "toolbar=yes");
                            }}
                            src="https://discordapp.com/api/guilds/491819854307917826/embed.png?style=banner3"
                        />
                    </Col>
                    <Col md={12}>
                        <br />
                        <br />
                        <p>De México 🇲🇽 para el mundo ❤️</p>
                    </Col>
                </Row>
            </Container>
        );
    }
}
