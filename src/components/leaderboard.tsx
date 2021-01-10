import { Component, Fragment } from 'react';
import { Spinner, Container, ListGroup, Col, Row, Badge, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../Constants';
import conv from '../libs/ConverString';

export default class LeaderBoard extends Component<any> {
    state = {
        id: this.props.match && this.props.match.params && this.props.match.params.id ? this.props.match.params.id : null,
        loading: true,
        defaulURl:
            'https://images-ext-1.discordapp.net/external/NAqkMZNPJgDiWBrSDqniAD1_sbWfiPqF4mgZyCtVs6s/https/discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png',
        guild: {} as any,
        orden: [] as { id: string; dinero: number; banco: number; total: number; user?: any }[],
        turank: {
            rank: 0,
            dinero: 0,
            banco: 0,
            total: 0,
        },
    };

    async componentDidMount() {
        if (this.state.id) {
            var control = 0;
            var limit = 25;

            var Servidor = (await axios.get(`${API_URL}/guild/${this.state.id}`)).data;
            var Perfiles = (await axios.get(`${API_URL}/db/profiles/server/${this.state.id}`)).data;
            var usersDB = (await axios.get(`${API_URL}/db/user`)).data;

            let orden: { id: string; dinero: number; banco: number; total: number; user?: any }[] = [];
            if (Perfiles)
                Perfiles.forEach(async (valor: any) => {
                    let Id = valor._id.split('-')[1] as string;
                    orden.push({
                        id: Id,
                        dinero: valor.dinero,
                        banco: valor.banco,
                        total: valor.dinero + valor.banco,
                        user: usersDB.find((u: any) => u._id === Id) ? usersDB.find((u: any) => u._id === Id) : null,
                    });
                });

            orden.sort((a, b) => b.total - a.total);

            if (this.props.user) {
                var contador = orden.findIndex((dt) => dt.id === this.props.user.id);
                var Perfil = orden[contador];
                this.setState({
                    turank: {
                        rank: ++contador,
                        dinero: Perfil ? Perfil.dinero : 0,
                        banco: Perfil ? Perfil.banco : 0,
                        total: Perfil ? Perfil.dinero + Perfil.banco : 0,
                    },
                });
            }

            this.setState({ orden: orden.splice(control, limit), guild: Servidor, loading: false });
        }
    }

    ordenTop(mode: string) {
        var orden = this.state.orden;
        var control = 0;
        var limit = 25;

        if (['cash'].includes(mode)) orden.sort((a, b) => b.dinero - a.dinero);
        else if (['bank'].includes(mode)) orden.sort((a, b) => b.banco - a.banco);
        else orden.sort((a, b) => b.total - a.total);

        if (this.props.user) {
            var contador = orden.findIndex((dt) => dt.id === this.props.user.id);
            var Perfil = orden[contador];
            this.setState({
                turank: {
                    rank: ++contador,
                    dinero: Perfil ? Perfil.dinero : 0,
                    banco: Perfil ? Perfil.banco : 0,
                    total: Perfil ? Perfil.dinero + Perfil.banco : 0,
                },
            });
        }

        this.setState({ orden: orden.splice(control, limit) });
    }

    render() {
        if (this.state.loading)
            return (
                <Container className="text-center">
                    <Spinner animation="border" variant="warning" role="status" />
                </Container>
            );
        else
            return (
                <Container>
                    <Row>
                        <Col></Col>
                        <Col lg={8}>
                            {this.state.guild ? (
                                <Card className="text-center bg-warning">
                                    <Row className="align-items-center">
                                        <Col sm={4}>
                                            <img
                                                className="img-fluid rounded"
                                                style={{ width: '40%', margin: '5%' }}
                                                src={`https://cdn.discordapp.com/icons/${this.state.id}/${this.state.guild.icon}.png?size=128`}
                                                alt=""
                                            />
                                        </Col>
                                        <Col>
                                            <h4>{this.state.guild.name}</h4>
                                        </Col>
                                    </Row>
                                </Card>
                            ) : null}
                            <ListGroup>
                                {this.state.orden.length > 2 ? (
                                    <Row>
                                        <Col className="text-center">
                                            <Button variant="outline-warning" style={{ margin: '1% 2% 1% 2%' }} onClick={() => this.ordenTop('cash')}>
                                                Dinero
                                            </Button>

                                            <Button variant="outline-warning" style={{ margin: '1% 2% 1% 2%' }} onClick={() => this.ordenTop('bank')}>
                                                Banco
                                            </Button>

                                            <Button variant="outline-warning" style={{ margin: '1% 2% 1% 2%' }} onClick={() => this.ordenTop('all')}>
                                                Total
                                            </Button>
                                        </Col>
                                    </Row>
                                ) : null}
                                {this.props.user && this.state.orden.length > 0 ? (
                                    <Fragment>
                                        <ListGroup.Item key="rank">
                                            <Row className="align-items-center">
                                                <Col sm={1} className="text-center">
                                                    <h4>
                                                        <Badge variant="primary" pill>
                                                            {conv(this.state.turank.rank)}
                                                        </Badge>
                                                    </h4>
                                                </Col>
                                                <Col sm className="text-start">
                                                    <img
                                                        alt=""
                                                        style={{ borderRadius: '900px', width: '15%', margin: '0px 10px 0px 10px' }}
                                                        src={`https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=256`}
                                                    />
                                                    {this.props.user.username}
                                                </Col>
                                                <Col sm={4} className="text-center">
                                                    <Row>
                                                        <Col xs>Dinero: {conv(this.state.turank.dinero)}</Col>
                                                        <Col xs>Banco: {conv(this.state.turank.banco)}</Col>
                                                        <Col xs>Total: {conv(this.state.turank.total)}</Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <hr />
                                    </Fragment>
                                ) : null}
                                {this.state.orden.length < 1 ? (
                                    <ListGroup.Item key="rank">
                                        <Row className="align-items-center">
                                            <Col sm={1} className="text-center"></Col>
                                            <Col sm className="text-start">
                                                <img
                                                    alt=""
                                                    style={{ borderRadius: '900px', width: '15%', margin: '0px 10px 0px 10px' }}
                                                    src={this.state.defaulURl}
                                                />
                                                Sin datos
                                            </Col>
                                            <Col sm={4} className="text-center"></Col>
                                        </Row>
                                    </ListGroup.Item>
                                ) : (
                                    this.state.orden.map((dato: any, index) => (
                                        <ListGroup.Item key={`U${index}`}>
                                            <Row className="align-items-center">
                                                <Col sm={1} className="text-center">
                                                    <h4>
                                                        <Badge variant="primary" pill>
                                                            {conv(++index)}
                                                        </Badge>
                                                    </h4>
                                                </Col>
                                                <Col sm className="text-start">
                                                    <img
                                                        alt=""
                                                        onError={(e: any) => {
                                                            e.target.onerror = null;
                                                            e.target.src = this.state.defaulURl;
                                                        }}
                                                        style={{ borderRadius: '900px', width: '15%', margin: '0px 10px 0px 10px' }}
                                                        src={
                                                            dato.user && dato.user.avatar
                                                                ? `https://cdn.discordapp.com/avatars/${dato.user._id}/${dato.user.avatar}.png?size=64`
                                                                : this.state.defaulURl
                                                        }
                                                    />
                                                    {dato.user ? dato.user.username : `ID: ${dato.id}`}
                                                </Col>
                                                <Col sm={4} className="text-center">
                                                    <Row>
                                                        <Col xs>Dinero: {conv(dato.dinero)}</Col>
                                                        <Col xs>Banco: {conv(dato.banco)}</Col>
                                                        <Col xs>Total: {conv(dato.total)}</Col>
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
