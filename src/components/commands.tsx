import { Component } from 'react';

export default class Commands extends Component {
    render() {
        return (
            <div className="container text-center">
                <div className="row align-items-center">
                    <h2 className="col-12 ">Sección en construcción...</h2>
                    <div className="col-12">
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Comandos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>
                                        <strong>&#8203;Comandos núcleo de StarLight</strong>
                                    </th>
                                    <th>botsuggestion, bugreport, donate, help, invite, ping, release, stats, vote.</th>
                                </tr>
                                <tr>
                                    <th>
                                        <strong>&#8203;Configuración</strong>
                                    </th>
                                    <th>
                                        addchatexclude, addmoney, clearitems, createitem, deletechatexclude, deleteitem, deletemoney, edititem, lock,
                                        restareconomy, setcooldown, setcurrency, setfineamount, setmoney, setpayout, unlock
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        <strong>&#8203;Configuración Bot</strong>
                                    </th>
                                    <th>
                                        addblacklist, addwhitelist, config, deleteblacklist, deletelanguage, deleteprefix, deletewhitelist, setlanguage,
                                        setprefix.
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        <strong>&#8203;Economía</strong>
                                    </th>
                                    <th>bal, crime, daily, deposite, dice, flicoin, rob, top, trade, trans, withdraw, work.</th>
                                </tr>
                                <tr>
                                    <th>
                                        <strong>&#8203;Artículos</strong>
                                    </th>
                                    <th>buy, inventory, iteminfo, loot, sell, shop, transitem, use.</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
