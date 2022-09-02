import type { IUserObjet } from "interfaces";
import { Outlet } from "react-router-dom";
import { EventRegister } from "libs";
import { NavBar, Footer } from ".";

export const Layout = ({ user }: { user?: IUserObjet }) => {
    const onScroll = (e: any) => {
        EventRegister.emit("scroll", e);
    };

    return (
        <>
            <NavBar user={user} />
            <div
                style={{
                    height: "85vh",
                    overflowY: "scroll"
                }}
                onScroll={onScroll}
            >
                <div className="container-fluid p-4">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    );
};
