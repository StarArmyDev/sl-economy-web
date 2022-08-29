import { Outlet } from "react-router-dom";
import { IUserObjet } from "interfaces";
import { NavBar, Footer } from ".";

export const Layout = ({ user }: { user: IUserObjet | null }) => {
    return (
        <>
            <NavBar user={user} />
            <div className="container-fluid p-4">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};
