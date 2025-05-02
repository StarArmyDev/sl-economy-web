import { SkeletonTheme } from 'react-loading-skeleton';
import { Outlet } from 'react-router-dom';

import { NavBar, Footer } from '@app/components';
import { EventRegister } from '@app/helpers';

import 'react-loading-skeleton/dist/skeleton.css';

export const Layout = () => {
    const onScroll = (e: unknown) => {
        EventRegister.emit('scroll', e);
    };

    return (
        <div style={{ height: '100vh', overflowY: 'hidden' }}>
            <NavBar />
            <div style={{ height: '100%', overflowY: 'scroll' }} onScroll={onScroll}>
                <div className="container-fluid p-4">
                    <SkeletonTheme baseColor="rgba(200, 140, 51, 0.6)" highlightColor="rgb(237, 191, 16)">
                        <Outlet />
                    </SkeletonTheme>
                </div>
                <Footer />
            </div>
        </div>
    );
};
