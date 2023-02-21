import { Outlet } from 'react-router-dom';

import type { IUserObjet } from '@app/models';
import { EventRegister } from '@app/helpers';
import { NavBar, Footer } from '.';

export const Layout = ({ user }: { user?: IUserObjet }) => {
    const onScroll = (e: unknown) => {
        EventRegister.emit('scroll', e);
    };

    return (
        <div style={{ height: '100vh', overflowY: 'hidden' }}>
            <NavBar user={user} />
            <div style={{ height: '85vh', overflowY: 'scroll' }} onScroll={onScroll}>
                <div className="container-fluid p-4">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    );
};
