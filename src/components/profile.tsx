import { Row, Container, Button, Col, ListGroup, Accordion, Spinner, Card } from "react-bootstrap";
import { ProfilesUserGQL, useQuery } from "../graphql";
// import { useParams } from "react-router-dom";
import { IUserObjet } from "interfaces";
import { ConvertString } from "libs";
import { FC } from "react";

export const Profile: FC<{ user: IUserObjet }> = (props) => {
    // const { id } = useParams();
    if (!props.user) {
        window.location.replace(`${process.env.REACT_APP_API_URL}/oauth/login`);
        return <></>;
    }
    const defaulURl = "https://cdn.discordapp.com/embed/avatars/0.png";
    let serversComun: { _id: string; dinero: number; banco: number }[] = [];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading, data } = useQuery(ProfilesUserGQL, { variables: { id: props.user._id } });

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    } else {
        if (serversComun.length === 0) serversComun = data.AllProfilesOfUserOnServers;

        return (
            <Container className="text-center">
                <Row className="align-items-center">
                    <Container fluid style={{ margin: "20px 0px 20px 0px" }}>
                        <div className="p-top align-middle">
                            <Row className="align-items-center">
                                <Col sm className="text-center" style={{ margin: "20px 0px 20px 0px" }}>
                                    <img
                                        alt="avatar"
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://cdn.discordapp.com/embed/avatars/3.png";
                                        }}
                                        className="img-fluid rounded"
                                        style={{ width: "25%" }}
                                        src={`https://cdn.discordapp.com/avatars/${props.user._id}/${props.user.avatar}.png?size=256`}
                                    />
                                </Col>
                                <Col sm className="text-center">
                                    <span className="h3" style={{ color: "aliceblue" }}>
                                        {props.user.username}{" "}
                                        <span className="h6" style={{ color: "rgb(21, 219, 226)" }}>
                                            #{props.user.discriminator}
                                        </span>
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </Container>

                    {/* Servidores en Común */}
                    <Col lg="12">
                        <ListGroup>
                            {serversComun.length === 0 ? (
                                <ListGroup.Item key="LI01">
                                    <Row className="align-items-center">
                                        <Col sm className="text-center">
                                            <img
                                                alt="Icon_Server_Default"
                                                style={{ borderRadius: "900px", width: "50%", margin: "0px 10px 0px 10px" }}
                                                src={defaulURl}
                                            />
                                        </Col>
                                        <Col sm={10} className="align-text-bottom text-center">
                                            No hay servidores que mostrar
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ) : null}
                            {serversComun.map((servidor) => (
                                <Accordion key={`S_${servidor._id}`}>
                                    <Accordion.Item eventKey={`S_${servidor._id}`}>
                                        <Accordion.Header>
                                            <Row className="align-items-center">
                                                <Col sm={4} className="text-center">
                                                    <img
                                                        alt="Icon_Server"
                                                        onError={(e: any) => {
                                                            e.target.onerror = null;
                                                            e.target.src = defaulURl;
                                                        }}
                                                        style={{ borderRadius: "900px", width: "50%", margin: "0px 10px 0px 10px" }}
                                                        src={
                                                            props.user.guilds.findIndex((g) => g.id === servidor._id.split("-")[0]) > -1
                                                                ? `https://cdn.discordapp.com/icons/${servidor._id.split("-")[0]}/${
                                                                      props.user.guilds.find((g) => g.id === servidor._id.split("-")[0])!.icon
                                                                  }.png?size=512`
                                                                : defaulURl
                                                        }
                                                    />
                                                </Col>
                                                <Col sm className="align-text-bottom text-center text-sm-start" style={{ margin: "20px 0px 20px 0px" }}>
                                                    {props.user.guilds.findIndex((g) => g.id === servidor._id.split("-")[0]) > -1
                                                        ? props.user.guilds.find((g) => g.id === servidor._id.split("-")[0])!.name
                                                        : `Servidor Desconocido (ID: ${servidor._id.split("-")[0]})`}
                                                </Col>
                                            </Row>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Card.Body>
                                                <Row className="align-items-center">
                                                    {/* Dinero */}
                                                    <Col sm>
                                                        <div className="box-stats z-depth-3">
                                                            <p>⭐ Dinero</p>
                                                            <span className="text-stats"> {ConvertString(servidor.dinero)} </span>
                                                        </div>
                                                    </Col>
                                                    {/* Banco */}
                                                    <Col sm>
                                                        <div className="box-stats z-depth-3">
                                                            <p>🏦 Banco</p>
                                                            <span className="text-stats"> {ConvertString(servidor.banco)} </span>
                                                        </div>
                                                    </Col>
                                                    {/* Top */}
                                                    <Col sm={2}>
                                                        <Button variant="info" href={`/leaderboard/${servidor._id.split("-")[0]}`} style={{ margin: "10%" }}>
                                                            Top
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
};
