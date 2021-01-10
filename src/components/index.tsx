import { Component } from 'react';
import { Link } from 'react-router-dom';
import splash from '../img/splash.png';

export default class Index extends Component {
    render() {
        return (
            <div className="row text-center">
                <div className="py-5 col-12">
                    <img src={splash} alt="Banner StarLight-E" style={{ width: '50%' }} />
                </div>
                <div className="col-12">
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    {/*Anuncio Gráfico*/}
                    <ins
                        className="adsbygoogle"
                        data-ad-client="ca-pub-2365658233726619"
                        data-ad-slot="9212396026"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    ></ins>
                    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                </div>
                <div className="py-5 col-12">
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <ins
                        className="adsbygoogle"
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-2365658233726619"
                        data-ad-slot="2834496414"
                    ></ins>
                    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                </div>
                <div className="py-5 col-12">
                    <h1 className="text-center">Bienvenido</h1>
                </div>
                <div className="col-12">
                    <h4>Un bot de economía de la familia StarLight</h4>
                </div>
                <div className="col-12">
                    <div className="col-2">
                        <Link to="https://top.gg/bot/696723299459268728">
                            <img src="https://top.gg/api/widget/status/696723299459268728.svg?noavatar=true" alt="StarLight" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
