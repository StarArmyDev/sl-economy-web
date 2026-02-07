import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export function Terms() {
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
                <title>Términos y Condiciones</title>
            </Helmet>
            <Row className="text-center pt-4">
                <Col md={12}>
                    <h2>
                        <p>
                            <i className="material-icons" style={{ fontSize: '300%' }}>
                                gavel
                            </i>
                        </p>
                        Términos y Condiciones
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
                    Sea bienvenido a nuestros servicios y gracias por elegirnos. Estamos comprometidos con blindar un servicio de calidad y
                    seguridad, así como el soporte y personalización de nuestros servicios totalmente en español. De México 🇲🇽 para el mundo
                    ❤️
                </p>
                <p>
                    Al accerder a este sitio web y al hacer uso deñ bot en la plataforma Discord, que rige y es proporcionada por Discord
                    Inc., usted acepta los siguientes términos y condiciones. Si usted no acepta los términos y condiciones, no puede
                    utilizar nuestros servicios ni los recursos proveniente de ellos.
                </p>
                <h3>Limitaciones o uso no permitido</h3>
                <p>
                    Usted no puede copiar, distribuir, modificar, usar de forma personal, de forma comercial o de otra forma distribuir o
                    utilizar nuestros servicios, ilustraciones, imágenes, logotipos, marcas, diseños, nombres de dominio, o cualquier otro
                    elemento de nuestros servicios, sin nuestro consentimiento previo y por escrito.
                </p>
                <h3>Limitaciones de nuestros Servicios</h3>
                <p>
                    Está prohibido usar nuestros servicios para cualquier propósito con fines de dañar, abusar, vulnera, extorcionar o
                    inutilizar nuestros servicios o cualquier persona o entidad. los recurso denominados como &quot;dinero&quot; e
                    &quot;item&quot; o &quot;artículos&quot; son <strong>recursos sin valor real</strong>, recursos ficticios e intangibles
                    para uso exclusivo de nuestros servicios en los correspondientes servidores de discord.
                </p>
                <h3>Modificaciones</h3>
                <p>
                    Nos reservamos el derecho de modificar, cambiar, actualizar, agregar o eliminar cualquier parte de nuestros términos y
                    condiciones, así como nuestros servicios, sin previo aviso y usted acepta regirse por la versión actual de nuestros
                    términos y condiciones.
                </p>
                <h3>Privacidad</h3>
                <p>
                    Nuestros servicios están diseñados para garantizar la privacidad de los usuarios. No recolectando información personal
                    de los usuarios y mostrando los datos del usuario final y servidor final dentro de la misma plataforma de discord y en
                    esta página.
                </p>
                <h3>Servicios de terceros</h3>
                <p>
                    StarLight está enlazado a servicios de terceros, como Discord, para que usted pueda utilizar nuestros servicios. Estos
                    servicios de terceros pueden utilizar su información personal para proporcionarle servicios y productos, además de regir
                    sus propios términos y condiciones. También se utilizan servicios com como Google Adsense, Cloudflare, Arc, PropellerAds
                    y otros.
                </p>
                <h3>Recursos por la comunidad</h3>
                <p>
                    La comunidad de StarLight puede general material para alguno servicio proporcionado por nosotros, lo que nos permite
                    utilizar los recursos de la manera que nosotros querramos y con el fin de mejorar nuestros servicios. Sin embargo, no se
                    puede garantizar y no se está obligado a dar un pago o beneficio por los recursos proporcionados.
                </p>
                <h3>Cómo puede contactarnos</h3>
                <p>
                    Si usted tiene alguna pregunta o inquietud sobre nuestros servicios, por favor envíe un correo electrónico a{' '}
                    <ButtonMailto label="davichostar@protonmail.com" mailto="mailto:davichostar@protonmail.com" /> o a nuestro{' '}
                    <a href="https://discord.gg/MZN8Yf6" target="_blank" rel="noreferrer">
                        Servidor de Discord
                    </a>{' '}
                    siendo la manera más fácil de contactar con nosotros.
                </p>
            </Row>
        </Container>
    );
}
