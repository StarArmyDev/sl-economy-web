import { Component } from "react";
import { Link } from "react-router-dom";

export class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="container">
                    <div className="row gx-5 text-center">
                        <div className="col p-4 text-center">
                            <div className="p-1">
                                StarLight un bot proporcionado por{" "}
                                <Link to="/support" rel="noreferrer" style={{ textDecoration: "none" }}>
                                    StarArmy
                                </Link>
                            </div>
                            <div className="p-1">Todos los derechos reservados</div>
                        </div>
                        <div className="col gx-5">
                            <div className="row p-4 text-center">
                                <Link to="/" className="nav-link p-1">
                                    Términos de Uso
                                </Link>
                                <Link to="/" className="nav-link p-1">
                                    Privacidad
                                </Link>
                                <Link to="/" className="nav-link p-1">
                                    Política de cookies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
