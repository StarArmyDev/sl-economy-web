import { Fragment } from "react";
import { Navbar, Container, Nav, NavDropdown, Col, Row, Spinner } from "react-bootstrap";
import { useQuery, gql } from "@apollo/client";
import iconImg from "../../img/icon.jpg";
import { CLIENT_ID } from "../../Constants";

export function NavBar(props: any) {
    const USER_GUILDS = gql`
        query UserGuilds($id: String) {
            getUserGuilds(id: $id) {
                admin {
                    ...Datos
                }
                adminMutual {
                    ...Datos
                }
                mutual {
                    ...Datos
                }
            }
        }

        fragment Datos on Guild {
            id
            name
            icon
            owner
            permissions
        }
    `;
    const { loading, data, error } = useQuery(USER_GUILDS, { variables: { id: props.user ? props.user._id! : "0" } });

    let guilds = { admin: [], adminMutual: [], mutual: [] };

    if (!loading && !error) guilds = data.getUserGuilds;

    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand className="text-center" href="/">
                    <img className="rounded" src={iconImg} alt="StarLight Economy Logo" style={{ width: "50%" }} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarNav">
                    <Nav>
                        <Nav.Link href="/invite">Invitar</Nav.Link>
                        <Nav.Link href="/commands">Comandos</Nav.Link>
                        <Nav.Link href="/about">Acerca De</Nav.Link>
                        <Nav.Link href="https://stats.uptimerobot.com/yX0r2hN910">Status</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end" id="navbarNav">
                    <Nav>
                        {props.loading ? (
                            <Spinner animation="border" variant="warning" role="status">
                                <span className="sr-only">Cargando...</span>
                            </Spinner>
                        ) : props && props.user ? (
                            <Fragment>
                                {props.loading ? (
                                    <Container className="justify-content-center">
                                        <Spinner animation="border" variant="warning" />{" "}
                                    </Container>
                                ) : props && props.user && props.user.guilds && props.user.guilds.length > 0 ? (
                                    <NavDropdown title="Dashboard" id="dropdown-guilds">
                                        {loading ? (
                                            <Spinner animation="border" variant="warning" role="status">
                                                <span className="sr-only">Cargando...</span>
                                            </Spinner>
                                        ) : (
                                            <Fragment>
                                                {guilds.adminMutual.map((servidor: any) => (
                                                    <NavDropdown.Item key={`NI${servidor.id}`} href={`/dashboard/${servidor.id}`}>
                                                        <Row>
                                                            <Col lg="1" className="material-icons">
                                                                settings
                                                            </Col>
                                                            <Col lg="10">{servidor.name}</Col>
                                                        </Row>
                                                    </NavDropdown.Item>
                                                ))}
                                                {guilds.admin.length > 0 ? <NavDropdown.Divider /> : null}
                                                {guilds.admin.map((servidor: any) => (
                                                    <NavDropdown.Item
                                                        key={`NI${servidor.id}`}
                                                        href={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=268437520&scope=bot&response_type=code&guild_id=${servidor.id}`}
                                                    >
                                                        <Row>
                                                            <Col lg="1" className="material-icons">
                                                                add
                                                            </Col>
                                                            <Col lg="10">{servidor.name}</Col>
                                                        </Row>
                                                    </NavDropdown.Item>
                                                ))}
                                            </Fragment>
                                        )}
                                    </NavDropdown>
                                ) : null}
                                <Nav.Link href="/profile">
                                    {props && props.user ? (
                                        <img
                                            className="rounded"
                                            style={{ borderRadius: 1, margin: "0px 10px 0px 10px" }}
                                            src={`https://cdn.discordapp.com/avatars/${props.user._id}/${props.user.avatar}.png?size=32`}
                                            alt="Profile_Icon"
                                        />
                                    ) : null}
                                    {props.user.username}
                                </Nav.Link>
                                <Nav.Link href="/logout">Cerrar Sesión</Nav.Link>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Nav.Link href={`${process.env.REACT_APP_API_URL}/oauth/login`}>Inciar Sesión</Nav.Link>
                            </Fragment>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
