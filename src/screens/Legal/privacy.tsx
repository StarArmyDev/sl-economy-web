import { Container, Row, Col } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import { Link } from 'react-router-dom';
import { Alert } from '@app/components';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

export function Privacy() {
    const [open, setOpen] = useState(false);

    function copyClipboard(e: any) {
        navigator.clipboard
            .writeText(e.target.innerText)
            .then(() => setOpen(true))
            .catch(() => null);
    }

    const handleClose = (_: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const ButtonMailto = ({ mailto, label }: { mailto: string; label: string }) => {
        return (
            <Link
                to=""
                onClick={e => {
                    window.location.href = mailto;
                    e.preventDefault();
                }}>
                {label}
            </Link>
        );
    };

    return (
        <Container>
            <Helmet>
                <title>Política de Privacidad</title>
            </Helmet>
            <Snackbar autoHideDuration={2000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Copiado al portapapeles
                </Alert>
            </Snackbar>
            <Row className="text-center pt-4">
                <Col md={12}>
                    <h2>
                        <p>
                            <i className="material-icons" style={{ fontSize: '300%' }}>
                                policy
                            </i>
                        </p>
                        Política de Privacidad
                    </h2>
                </Col>
                <Col md={12}>
                    Entrada en vigor: 13 de junio de 2022
                    <br />
                    Última actualización: 04 de junio de 2022
                </Col>
            </Row>

            <Row className="text-center pt-4">
                <p>
                    En esta Política de privacidad detallaremos cómo recogemos, usamos, almacenamos, protegemos y compartimos tu información
                    personal a través de nuestros servicios.
                </p>
                <p>
                    Usted acepta la política de privacidad que se describe en este sitio a través de su uso del bot {''}
                    <code className="codeCopy" onClick={copyClipboard}>
                        StarLight Economy#1889
                    </code>{' '}
                    en la plataforma Discord proporcionada por Discord Inc.
                </p>
                <p>
                    Nuestros servicios cumplen los{' '}
                    <a target="_blank" href="https://discord.com/terms" rel="noreferrer">
                        Términos de servicio
                    </a>
                    y las{' '}
                    <a target="_blank" href="https://discord.com/privacy" rel="noreferrer">
                        Política de privacidad
                    </a>{' '}
                    de Discord Inc.
                </p>
                <p>
                    Si usa nuestro servicio de bot dentro de discord, se almacena su id (IDentificador único dentro de discord) con el único
                    fin de relacionar su corresponiente dinero virtual y ficticio en cada servidor donde se encuetre el bot. Únicamente se
                    generará este perfil con estos datos, si usted mandanda un mensaje cualquiera en los chats que no estés restringidos por
                    un administrador para ganar dinero por escribir, en su defecto, si usa un comando cualquiera del bot, también se
                    generará su perfil.
                </p>
                <p>
                    <strong>El bot no lee el contenidos de sus mensajes</strong> enviados o recibidos en los canales de los servidores o por
                    mensaje directo al bot. El bot no necesita la intención de discord de &quot;MESSAGE CONTENT INTENT&quot; para ganar
                    dinero. La única información recibida proviene de los comandos del bot que se ejecutan en el chat.
                </p>
                <p>
                    Al iniciar sesion en esta página, el bot lee su id (IDentificador único dentro de discord), el nombre de usuario
                    (username), el avatar (avatar) y otros datos proporcionados por la autentificación de discord. También se solicita
                    acceso a los servidores en los que se encuentra con el fin de encontrar los que comparte con el bot y los que administra
                    para poder obetenr información y configurar el bot desde la dashboard.
                </p>
                <p>
                    Los datos de servidor que son recogidos es únicamente el id (IDentificador único dentro de discord) del servidor para
                    relacionar las configuraciones y todos los perfiles de los usuarios dentro del mismo.
                </p>
                <p>
                    Todos los datos son almacenados en una base de datos de MongoDB, en el servicio de MongoDB Atlas manteniendo seguros los
                    datos.
                </p>
                <h3>Cómo ponerte en contacto con nosotros</h3>
                <p>
                    Si tiene alguna pregunta sobre esta política de privacidad o quieres solicitar la eliminación de datos, por favor envíe
                    un correo electrónico a <ButtonMailto label="davichostar@protonmail.com" mailto="mailto:davichostar@protonmail.com" /> o
                    a nuestro{' '}
                    <a href="https://discord.gg/MZN8Yf6" target="_blank" rel="noreferrer">
                        Servidor de Discord
                    </a>{' '}
                    siendo la manera más fácil de contactar con nosotros.
                </p>
            </Row>
        </Container>
    );
}
