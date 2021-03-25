import { Fragment, useState } from "react";
import { Spinner, Container, ListGroup, Col, Row, Badge, Button, Card } from "react-bootstrap";
import { GuildGQL, ProfileGQL, useQuery } from "../graphql";
import { IUserObjet } from "../interfaces";
import { ConverString } from "../libs";

export function LeaderBoard(props: { match: any; user: IUserObjet; history: any }) {
    const id = props.match && props.match.params && props.match.params.id ? props.match.params.id : null;
    const defaulURl =
        "https://images-ext-1.discordapp.net/external/NAqkMZNPJgDiWBrSDqniAD1_sbWfiPqF4mgZyCtVs6s/https/discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png";
    const [userRank, setUserRank] = useState({
        position: 0,
        dinero: 0,
        banco: 0
    });

    const [orden, setOrden] = useState({ dinero: -1, banco: -1 } as { _id?: number; dinero?: number; banco?: number });

    const { loading, error, data } = useQuery(ProfileGQL, { variables: { id, orden } });
    const GuildData = useQuery(GuildGQL, { variables: { id } });

    if (loading || GuildData.loading)
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    else if (error || GuildData.error) {
        return (
            <Container className="text-center">
                <Row className="text-center pt-4">
                    <Col md={12}>
                        <h2>
                            <p>
                                <i className="material-icons" style={{ fontSize: "300%" }}>
                                    search_off
                                </i>
                            </p>
                            Servidor No Encontrado
                        </h2>
                    </Col>
                    <Col md={12}>
                        Lugar equivocado
                        <br />
                        Este servidor no existe o no estoy en él ¡Invitame!
                    </Col>
                    <Col md={12} className="pt-4">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                props.history.goBack();
                            }}
                        >
                            <i className="material-icons align-middle">reply</i>Volver
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        const list: any[] = data.AllProfilesInServer;
        if (props.user && userRank.position === 0) {
            list.forEach((user, i) => {
                if ((user._id as string).split("-")[1] === props.user._id) {
                    setUserRank({
                        position: i + 1,
                        dinero: user.dinero,
                        banco: user.banco
                    });
                }
            });
        }

        let guildDiscord = GuildData.data.getGuild;

        return (
            <Container>
                <Row>
                    <Col></Col>
                    <Col lg={8}>
                        {guildDiscord ? (
                            <Card className="text-center bg-warning">
                                <Row className="align-items-center">
                                    <Col sm={4}>
                                        <img
                                            alt="Guild Icon"
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.target.src = defaulURl;
                                            }}
                                            className="img-fluid rounded"
                                            style={{ width: "40%", margin: "5%" }}
                                            src={`https://cdn.discordapp.com/icons/${id}/${guildDiscord.icon}.png?size=128`}
                                        />
                                    </Col>
                                    <Col>
                                        <h4>{guildDiscord.name}</h4>
                                    </Col>
                                </Row>
                            </Card>
                        ) : null}
                        <ListGroup>
                            {list.length > 2 ? (
                                <Row>
                                    <Col className="text-center">
                                        <Button variant="outline-warning" style={{ margin: "1% 2% 1% 2%" }} onClick={() => setOrden({ dinero: -1 })}>
                                            Dinero
                                        </Button>

                                        <Button variant="outline-warning" style={{ margin: "1% 2% 1% 2%" }} onClick={() => setOrden({ banco: -1 })}>
                                            Banco
                                        </Button>

                                        <Button variant="outline-warning" style={{ margin: "1% 2% 1% 2%" }} onClick={() => setOrden({ dinero: -1, banco: -1 })}>
                                            Total
                                        </Button>
                                    </Col>
                                </Row>
                            ) : null}
                            {props.user && list.length > 0 ? (
                                <Fragment>
                                    <ListGroup.Item key="rank">
                                        <Row className="align-items-center">
                                            <Col sm={1} className="text-center">
                                                <h4>
                                                    <Badge variant="primary" pill>
                                                        {ConverString(userRank.position)}
                                                    </Badge>
                                                </h4>
                                            </Col>
                                            <Col sm className="text-start">
                                                <img
                                                    alt=""
                                                    onError={(e: any) => {
                                                        e.target.onerror = null;
                                                        e.target.src = defaulURl;
                                                    }}
                                                    style={{ borderRadius: "900px", width: "15%", margin: "0px 10px 0px 10px" }}
                                                    src={`https://cdn.discordapp.com/avatars/${props.user._id}/${props.user.avatar}.png?size=256`}
                                                />
                                                {props.user.username}
                                            </Col>
                                            <Col sm={4} className="text-center">
                                                <Row>
                                                    <Col xs>Dinero: {ConverString(userRank.dinero)}</Col>
                                                    <Col xs>Banco: {ConverString(userRank.banco)}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <hr />
                                </Fragment>
                            ) : null}
                            {list.length < 1 ? (
                                <ListGroup.Item key="rank">
                                    <Row className="align-items-center">
                                        <Col sm={1} className="text-center"></Col>
                                        <Col sm className="text-start">
                                            <img alt="" style={{ borderRadius: "900px", width: "15%", margin: "0px 10px 0px 10px" }} src={defaulURl} />
                                            Sin datos
                                        </Col>
                                        <Col sm={4} className="text-center"></Col>
                                    </Row>
                                </ListGroup.Item>
                            ) : (
                                list.map((dato: any, index) => (
                                    <ListGroup.Item key={`U${index}`}>
                                        <Row className="align-items-center">
                                            <Col sm={1} className="text-center">
                                                <h4>
                                                    <Badge variant="primary" pill>
                                                        {ConverString(++index)}
                                                    </Badge>
                                                </h4>
                                            </Col>
                                            <Col sm className="text-start">
                                                <img
                                                    alt=""
                                                    onError={(e: any) => {
                                                        e.target.onerror = null;
                                                        e.target.src = defaulURl;
                                                    }}
                                                    style={{ borderRadius: "900px", width: "15%", margin: "0px 10px 0px 10px" }}
                                                    src={
                                                        dato.user && dato.user.avatar
                                                            ? `https://cdn.discordapp.com/avatars/${dato.user._id}/${dato.user.avatar}.png?size=64`
                                                            : defaulURl
                                                    }
                                                />
                                                {dato.user ? dato.user.username : `ID: ${(dato._id as string).split("-")[1]}`}
                                            </Col>
                                            <Col sm={4} className="text-center">
                                                <Row>
                                                    <Col xs>Dinero: {ConverString(dato.dinero)}</Col>
                                                    <Col xs>Banco: {ConverString(dato.banco)}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        );
    }
}
