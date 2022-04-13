import { Outlet } from "react-router-dom";
import { NavBar, Footer } from ".";

export const Layout = ({ user, load, reloaderGuilds }: { user: any; load: boolean; reloaderGuilds: () => Promise<void | null> }) => {
    return (
        <>
            <NavBar user={user} loading={load} reloaderGuilds={reloaderGuilds} />
            <div className="container-fluid p-4">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};
