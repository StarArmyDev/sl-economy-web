import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import React from 'react';

import { useAppSelector } from '@app/storage';
import LogoTrack from '@img/logo-track.png';

export const ErrorUnknown = () => {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.web.user);

    const onReturn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        window.history.back();
    };
    const onHome = () => {
        if (user) navigate('/indicators');
        else navigate('/login');
    };

    return (
        <div className="altocien">
            <Helmet>
                <title>Opps</title>
            </Helmet>

            <div className="image-track">
                <div className="center">
                    <div className="box-login-with">
                        <div className="box-login-logo">
                            <img src={LogoTrack} alt="" />
                        </div>
                        <div className="text-light p-4 text-black">
                            <h2>
                                <p>
                                    <i className="material-icons" style={{ fontSize: '300%' }}>
                                        error_outline
                                    </i>
                                </p>
                                Opps!
                            </h2>
                        </div>
                        <h5 className="text-light pb-4 text-black">Ocurrió un error inesperado.</h5>

                        <Button size="lg" variant="secondary" onClick={onReturn}>
                            <i className="material-icons align-middle">reply</i>Volver
                        </Button>
                        <div className="col-12 p-2">
                            <Button size="lg" variant="primary" onClick={onHome}>
                                <i className="material-icons align-middle">home</i>Ir al inicio
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
