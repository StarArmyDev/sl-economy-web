import { Spinner, Container, ListGroup, Col, Row, Badge, Button, Card } from "react-bootstrap";
import { GuildGQL, ProfileGQL, useQuery } from "../graphql";
import React, { Fragment, useState, FC } from "react";
import type { IPerfil, IUserObjet } from "interfaces";
import { ConvertString, EventRegister } from "libs";
import { useParams } from "react-router-dom";
import Helmet from "react-helmet";

export const LeaderBoard: FC<{ user?: IUserObjet }> = (props) => {
    const { id } = useParams();
    const defaulURl = "https://cdn.discordapp.com/embed/avatars/0.png";
    const [userRank, setUserRank] = useState({
        position: -1,
        dinero: 0,
        banco: 0
    });

    const [usersList, setUsersList] = useState<IPerfil[]>([]);
    const [guildDiscord, setGuildDiscord] = useState<any>();
    const [limit, setLimit] = useState(20);
    const [orden, setOrden] = useState({ total: -1 } as { _id?: number; dinero?: number; banco?: number; total?: number });

    const { loading, error, data } = useQuery<{
        AllProfilesInServer: {
            userRank: {
                position: number;
                profile: IPerfil;
            };
            profiles: IPerfil[];
        };
    }>(ProfileGQL, { variables: { id, orden, userId: props.user?._id } });
    const GuildData = useQuery(GuildGQL, { variables: { id } });

    EventRegister.on("scroll", (e: any) => {
        const target = e.target;

        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
            setLimit(limit + 20);
        }
    });

    React.useEffect(() => {
        if (data) {
            const list = data.AllProfilesInServer.profiles;
            if (props.user && userRank.position !== data!.AllProfilesInServer.userRank.position) {
                setUserRank({
                    position: data!.AllProfilesInServer.userRank.position,
                    dinero: data!.AllProfilesInServer.userRank.profile?.dinero || 0,
                    banco: data!.AllProfilesInServer.userRank.profile?.banco || 0
                });
            }

            setGuildDiscord(GuildData.data.getGuild);
            setUsersList(list);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (loading || GuildData.loading)
        return (
            <Container
                style={{
                    height: "67vh",
                    width: "100vw",
                    position: "relative",
                    zIndex: 9999,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex"
                }}
            >
                <Helmet>
                    <title>SL-Economy | Leaderboard</title>
                </Helmet>
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
                            onClick={(e: any) => {
                                e.preventDefault();
                                // Regresar a la página anterior
                                window.history.back();
                            }}
                        >
                            <i className="material-icons align-middle">reply</i>Volver
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        return (
            <Container>
                <Helmet>
                    <title>Leaderboard | {guildDiscord?.name || ""}</title>
                </Helmet>
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
                                                e.currentTarget.onerror = null;
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
                            {usersList.length > 2 ? (
                                <Row>
                                    <Col className="text-center">
                                        <Button variant="outline-warning" style={{ margin: "1% 2% 1% 2%" }} onClick={() => setOrden({ dinero: -1 })}>
                                            Dinero
                                        </Button>

                                        <Button variant="outline-warning" style={{ margin: "1% 2% 1% 2%" }} onClick={() => setOrden({ banco: -1 })}>
                                            Banco
                                        </Button>

                                        <Button variant="outline-warning" style={{ margin: "1% 2% 1% 2%" }} onClick={() => setOrden({ total: -1 })}>
                                            Total
                                        </Button>
                                    </Col>
                                </Row>
                            ) : null}
                            {props.user && usersList.length > 0 ? (
                                <Fragment>
                                    <ListGroup.Item key="rank">
                                        <Row className="align-items-center">
                                            <Col sm={1} className="text-center">
                                                <h4>
                                                    <Badge bg="primary" pill>
                                                        {ConvertString(userRank.position)}
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
                                                    <Col xs>Dinero: {ConvertString(userRank.dinero)}</Col>
                                                    <Col xs>Banco: {ConvertString(userRank.banco)}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <hr />
                                </Fragment>
                            ) : null}
                            {usersList.length < 1 ? (
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
                                usersList.slice(0, limit).map((dato: any, index) => (
                                    <ListGroup.Item key={`U${index}`}>
                                        <Row className="align-items-center">
                                            <Col sm={1} className="text-center">
                                                <h4>
                                                    <Badge bg="primary" pill>
                                                        {ConvertString(++index)}
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
                                                    <Col xs>Dinero: {ConvertString(dato.dinero)}</Col>
                                                    <Col xs>Banco: {ConvertString(dato.banco)}</Col>
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
};
