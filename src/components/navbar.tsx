import { Navbar, Container, Nav, NavDropdown, Col, Row, Spinner, Image } from 'react-bootstrap';
import { UpdateGuildsGQL, useMutation, useQuery, UserGuildsGQL } from '../graphql';
import type { IUserObjet } from '@app/models';
import { Link } from 'react-router-dom';
import { CLIENT_ID } from '@app/helpers';
import iconImg from '@img/icon.png';
import { useState } from 'react';

export function NavBar({ user }: { user?: IUserObjet }) {
    const { loading, data, error, refetch } = useQuery(UserGuildsGQL, { variables: { id: user?._id || '0' } });
    const [updateUserGuilds] = useMutation(UpdateGuildsGQL);
    const [guilds, setGuilds] = useState({ admin: [], adminMutual: [], mutual: [] });
    const [changes, setChanges] = useState(true);
    const [load, setLoading] = useState(false);
    let windowReference: Window | null;

    async function reloaderGuilds() {
        if (!load) {
            setLoading(true);
            setGuilds(
                (
                    await updateUserGuilds({
                        variables: {
                            id: user?._id || '0',
                        },
                    })
                ).data.updateGuilds,
            );
            await refetch();
            setChanges(true);
            setLoading(false);
        }
    }

    function loader(datos: any) {
        setGuilds(datos);
        setChanges(false);
    }

    if (!loading && !error && changes) loader(data.getUserGuilds);

    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand className="text-center">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Image className="rounded" src={iconImg} alt="StarLight Economy Logo" width="55%" />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarNav">
                    <Nav fill>
                        <Link to="/invite" style={{ textDecoration: 'none' }}>
                            <div className="nav-link">Invitar</div>
                        </Link>
                        <Link to="/commands" style={{ textDecoration: 'none' }}>
                            <div className="nav-link">Comandos</div>
                        </Link>
                        <Link to="/about" style={{ textDecoration: 'none' }}>
                            <div className="nav-link">Acerca De</div>
                        </Link>
                        <Link to="/status" style={{ textDecoration: 'none' }}>
                            <div className="nav-link">Status</div>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end" id="navbarNav">
                    <Nav fill>
                        {user ? (
                            <>
                                {loading || load ? (
                                    <div className="pe-4 pt-2">
                                        <Spinner animation="border" variant="warning" role="status" />
                                    </div>
                                ) : guilds.adminMutual.length > 0 || guilds.admin.length > 0 ? (
                                    <NavDropdown title="Dashboard" id="dropdown-guilds">
                                        <div style={{ minWidth: 240 }}>
                                            {guilds.adminMutual.map((servidor: any) => (
                                                <Link
                                                    to={`/dashboard/${servidor.id}`}
                                                    style={{ textDecoration: 'none', color: '#fff' }}
                                                    key={`NI${servidor.id}`}>
                                                    <div className="dropdown-item">
                                                        <Row>
                                                            <Col xs="1" className="material-icons pe-3">
                                                                settings
                                                            </Col>
                                                            <Col xs="10" className="text-wrap">
                                                                {servidor.name}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Link>
                                            ))}
                                            {guilds.admin.length > 0 ? <NavDropdown.Divider /> : null}
                                            {guilds.admin.map((servidor: any) => (
                                                <NavDropdown.Item
                                                    key={`NI${servidor.id}`}
                                                    href={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=268437520&scope=bot&response_type=code&guild_id=${
                                                        servidor.id
                                                    }&redirect_uri=${import.meta.env.BASE_URL?.replace(/\//gi, '%2F').replace(
                                                        /:/gi,
                                                        '%3A',
                                                    )}`}>
                                                    <Row>
                                                        <Col xs="1" className="material-icons pe-3">
                                                            add
                                                        </Col>
                                                        <Col xs="10" className="text-wrap">
                                                            {servidor.name}
                                                        </Col>
                                                    </Row>
                                                </NavDropdown.Item>
                                            ))}
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item key="reloader" onClick={reloaderGuilds}>
                                                <Row>
                                                    <Col xs="1" className="material-icons pe-3">
                                                        refresh
                                                    </Col>
                                                    <Col xs="10" className="text-wrap">
                                                        Refrescar
                                                    </Col>
                                                </Row>
                                            </NavDropdown.Item>
                                        </div>
                                    </NavDropdown>
                                ) : null}
                                <Link to="/profile" style={{ textDecoration: 'none' }}>
                                    <div className="nav-link">
                                        {user ? (
                                            <img
                                                className="rounded"
                                                style={{ borderRadius: 1, margin: '0px 10px 0px 10px' }}
                                                src={`https://cdn.discordapp.com/avatars/${user._id}/${user.avatar}.png?size=32`}
                                                alt="avatar"
                                                onError={(e: any) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://cdn.discordapp.com/embed/avatars/3.png';
                                                    e.target.style.width = '32px';
                                                }}
                                            />
                                        ) : null}
                                        {user.username}
                                    </div>
                                </Link>
                                <Link to="/logout" style={{ textDecoration: 'none' }}>
                                    <div className="nav-link">Cerrar Sesión</div>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="#"
                                    onClick={() => {
                                        if (windowReference == null || windowReference.closed) {
                                            windowReference = window.open(
                                                `${import.meta.env.VITE_API_URL}/oauth/login`,
                                                '',
                                                'toolbar=0,status=0,width=400,height=800',
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
                                    style={{ textDecoration: 'none' }}>
                                    <div className="nav-link">Inciar Sesión</div>
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
