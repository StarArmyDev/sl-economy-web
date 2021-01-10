import { Component, Fragment } from 'react';
import { Row, Container, Button, Col, ListGroup, Accordion, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../Constants';
import { IGuildObjet, IPerfil } from '../interfaces';

export default class Profile extends Component<any> {
    state = {
        defaulURl:
            'https://images-ext-1.discordapp.net/external/NAqkMZNPJgDiWBrSDqniAD1_sbWfiPqF4mgZyCtVs6s/https/discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png',
        avatarURL: '',
        loading: true,
        serversAdmin: [] as IGuildObjet[],
        serversComun: [] as IGuildObjet[],
    };

    componentDidMount() {
        if (this.props.user && this.props.user.guilds) {
            var avatar = `https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=256`;
            this.setState({ avatarURL: avatar });
            var dbs: IPerfil[] = [];
            var servers: any[] = [];

            axios.get(`${API_URL}/db/profile/servers/${this.props.user.id}`).then((res) => {
                var user = res.data;
                dbs = user;
            });
            axios
                .get(`${API_URL}/guild`)
                .then((res) => {
                    var guild = res.data;
                    servers = guild;
                })
                .catch(() => this.setState({ loading: false }));
            setTimeout(() => {
                this.props.user.guilds.forEach(async (g: IGuildObjet) => {
                    if ((g.permissions & 2146958591) === 2146958591) this.state.serversAdmin.push(g);

                    if (servers.find((gd) => gd.id === g.id)) {
                        var dbS: IPerfil | undefined = dbs.find((d) => d._id.startsWith(g.id));
                        this.state.serversComun.push({
                            ...g,
                            db: dbS ? { dinero: dbS.dinero, banco: dbS.banco, items: dbS.inventario.items } : { dinero: 0, banco: 0, items: [] },
                        });
                    }
                });
                this.setState({ loading: false });
            }, 500);
        }
    }

    render() {
        if (!this.props.user) {
            window.location.replace(`${API_URL}/oauth/login`);
            return <Fragment />;
        } else if (this.state.loading) {
            return (
                <Container className="text-center">
                    <Spinner animation="border" variant="warning" role="status" />
                </Container>
            );
        } else
            return (
                <Container className="text-center">
                    <Row className="align-items-center">
                        <Container fluid>
                            <div className="p-top align-middle">
                                <Row className="align-items-center">
                                    <Col sm className="text-center" style={{ margin: '20px 0px 20px 0px' }}>
                                        <img className="img-fluid rounded" style={{ width: '25%' }} src={this.state.avatarURL} alt="" />
                                    </Col>
                                    <Col sm className="text-center">
                                        <span className="h3" style={{ color: 'aliceblue' }}>
                                            {this.props.user.username}{' '}
                                            <span className="h6" style={{ color: 'rgb(21, 219, 226)' }}>
                                                #{this.props.user.discriminator}
                                            </span>
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </Container>

                        {/* Servidores en Común */}
                        <Col lg="12">
                            <ListGroup>
                                {this.state.serversComun.length > 0 ? (
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
                                                    style={{ borderRadius: '900px', width: '50%', margin: '0px 10px 0px 10px' }}
                                                    src="https://images-ext-1.discordapp.net/external/NAqkMZNPJgDiWBrSDqniAD1_sbWfiPqF4mgZyCtVs6s/https/discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"
                                                />
                                            </Col>
                                            <Col sm={10} className="align-text-bottom text-center">
                                                No hay servidores que mostrar
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                {this.state.serversComun.map((servidor: IGuildObjet) => (
                                    <Accordion>
                                        <ListGroup.Item key={`LI${servidor.id}`}>
                                            <Row className="align-items-center">
                                                <Col sm className="text-center">
                                                    <img
                                                        alt="Icon_Server"
                                                        style={{ borderRadius: '900px', width: '50%', margin: '0px 10px 0px 10px' }}
                                                        src={
                                                            servidor.icon
                                                                ? `https://cdn.discordapp.com/icons/${servidor.id}/${servidor.icon}.png?size=256`
                                                                : this.state.defaulURl
                                                        }
                                                    />
                                                </Col>
                                                <Col sm={8} className="align-text-bottom text-left">
                                                    {servidor.name}
                                                </Col>
                                                <Col sm className="text-right">
                                                    <Accordion.Toggle as={Button} eventKey={`S_${servidor.id}`}>
                                                        Perfil
                                                    </Accordion.Toggle>
                                                    <Button type="button" href={`/leaderboard/${servidor.id}`} style={{ margin: '10%' }}>
                                                        Top
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <Accordion.Collapse className="multi-collapse" eventKey={`S_${servidor.id}`}>
                                            <div className="card card-body">
                                                <div className="row">
                                                    {/* Dinero */}
                                                    <Col sm>
                                                        <div className="box-stats z-depth-3">
                                                            <p>⭐ Dinero</p>
                                                            <span className="text-stats"> {servidor.db?.dinero} </span>
                                                        </div>
                                                    </Col>
                                                    {/* Banco */}
                                                    <Col sm>
                                                        <div className="box-stats z-depth-3">
                                                            <p>🏦 Banco</p>
                                                            <span className="text-stats"> {servidor.db?.banco} </span>
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
/*
Profile.propTypes = {
    user: PropTypes.object,
};
*/
