import { Container, ListGroup, Col, Row, Badge, Button, Card, InputGroup, Form } from 'react-bootstrap';
import React, { Fragment, useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import Helmet from 'react-helmet';

import type { AllProfilesInServer, ProfileTop } from '@app/models';
import { GuildGQL, ProfileGQL, useQuery } from '../../graphql';
import { ConvertString, EventRegister } from '@app/helpers';
import { useAppSelector } from '@app/storage';

// Destacar los primeros 3 lugares con estilos especiales
const getPodiumStyle = (position: number) => {
    if (position === 1) return { backgroundColor: 'rgba(255, 215, 0, 0.2)', borderLeft: '4px solid gold' };
    if (position === 2) return { backgroundColor: 'rgba(192, 192, 192, 0.2)', borderLeft: '4px solid silver' };
    if (position === 3) return { backgroundColor: 'rgba(205, 127, 50, 0.2)', borderLeft: '4px solid #cd7f32' };
    return {};
};

// Implementar React.memo para evitar re-renderizados innecesarios
const UserListItem = React.memo(({ dato, index, defaulURl }: { dato: any; index: number; defaulURl: string }) => (
    <ListGroup.Item key={`U${index}`} style={{ ...getPodiumStyle(index + 1), transition: 'all 0.3s ease', animation: 'fadeIn 0.5s' }}>
        <Row className="align-items-center">
            <Col sm={1} className="text-center">
                <h4>
                    <Badge bg="primary" pill>
                        {ConvertString(++index)}
                    </Badge>
                </h4>
            </Col>
            <Col sm className="text-start py-2">
                <img
                    alt=""
                    onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = defaulURl;
                    }}
                    style={{ borderRadius: '16px', width: '10%', margin: '0px 10px 0px 10px' }}
                    src={
                        dato.user?.avatar?.length
                            ? `https://cdn.discordapp.com/avatars/${dato.user._id}/${dato.user.avatar}.png?size=64`
                            : defaulURl
                    }
                />
                {dato.user ? dato.user.username : `ID: ${(dato._id as string).split('-')[1]}`}
            </Col>
            <Col xs={12} sm={4} className="text-center">
                <Row>
                    <Col xs={6} sm={6}>
                        Dinero: {ConvertString(dato.dinero)}
                    </Col>
                    <Col xs={6} sm={6}>
                        Banco: {ConvertString(dato.banco)}
                    </Col>
                </Row>
            </Col>
        </Row>
    </ListGroup.Item>
));

export const LeaderBoard: React.FC = () => {
    const { id } = useParams();
    const defaulURl = 'https://cdn.discordapp.com/embed/avatars/0.png';

    const user = useAppSelector(state => state.web.user);

    const [userRank, setUserRank] = useState({
        position: -1,
        dinero: 0,
        banco: 0,
    });

    const [usersList, setUsersList] = useState<ProfileTop[]>([]);
    const [guildDiscord, setGuildDiscord] = useState<any>();
    const [orden, setOrden] = useState({ total: -1 } as { _id?: number; dinero?: number; banco?: number; total?: number });
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = debounce((term: string) => setSearchTerm(term), 300);

    const GuildData = useQuery(GuildGQL, { variables: { id } });
    const { loading, error, data, fetchMore } = useQuery<{
        AllProfilesInServer: AllProfilesInServer;
    }>(ProfileGQL, {
        variables: { id, orden, userId: user?._id, skip: 0, limit: 20 },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
    });

    // Filtrar la lista basada en la búsqueda
    const filteredList = usersList.filter(user => user.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()));

    // Función optimizada para cargar más datos
    const loadMore = () => {
        //if ((data?.AllProfilesInServer.profiles.length ?? 0) >= (data?.AllProfilesInServer.total ?? 0)) return;

        fetchMore({
            variables: { skip: data?.AllProfilesInServer.profiles.length ?? 0 },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    AllProfilesInServer: {
                        ...prev.AllProfilesInServer,
                        profiles: [...prev.AllProfilesInServer.profiles, ...fetchMoreResult.AllProfilesInServer.profiles],
                    },
                };
            },
        });
    };

    const prevDataRef = useRef<any>();

    React.useEffect(() => {
        if (
            data &&
            (!prevDataRef.current || JSON.stringify(prevDataRef.current.profiles) !== JSON.stringify(data.AllProfilesInServer.profiles))
        ) {
            const list = data.AllProfilesInServer.profiles;
            setUsersList(list);
            prevDataRef.current = data.AllProfilesInServer;

            if (user && userRank.position !== data.AllProfilesInServer.userRank.position) {
                setUserRank({
                    position: data.AllProfilesInServer.userRank.position,
                    dinero: data.AllProfilesInServer.userRank.profile?.dinero || 0,
                    banco: data.AllProfilesInServer.userRank.profile?.banco || 0,
                });
            }

            setGuildDiscord(GuildData.data?.getGuild);
        }
    }, [data, userRank.position, user]);

    // --- SCROLL GLOBAL PARA PAGINACIÓN INFINITA ---
    React.useEffect(() => {
        const onScroll = () => {
            const scrollContainer = document.querySelector('div[style*="overflow-y: scroll"]');
            if (!scrollContainer) return;
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

            if (!loading && scrollHeight - scrollTop - clientHeight < 300) {
                loadMore();
            }
        };
        EventRegister.on('scroll', onScroll);
        return () => {
            EventRegister.removeListener('scroll');
        };
    }, [loadMore, data?.AllProfilesInServer.profiles.length, loading]);

    if ((loading && !usersList.length) || GuildData.loading)
        return (
            <Container className="text-center">
                <Helmet>
                    <title>SL-Economy | Leaderboard</title>
                </Helmet>
                <Card className="text-center bg-primary">
                    <Row className="align-items-center py-2">
                        <Col sm={2} className="text-center">
                            <Skeleton width={40} height={40} />
                        </Col>
                        <Col className="text-start">
                            <Skeleton width={'80%'} height={40} />
                        </Col>
                    </Row>
                </Card>
                <ListGroup variant="flush" className="mt-3">
                    {Array.from({ length: 10 }, (_, index) => (
                        <ListGroup.Item key={`loading-${index}`}>
                            <Row className="align-items-center">
                                <Col sm={1} className="text-center">
                                    <Skeleton width={40} height={40} />
                                </Col>
                                <Col sm className="text-start">
                                    <Skeleton width={'80%'} height={40} />
                                </Col>
                                <Col xs={12} sm={4} className="text-center">
                                    <Skeleton width={'80%'} height={40} />
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        );
    else if (error || GuildData.error) {
        return (
            <Container className="text-center">
                <Row className="text-center pt-4">
                    <Col md={12}>
                        <h2>
                            <p>
                                <i className="material-icons" style={{ fontSize: '300%' }}>
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
                            }}>
                            <i className="material-icons align-middle">reply</i>Volver
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        return (
            <Container fluid style={{ padding: 0, background: 'none' }}>
                <Helmet>
                    <title>Leaderboard | {guildDiscord?.name ?? ''}</title>
                </Helmet>
                <Row className="justify-content-center">
                    <Col></Col>
                    <Col lg={8} style={{ overflow: 'visible', padding: 0 }}>
                        {guildDiscord ? (
                            <Card className="text-center bg-warning">
                                <Row className="align-items-center">
                                    <Col sm={2} className="text-center">
                                        <img
                                            alt="Guild Icon"
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.currentTarget.onerror = null;
                                                e.target.src = defaulURl;
                                            }}
                                            className="img-fluid rounded"
                                            style={{ width: '50%', marginTop: '10%', marginBottom: '10%' }}
                                            src={`https://cdn.discordapp.com/icons/${id}/${guildDiscord.icon}.png?size=128`}
                                        />
                                    </Col>
                                    <Col className="text-start">
                                        <h3>{guildDiscord.name}</h3>
                                    </Col>
                                </Row>
                            </Card>
                        ) : null}

                        {/* <InputGroup className="mb-3">
                            <InputGroup.Text>🔍</InputGroup.Text>
                            <Form.Control
                                placeholder="Buscar usuario..."
                                onChange={e => debouncedSearch(e.target.value)}
                                value={searchTerm}
                            />
                        </InputGroup> */}

                        <div style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
                            {usersList.length > 2 ? (
                                <Row>
                                    <Col className="text-center">
                                        <Button
                                            variant="outline-warning"
                                            style={{ margin: '1% 2% 1% 2%' }}
                                            onClick={() => setOrden({ dinero: -1 })}>
                                            Dinero
                                        </Button>

                                        <Button
                                            variant="outline-warning"
                                            style={{ margin: '1% 2% 1% 2%' }}
                                            onClick={() => setOrden({ banco: -1 })}>
                                            Banco
                                        </Button>

                                        <Button
                                            variant="outline-warning"
                                            style={{ margin: '1% 2% 1% 2%' }}
                                            onClick={() => setOrden({ total: -1 })}>
                                            Total
                                        </Button>
                                    </Col>
                                </Row>
                            ) : null}
                            {user && filteredList.length > 0 ? (
                                <Fragment>
                                    <ListGroup.Item
                                        key="rank"
                                        style={{
                                            ...getPodiumStyle(userRank.position),
                                            transition: 'all 0.3s ease',
                                            animation: 'fadeIn 0.5s',
                                        }}>
                                        <Row className="align-items-center py-2">
                                            <Col sm={1} className="text-center">
                                                <h4>
                                                    <Badge bg="primary" pill>
                                                        {ConvertString(userRank.position)}
                                                    </Badge>
                                                </h4>
                                            </Col>
                                            <Col sm className="text-start">
                                                <img
                                                    alt="MyRank-Avatar"
                                                    onError={(e: any) => {
                                                        e.target.onerror = null;
                                                        e.target.src = defaulURl;
                                                    }}
                                                    style={{ borderRadius: '16px', width: '10%', margin: '0px 10px 0px 10px' }}
                                                    src={`https://cdn.discordapp.com/avatars/${user._id}/${user.avatar}.png?size=256`}
                                                />
                                                {user.username}
                                            </Col>
                                            <Col xs={12} sm={4} className="text-center">
                                                <Row>
                                                    <Col xs={6} sm={6}>
                                                        Dinero: {ConvertString(userRank.dinero)}
                                                    </Col>
                                                    <Col xs={6} sm={6}>
                                                        Banco: {ConvertString(userRank.banco)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <hr />
                                </Fragment>
                            ) : null}
                            {filteredList.length < 1 ? (
                                <ListGroup.Item key="rank">
                                    <Row className="align-items-center">
                                        <Col sm={1} className="text-center"></Col>
                                        <Col sm className="text-start">
                                            <img
                                                alt="Me"
                                                style={{ borderRadius: '900px', width: '15%', margin: '0px 10px 0px 10px' }}
                                                src={defaulURl}
                                            />
                                            Sin datos
                                        </Col>
                                        <Col sm={4} className="text-center"></Col>
                                    </Row>
                                </ListGroup.Item>
                            ) : (
                                <ListGroup variant="flush">
                                    {filteredList.map((dato, index) => (
                                        <UserListItem key={dato._id || index} dato={dato} index={index} defaulURl={defaulURl} />
                                    ))}
                                    {loading && (
                                        <ListGroup.Item key="loading">
                                            <Row className="align-items-center">
                                                <Col sm={1} className="text-center">
                                                    <Skeleton width={40} height={40} />
                                                </Col>
                                                <Col sm className="text-start">
                                                    <Skeleton width={'80%'} height={40} />
                                                </Col>
                                                <Col xs={12} sm={4} className="text-center">
                                                    <Skeleton width={'80%'} height={40} />
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            )}
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        );
    }
};
