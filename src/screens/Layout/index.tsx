import { Outlet } from 'react-router-dom';

import { NavBar, Footer } from '@app/components';
import { EventRegister } from '@app/helpers';

export const Layout = () => {
    const onScroll = (e: unknown) => {
        EventRegister.emit('scroll', e);
    };

    return (
        <div style={{ height: '100vh', overflowY: 'hidden' }}>
            <NavBar />
            <div style={{ height: '85vh', overflowY: 'scroll' }} onScroll={onScroll}>
                <div className="container-fluid p-4">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    );
};
