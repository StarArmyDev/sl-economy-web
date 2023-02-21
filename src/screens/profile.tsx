import { Row, Container, Button, Col, ListGroup, Accordion, Spinner, Card, Modal, useAccordionButton } from 'react-bootstrap';
import { ProfilesUserGQL, DeleteProfileGQL, useQuery, useMutation } from '../graphql';
import type { IUserObjet } from '@app/models';
import { Link } from 'react-router-dom';
import { ConvertString } from '@app/helpers';
import React, { FC } from 'react';
import Helmet from 'react-helmet';

const AccordionToggle = ({ children, eventKey, callback }: { children: any; eventKey: string; callback?: (key: string) => void }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => callback && callback(eventKey));

    return (
        <Card.Header onClick={decoratedOnClick} style={{ cursor: 'pointer' }}>
            {children}
        </Card.Header>
    );
};

export const Profile: FC<{ user: IUserObjet }> = ({ user }) => {
    if (!user) {
        window.location.replace(`${import.meta.env.VITE_API_URL}/oauth/login`);
        return <></>;
    }
    const defaulURl = 'https://cdn.discordapp.com/embed/avatars/0.png';

    const { loading, data } = useQuery(ProfilesUserGQL, { variables: { id: user._id } });
    const [deleteProfileGQL] = useMutation(DeleteProfileGQL);
    const [serversComun, setServersComun] = React.useState<{ _id: string; dinero: number; banco: number }[]>([]);
    const [showModal, setShowModal] = React.useState(false);
    const [profileID, setProfileID] = React.useState<string | undefined>();

    React.useEffect(() => {
        if (serversComun.length === 0 && data?.AllProfilesOfUserOnServers) setServersComun(data.AllProfilesOfUserOnServers);
    }, [data, loading, serversComun]);

    if (loading) {
        return (
            <Container
                style={{
                    height: '67vh',
                    width: '100vw',
                    position: 'relative',
                    zIndex: 9999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                }}>
                <Helmet>
                    <title>SL-Economy | Perfil</title>
                </Helmet>
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    } else {
        return (
            <Container className="text-center">
                <Helmet>
                    <title>SL-Economy | Perfil</title>
                </Helmet>
                <Row className="align-items-center">
                    <Container fluid style={{ margin: '20px 0px 20px 0px' }}>
                        <div className="p-top align-middle">
                            <Row className="align-items-center">
                                <Col sm className="text-center" style={{ margin: '20px 0px 20px 0px' }}>
                                    <img
                                        alt="avatar"
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://cdn.discordapp.com/embed/avatars/3.png';
                                        }}
                                        className="img-fluid rounded"
                                        style={{ width: '25%' }}
                                        src={`https://cdn.discordapp.com/avatars/${user._id}/${user.avatar}.png?size=256`}
                                    />
                                </Col>
                                <Col sm className="text-center">
                                    <span className="h3" style={{ color: 'aliceblue' }}>
                                        {user.username}{' '}
                                        <span className="h6" style={{ color: 'rgb(21, 219, 226)' }}>
                                            #{user.discriminator}
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
                                                style={{ borderRadius: '900px', width: '50%', margin: '0px 10px 0px 10px' }}
                                                src={defaulURl}
                                            />
                                        </Col>
                                        <Col sm={10} className="align-text-bottom text-center">
                                            No hay servidores que mostrar
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ) : null}
                            <Accordion flush>
                                {serversComun.map(servidor => (
                                    <Card key={`S_${servidor._id}`}>
                                        <AccordionToggle eventKey={`S_${servidor._id}`}>
                                            <Row className="align-items-center">
                                                <Col sm={4} className="text-center" style={{ width: '128px', margin: '0px 10px 0px 10px' }}>
                                                    <img
                                                        alt="Icon_Server"
                                                        className="img-fluid rounded-circle"
                                                        style={{ width: '100%' }}
                                                        onError={(e: any) => {
                                                            e.target.onerror = null;
                                                            e.target.src = defaulURl + '?size=128';
                                                        }}
                                                        src={
                                                            user.guilds.findIndex(g => g.id === servidor._id.split('-')[0]) > -1
                                                                ? `https://cdn.discordapp.com/icons/${servidor._id.split('-')[0]}/${
                                                                      user.guilds.find(g => g.id === servidor._id.split('-')[0])!.icon
                                                                  }.png?size=128`
                                                                : defaulURl + '?size=128'
                                                        }
                                                    />
                                                </Col>
                                                <Col
                                                    sm
                                                    className="align-text-bottom text-center text-sm-start"
                                                    style={{ margin: '20px 0px 20px 0px' }}>
                                                    {user.guilds.findIndex(g => g.id === servidor._id.split('-')[0]) > -1
                                                        ? user.guilds.find(g => g.id === servidor._id.split('-')[0])!.name
                                                        : `Servidor Desconocido (ID: ${servidor._id.split('-')[0]})`}
                                                </Col>
                                            </Row>
                                        </AccordionToggle>
                                        <Accordion.Collapse eventKey={`S_${servidor._id}`}>
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
                                                    {/* Botones */}
                                                    <Col sm={2}>
                                                        <Row>
                                                            <Col sm>
                                                                {/* Top */}
                                                                <Link to={`/leaderboard/${servidor._id.split('-')[0]}`}>
                                                                    <Button variant="info">Top</Button>
                                                                </Link>
                                                            </Col>
                                                            {/* Eliminar */}
                                                            <Col sm>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => {
                                                                        setProfileID(servidor._id);
                                                                        setShowModal(true);
                                                                    }}>
                                                                    Eliminar
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                ))}
                            </Accordion>
                        </ListGroup>
                    </Col>
                </Row>

                <Modal show={showModal && profileID !== undefined} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>¿Seguro de eliminar tu perfil?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Si eliminas tu perfil de este servidor, no podrás volver a recuperarlo, y perderás todo tu dinero y tus items
                            adquiridos para siempre
                        </p>
                        <p>
                            Ten en cuenta que puede ser que el servidor no esté disponible por el momento y por eso no veas su icono o su
                            nombre.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                deleteProfileGQL({ variables: { id: profileID } });
                                setServersComun(serversComun.filter(s => s._id !== profileID));
                                setProfileID(undefined);
                                setShowModal(false);
                            }}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
};
