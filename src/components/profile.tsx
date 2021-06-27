import { Row, Container, Button, Col, ListGroup, Accordion, Spinner } from "react-bootstrap";
import { ProfilesUserGQL, useQuery } from "../graphql";
import { IUserObjet } from "../interfaces";

export function Profile(props: { match: any; user: IUserObjet }) {
    if (!props.user) {
        window.location.replace(`${process.env.REACT_APP_API_URL}/oauth/login`);
        return <></>;
    }
    const defaulURl = "https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png";
    let serversComun = [];

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
                    <Container fluid>
                        <div className="p-top align-middle">
                            <Row className="align-items-center">
                                <Col sm className="text-center" style={{ margin: "20px 0px 20px 0px" }}>
                                    <img
                                        alt=""
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.src = defaulURl;
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
                            {serversComun.length > 0 ? (
                                <ListGroup.Item key="LI0">
                                    <Button variant="info" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false">
                                        Ver Todos los Perfiles
                                    </Button>
                                </ListGroup.Item>
                            ) : (
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
                            )}
                            {serversComun.map((servidor: { _id: string; dinero: number; banco: number }) => (
                                <Accordion>
                                    <ListGroup.Item key={`LI${servidor._id}`}>
                                        <Row className="align-items-center">
                                            <Col sm className="text-center">
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
                                                              }.png?size=256`
                                                            : defaulURl
                                                    }
                                                />
                                            </Col>
                                            <Col sm={8} className="align-text-bottom text-left">
                                                {props.user.guilds.findIndex((g) => g.id === servidor._id.split("-")[0]) > -1
                                                    ? props.user.guilds.find((g) => g.id === servidor._id.split("-")[0])!.name
                                                    : `Servidor Desconocido (ID: ${servidor._id.split("-")[0]})`}
                                            </Col>
                                            <Col sm className="text-right">
                                                <Accordion.Toggle as={Button} eventKey={`S_${servidor._id}`}>
                                                    Perfil
                                                </Accordion.Toggle>
                                                <Button type="button" href={`/leaderboard/${servidor._id.split("-")[0]}`} style={{ margin: "10%" }}>
                                                    Top
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <Accordion.Collapse className="multi-collapse" eventKey={`S_${servidor._id}`}>
                                        <div className="card card-body">
                                            <div className="row">
                                                {/* Dinero */}
                                                <Col sm>
                                                    <div className="box-stats z-depth-3">
                                                        <p>⭐ Dinero</p>
                                                        <span className="text-stats"> {servidor.dinero} </span>
                                                    </div>
                                                </Col>
                                                {/* Banco */}
                                                <Col sm>
                                                    <div className="box-stats z-depth-3">
                                                        <p>🏦 Banco</p>
                                                        <span className="text-stats"> {servidor.banco} </span>
                                                    </div>
                                                </Col>
                                            </div>
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}
