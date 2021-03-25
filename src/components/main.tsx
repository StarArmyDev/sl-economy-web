import { Row, Container, Col } from "react-bootstrap";
import { Component } from "react";
import splash from "../img/splash.png";

export class Main extends Component {
    render() {
        return (
            <Container>
                <Row className="text-center">
                    <Col sm={12} className="py-5">
                        <img src={splash} alt="Banner StarLight-E" style={{ width: "50%" }} />
                    </Col>

                    <Col md={12}>
                        <ins
                            className="adsbygoogle"
                            style={{ display: "block" }}
                            data-ad-client="ca-pub-2365658233726619"
                            data-ad-slot="5039508803"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        ></ins>
                        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                    </Col>
                    <Col sm={12} className="py-5">
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                        <ins
                            className="adsbygoogle"
                            data-ad-layout="in-article"
                            data-ad-format="fluid"
                            data-ad-client="ca-pub-2365658233726619"
                            data-ad-slot="2834496414"
                        ></ins>
                        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
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
}
