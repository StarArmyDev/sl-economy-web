import { Component, Fragment } from 'react';
import { Navbar, Container, Nav, NavDropdown, Col, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import iconImg from '../../img/icon.jpg';
import { IGuildObjet } from '../../interfaces';
import { API_URL } from '../../Constants';

export default class NavBar extends Component<any> {
    state = {
        loading: true,
        servers: [] as IGuildObjet[],
        serversAdmin: [] as IGuildObjet[],
    };

    getGuilds() {
        if (this.props.user && this.props.user.guilds && this.state.serversAdmin.length < 1 && this.state.servers.length < 1) {
            var servers: any[] = [];

            axios
                .get(`${API_URL}/guild`)
                .then((res) => {
                    var guild = res.data;
                    servers = guild;
                })
                .catch(() => this.setState({ loading: false }));

            setTimeout(() => {
                this.props.user.guilds.forEach(async (g: IGuildObjet) => {
                    if ((g.permissions & 2146958591) === 2146958591 && servers.find((gd) => gd.id === g.id) && !this.state.servers.find((gd) => gd.id === g.id))
                        this.state.servers.push(g);
                    else if (
                        (g.permissions & 2146958591) === 2146958591 &&
                        !this.state.servers.find((gd) => gd.id === g.id) &&
                        !this.state.serversAdmin.find((gd) => gd.id === g.id)
                    )
                        this.state.serversAdmin.push(g);
                });
                this.setState({ loading: false });
            }, 200);
        }
    }

    render() {
        if (!this.props.loading) this.getGuilds();
        return (
            <Navbar expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand className="text-center" href="/">
                        <img className="rounded" src={iconImg} alt="StarLight Economy Logo" style={{ width: '50%' }} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarSupportedContent" />
                    <Navbar.Collapse id="navbarNav">
                        <Nav>
                            <Nav.Link href="/about">Acerca De</Nav.Link>
                            <Nav.Link href="/invite">Agregar al Servidor</Nav.Link>
                            <Nav.Link href="/commands">Comandos</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end" id="navbarNav">
                        <Nav>
                            {this.props.loading ? (
                                <Spinner animation="border" variant="warning" role="status">
                                    <span className="sr-only">Cargando...</span>
                                </Spinner>
                            ) : this.props && this.props.user ? (
                                <Fragment>
                                    {this.state.loading ? (
                                        <Spinner animation="border" variant="warning" />
                                    ) : this.props && this.props.user && this.props.user.guilds && this.props.user.guilds.length > 0 ? (
                                        <NavDropdown title="Dashboard" id="dropdown-guilds">
                                            {this.state.servers.map((servidor: any) => (
                                                <NavDropdown.Item key={`NI${servidor.id}`} href={`/dashboard/${servidor.id}`}>
                                                    <Row>
                                                        <Col lg="1" className="material-icons">
                                                            settings
                                                        </Col>
                                                        <Col lg="10">{servidor.name}</Col>
                                                    </Row>
                                                </NavDropdown.Item>
                                            ))}
                                            {this.state.serversAdmin.length > 0 ? <NavDropdown.Divider /> : null}
                                            {this.state.serversAdmin.map((servidor: any) => (
                                                <NavDropdown.Item
                                                    key={`NI${servidor.id}`}
                                                    href={`https://discord.com/oauth2/authorize?client_id=696723299459268728&permissions=268437520&scope=bot&response_type=code&guild_id=${servidor.id}`}
                                                >
                                                    <Row>
                                                        <Col lg="1" className="material-icons">
                                                            add
                                                        </Col>
                                                        <Col lg="10">{servidor.name}</Col>
                                                    </Row>
                                                </NavDropdown.Item>
                                            ))}
                                        </NavDropdown>
                                    ) : null}
                                    <Nav.Link href="/profile">
                                        {/*this.props && this.props.user ? (
                                    <img
                                        className="rounded"
                                        style={{ borderRadius: 1, margin: '0px 10px 0px 10px' }}
                                        src={`https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=32`}
                                        alt="Profile_Icon"
                                    />
                                ) : null*/}
                                        {this.props.user.username}
                                    </Nav.Link>
                                    <Nav.Link href="/logout">Cerrar Sesión</Nav.Link>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Nav.Link href="/login">Inciar Sesión</Nav.Link>
                                </Fragment>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}
