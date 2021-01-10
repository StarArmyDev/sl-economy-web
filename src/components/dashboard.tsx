import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Col, Row, Badge, Tab, Nav, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '../Constants';
import { ISistemas, IUserObjet } from '../interfaces';

interface IAlert {
    show: boolean;
    type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
    text?: string;
}

const Dashboard = (props: any) => {
    const id = props.match && props.match.params && props.match.params.id ? props.match.params.id : null;
    const user: null | IUserObjet = window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')!) : null;
    const [loading, setLoading] = useState(true);
    const [guild, setGuild] = useState(null as any);
    const [dbServer, setDB] = useState(null as ISistemas | null);
    const [alert, setAlert] = useState([] as IAlert[]);
    const { register, errors, handleSubmit, reset, setValue } = useForm();

    const load = async () => {
        if (!guild) {
            var Servidor = (await axios.get(`${API_URL}/guild/${id}`)).data;
            setGuild(Servidor);
        }
        if (!dbServer) {
            var Sistemas = (await axios.get(`${API_URL}/db/server/${id}`)).data;
            setDB(Sistemas);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!user) return window.location.replace('/error403');
        else {
            var guild = user.guilds.find((g) => g.id === id);
            if (!guild || !((guild.permissions & 2146958591) === 2146958591)) return window.location.replace('/error403');
        }
        load();
    });

    const removeAlert = (alert: IAlert) => setAlert((alerts) => alerts.filter((x) => x !== alert));

    const onSubmit = async (data: any, e: any) => {
        var newData: any;
        var values: string[] = [];

        if (data.prefix) {
            newData = (
                await axios.put(`${API_URL}/db/server/${id}`, {
                    prefix: data.prefix,
                })
            ).data;
            values.push('prefix');
            setAlert((at) => [...at, { type: 'success', show: true, text: 'Prefijo personalizado establecido.' }]);
        }
        if (data.language && (dbServer?.language && dbServer.language.server ? dbServer.language.server !== data.language : data.language !== 'es-MX')) {
            newData = (
                await axios.put(`${API_URL}/db/server/${id}`, {
                    'language.server': data.language,
                })
            ).data;
            setAlert((at) => [...at, { type: 'success', show: true, text: 'Idioma Principal cambiado.' }]);
        }
        if (newData) {
            setDB(newData);
            reset(values);
            if (newData.language?.server) setValue('language', newData.language.server);
        }
        console.log(data);
        //e.target.reset();
    };

    const onDelete = async (value: string, text: string) => {
        var newData = (
            await axios.put(`${API_URL}/db/server/${id}`, {
                [value]: null,
            })
        ).data;
        console.log(newData);
        setDB(newData);
        reset([value]);
        if (value === 'language.server') setValue('language', 'es-MX');
        setAlert((at) => [...at, { type: 'success', show: true, text: `${text} eliminado.` }]);
    };

    if (loading)
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    else
        return (
            <Container>
                <Row>
                    <Col sm>
                        <Row className="text-center">
                            <Col sm={12}>
                                {alert.map((variant, idx) => {
                                    setTimeout(() => removeAlert(variant), 2000);
                                    return (
                                        <Alert key={idx} show={variant.show} variant={variant.type} dismissible onClose={() => removeAlert(variant)}>
                                            <Alert.Heading>{variant.text}</Alert.Heading>
                                        </Alert>
                                    );
                                })}
                            </Col>
                            <Col sm={12}>
                                <Card className="bg-primary">
                                    <Row>
                                        <Col sm={12} className="p-4">
                                            <img
                                                className="rounded"
                                                style={{ width: '15%' }}
                                                src={`https://cdn.discordapp.com/icons/${id}/${guild.icon}.png?size=128`}
                                                alt=""
                                            />
                                        </Col>
                                        {guild.ownerID === user?.id ? (
                                            <Col sm={12}>
                                                <h3>👑</h3>
                                            </Col>
                                        ) : null}
                                        <Col sm={12}>
                                            <h4>{guild.name}</h4>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Tab.Container defaultActiveKey="bot">
                                <Col sm={2} className="text-center">
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Link eventKey="bot">Inicio</Nav.Link>
                                        <Nav.Link eventKey="economy">Economía</Nav.Link>
                                        <Nav.Link eventKey="shop">Tienda</Nav.Link>
                                    </Nav>
                                </Col>
                                <Col className="text-center pt-4">
                                    <Tab.Content>
                                        {/* Panel de Bot */}
                                        <Tab.Pane eventKey="bot">
                                            <Row className="align-items-center text-center">
                                                <Col sm={12}>
                                                    <h3>Configuraciones Generales</h3>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form className="g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
                                                        <Form.Row className="align-items-center">
                                                            {/**
                                                             * Prefix
                                                             */}
                                                            <Col sm>
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Prepend>
                                                                        <InputGroup.Text>Prefijo</InputGroup.Text>
                                                                    </InputGroup.Prepend>
                                                                    <Form.Control
                                                                        name="prefix"
                                                                        placeholder={dbServer?.prefix ? dbServer.prefix : 'Por Defecto: e!'}
                                                                        ref={register({
                                                                            maxLength: {
                                                                                value: 5,
                                                                                message: 'No más de 5 carácteres',
                                                                            },
                                                                        })}
                                                                    />
                                                                    {dbServer?.prefix ? (
                                                                        <Button
                                                                            variant="outline-danger"
                                                                            name="deletePrefix"
                                                                            onClick={() => onDelete('prefix', 'Prefijo')}
                                                                        >
                                                                            Eliminar
                                                                        </Button>
                                                                    ) : null}
                                                                </InputGroup>
                                                                {errors.prefix && (
                                                                    <span className="text-danger text-small d-block mb-2">{errors.prefix.message}</span>
                                                                )}
                                                            </Col>
                                                            {/**
                                                             * Idioma
                                                             */}
                                                            <Col sm>
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Prepend>
                                                                        <InputGroup.Text>Idioma</InputGroup.Text>
                                                                    </InputGroup.Prepend>
                                                                    <Form.Control
                                                                        name="language"
                                                                        as="select"
                                                                        ref={register}
                                                                        defaultValue={dbServer?.language?.server ? dbServer.language.server : 'es-MX'}
                                                                    >
                                                                        <option key="Lg2">es-MX</option>
                                                                        <option key="Lg3">es-ES</option>
                                                                        <option key="Lg1">en-US</option>
                                                                        <option key="Lg4">pt-BR</option>
                                                                    </Form.Control>
                                                                    {dbServer?.language?.server ? (
                                                                        <Button
                                                                            variant="outline-danger"
                                                                            name="deleteLang"
                                                                            onClick={() => onDelete('language.server', 'Idioma')}
                                                                        >
                                                                            Eliminar
                                                                        </Button>
                                                                    ) : null}
                                                                </InputGroup>
                                                                {errors.language && (
                                                                    <span className="text-danger text-small d-block mb-2">{errors.language.message}</span>
                                                                )}
                                                            </Col>
                                                            {/**
                                                             * BlackList
                                                             */}
                                                            {/**
                                                             * WhiteList
                                                             */}
                                                            {/* Guardar */}
                                                            <Col sm={12} className="pt-4">
                                                                <Button variant="outline-warning" type="submit" name="action">
                                                                    Guardar
                                                                </Button>
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        {/* Panel de Economía */}
                                        <Tab.Pane eventKey="economy">
                                            <Row className="align-items-center text-center">
                                                <Col sm={12}>
                                                    <h3>Economía</h3>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form className="g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
                                                        <Form.Row className="align-items-center">
                                                            {/**
                                                             * ChatExclude
                                                             */}
                                                            {/**
                                                             * RestartEconomy
                                                             */}
                                                            {/**
                                                             * Cooldow
                                                             */}
                                                            {/**
                                                             * Currency
                                                             */}
                                                            {/**
                                                             * Fineamount
                                                             */}
                                                            {/**
                                                             * Paypout
                                                             */}
                                                            {/* Guardar */}
                                                            <Col sm={12} className="pt-4">
                                                                <Button variant="outline-warning" type="submit" name="action">
                                                                    Guardar
                                                                </Button>
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        {/* Panel de Tienda */}
                                        <Tab.Pane eventKey="shop">
                                            <Row className="align-items-center text-center">
                                                <Col sm={12}>
                                                    <h3>Tienda</h3>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form className="g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
                                                        <Form.Row className="align-items-center">
                                                            {/**
                                                             * ClearItems
                                                             */}
                                                            {/**
                                                             * CrearteItems
                                                             */}
                                                            {/* Guardar */}
                                                            <Col sm={12} className="pt-4">
                                                                <Button variant="outline-warning" type="submit" name="action">
                                                                    Guardar
                                                                </Button>
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Tab.Container>
                        </Row>
                    </Col>

                    <Col sm={2} className="text-center">
                        <Badge>
                            <h4>Publicidad</h4>
                        </Badge>
                    </Col>
                </Row>
            </Container>
        );
};

export default Dashboard;
