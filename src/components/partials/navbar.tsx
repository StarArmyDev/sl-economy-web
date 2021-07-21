import { Navbar, Container, Nav, NavDropdown, Col, Row, Spinner } from "react-bootstrap";
import { UpdateGuildsGQL, useMutation, useQuery, UserGuildsGQL } from "../../graphql";
import { CLIENT_ID } from "../../Constants";
import { Fragment, useState } from "react";
import iconImg from "../../img/icon.png";

export function NavBar(props: any) {
    const { loading, data, error, refetch } = useQuery(UserGuildsGQL, { variables: { id: props.user ? props.user._id! : "0" } });
    const [updateUserGuilds] = useMutation(UpdateGuildsGQL);
    const [guilds, setGuilds] = useState({ admin: [], adminMutual: [], mutual: [] });
    const [changes, setChanges] = useState(true);
    let windowReference: Window | null;

    async function reloaderGuilds() {
        setGuilds(
            (
                await updateUserGuilds({
                    variables: {
                        id: props.user ? props.user._id! : "0"
                    }
                })
            ).data.updateGuilds
        );
        await refetch();
        setChanges(true);
    }

    function loader(datos: any) {
        setGuilds(datos);
        setChanges(false);
    }

    if (!loading && !error && changes) loader(data.getUserGuilds);

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
                            <Spinner animation="border" variant="warning" role="status" />
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
                                                        href={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=268437520&scope=bot&response_type=code&guild_id=${
                                                            servidor.id
                                                        }&redirect_uri=${process.env.REACT_APP_REDIRECT_URL?.replace(/\//gi, "%2F").replace(/:/gi, "%3A")}`}
                                                    >
                                                        <Row>
                                                            <Col lg="1" className="material-icons">
                                                                add
                                                            </Col>
                                                            <Col lg="10">{servidor.name}</Col>
                                                        </Row>
                                                    </NavDropdown.Item>
                                                ))}
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item key="reloader" onClick={reloaderGuilds}>
                                                    <Row>
                                                        <Col lg="1" className="material-icons">
                                                            refresh
                                                        </Col>
                                                        <Col lg="10">Refrescar</Col>
                                                    </Row>
                                                </NavDropdown.Item>
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
                                <Nav.Link
                                    onClick={() => {
                                        if (windowReference == null || windowReference.closed) {
                                            windowReference = window.open(
                                                `${process.env.REACT_APP_API_URL}/oauth/login`,
                                                "",
                                                "toolbar=0,status=0,width=400,height=800"
                                            );
                                        } else {
                                            windowReference.focus();
                                        }

                                        let origin: string | null;

                                        if (windowReference)
                                            setInterval(() => {
                                                try {
                                                    origin = windowReference!.location.origin;
                                                } catch (_) {
                                                    origin = null;
                                                }

                                                if (origin && origin === window.location.origin) {
                                                    windowReference!.close();
                                                    window.location.reload();
                                                }
                                            }, 500);
                                    }}
                                >
                                    Inciar Sesión
                                </Nav.Link>
                            </Fragment>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
