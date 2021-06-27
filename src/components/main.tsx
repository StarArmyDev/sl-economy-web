import { Row, Container, Col } from "react-bootstrap";
import { Redirect, useLocation } from "react-router-dom";
import splash from "../img/splash.png";

export function Main() {
    const search = useLocation().search;
    const guild_id = new URLSearchParams(search).get("guild_id");
    if (guild_id) return <Redirect to={`/dashboard/${guild_id}`} />;

    return (
        <Container>
            <Row className="text-center">
                <Col sm={12} className="py-5">
                    <img src={splash} alt="Banner StarLight-E" style={{ width: "50%" }} />
                </Col>
                <Col sm={12} className="py-5">
                    <h1 className="text-center">Bienvenido</h1>
                </Col>
                <Col sm={12}>
                    <h4>Un bot de economía de la familia StarLight</h4>
                </Col>
                <Col sm={12}>
                    <div className="col-2">
                        <a href="https://top.gg/bot/696723299459268728">
                            <img src="https://top.gg/api/widget/status/696723299459268728.svg?noavatar=true" alt="StarLight" />
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
